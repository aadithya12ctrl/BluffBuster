"""
BluffBuster Backend — FastAPI app with REST + WebSocket endpoints.

Endpoints:
  POST /api/analyze          — Upload PDF + mode, returns session_id
  GET  /api/session/{id}     — Get analysis results
  GET  /api/session/{id}/heatmap — Get truth heatmap data
  POST /api/debate/{id}/intervene — User intervenes in debate
  WS   /ws/{session_id}      — Live stream of claim verdicts + debate
"""
import os
import sys
import json
import asyncio
from typing import Dict
from concurrent.futures import ThreadPoolExecutor

from fastapi import FastAPI, UploadFile, File, Form, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Add parent directory to path so imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.pdf_extractor import extract_pages
from backend.services.db import create_session, update_session_status, save_full_result, get_session, get_full_result
from backend.agents.graph import run_analysis

app = FastAPI(
    title="BluffBuster API",
    description="Forensic pitch deck analysis — Lies are obvious. Exaggerated truths aren't.",
    version="1.0.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Thread pool for running blocking analysis
executor = ThreadPoolExecutor(max_workers=2)

# Store active WebSocket connections and analysis results
active_connections: Dict[str, WebSocket] = {}
analysis_cache: Dict[str, dict] = {}


@app.get("/")
async def root():
    return {"message": "BluffBuster API v1.0 — Lies are obvious. Exaggerated truths aren't."}


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/analyze")
async def analyze_deck(
    file: UploadFile = File(...),
    mode: str = Form("vc"),
    persona: str = Form("standard"),
):
    """Upload a PDF pitch deck and start analysis."""
    if mode not in ("founder", "vc"):
        raise HTTPException(status_code=400, detail="Mode must be 'founder' or 'vc'")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Save uploaded file
    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    # Create session
    session_id = create_session(mode, file.filename)

    # Extract pages
    try:
        pages = extract_pages(file_path=file_path)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract PDF: {str(e)}")

    if not pages or all(not p["text"] for p in pages):
        raise HTTPException(status_code=400, detail="No text found in PDF. Is this a scanned/image-only PDF?")

    # Run analysis in background thread
    asyncio.get_event_loop().run_in_executor(
        executor,
        _run_analysis_sync,
        session_id, mode, pages, file_path, persona
    )

    return {
        "session_id": session_id,
        "mode": mode,
        "filename": file.filename,
        "pages_extracted": len(pages),
        "status": "processing",
        "message": "Analysis started. Poll GET /api/session/{session_id} for results.",
    }


def _run_analysis_sync(session_id: str, mode: str, pages: list, file_path: str, persona: str):
    """Run analysis synchronously in a thread."""
    try:
        result = run_analysis(session_id, mode, pages, persona)

        # Make serializable
        serializable = json.loads(json.dumps(result, default=str))
        analysis_cache[session_id] = serializable
        save_full_result(session_id, serializable)
        update_session_status(session_id, "complete")
        print(f"[BluffBuster] OK Session {session_id} complete!")

    except Exception as e:
        print(f"[BluffBuster] ERROR Session {session_id} error: {e}")
        import traceback
        traceback.print_exc()
        update_session_status(session_id, "error")

    finally:
        try:
            os.remove(file_path)
        except Exception:
            pass


@app.get("/api/session/{session_id}")
async def get_session_results(session_id: str):
    """Get analysis results for a session."""
    if session_id in analysis_cache:
        return {
            "session_id": session_id,
            "status": "complete",
            "results": analysis_cache[session_id],
        }

    session = get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    result = get_full_result(session_id)
    if result:
        return {
            "session_id": session_id,
            "status": "complete",
            "results": result,
        }

    return {
        "session_id": session_id,
        "status": session.get("status", "processing"),
        "results": None,
    }


@app.get("/api/session/{session_id}/heatmap")
async def get_heatmap(session_id: str):
    """Get truth heatmap data."""
    result = analysis_cache.get(session_id) or get_full_result(session_id)
    if not result:
        raise HTTPException(status_code=404, detail="Session not found or analysis not complete")

    return {
        "session_id": session_id,
        "heatmap": result.get("heatmap", []),
        "overall_trust_score": result.get("overall_trust_score", 0.0),
    }


@app.post("/api/debate/{session_id}/intervene")
async def debate_intervene(session_id: str, message: dict):
    """User intervenes in the adversarial debate."""
    user_input = message.get("message", "")
    claim = message.get("claim", "")

    if not user_input:
        raise HTTPException(status_code=400, detail="Message is required")

    result = analysis_cache.get(session_id) or get_full_result(session_id)
    if not result:
        raise HTTPException(status_code=404, detail="Session not found")

    claim_results = result.get("claim_results", [])
    target_claim = None
    for c in claim_results:
        if claim and claim.lower() in c["claim"].lower():
            target_claim = c
            break
    if not target_claim and claim_results:
        target_claim = claim_results[0]

    from backend.services.llm import chat_json
    from backend.utils.prompts import JUDGE_SYSTEM, JUDGE_USER

    debate_msgs = result.get("debate", [])
    defender_arg = ""
    prosecutor_arg = ""
    for msg in debate_msgs:
        if msg.get("claim_ref", "").lower() == (target_claim or {}).get("claim", "").lower():
            if msg["role"] == "defender":
                defender_arg = msg["content"]
            elif msg["role"] == "prosecutor":
                prosecutor_arg = msg["content"]

    ruling = chat_json(
        system_prompt=JUDGE_SYSTEM,
        user_prompt=JUDGE_USER.format(
            claim=target_claim["claim"] if target_claim else claim,
            defender_argument=defender_arg or "No defense presented.",
            prosecutor_argument=prosecutor_arg or "No prosecution presented.",
            user_intervention=f"\nUSER DIRECTION: {user_input}" if user_input else "",
        ),
    )

    return {
        "ruling": ruling,
        "claim": target_claim["claim"] if target_claim else claim,
    }


@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket for polling analysis status."""
    await websocket.accept()
    active_connections[session_id] = websocket

    try:
        while True:
            # Check if results are ready
            if session_id in analysis_cache:
                await websocket.send_json({
                    "type": "analysis_complete",
                    "data": analysis_cache[session_id],
                })
                break

            session = get_session(session_id)
            if session and session.get("status") == "error":
                await websocket.send_json({
                    "type": "error",
                    "data": {"message": "Analysis failed"},
                })
                break

            await websocket.send_json({"type": "status", "data": {"status": "processing"}})
            await asyncio.sleep(3)

    except WebSocketDisconnect:
        pass
    finally:
        active_connections.pop(session_id, None)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
