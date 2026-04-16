"""
LangGraph StateGraph Orchestrator — central pipeline for BluffBuster analysis.

Founder Mode flow:
  extract_claims → first_impression → verify_claims → claim_repair → financial_stress → competitor_blind → debate → heatmap

VC Mode flow:
  extract_claims → verify_claims → competitor_mapper → red_flag_scorer → domain_credibility → debate → heatmap
"""
from typing import TypedDict, Any
import concurrent.futures
import time
from langgraph.graph import StateGraph, END

from backend.services.pdf_extractor import get_first_n_pages, get_full_text
from backend.services.claim_extractor import extract_claims
from backend.services.embeddings import store_claims
from backend.agents.claim_verifier import verify_claim
from backend.agents.first_impression import analyze_first_impression
from backend.agents.claim_repair import repair_claims
from backend.agents.financial_stress import stress_test_financials
from backend.agents.competitor_blind import detect_blind_spots
from backend.agents.competitor_mapper import map_competitors
from backend.agents.red_flag_scorer import score_red_flags
from backend.agents.domain_credibility import check_domain_credibility
from backend.agents.defender import defend_claim
from backend.agents.prosecutor import prosecute_claim
from backend.agents.temporal_decay import analyze_temporal_decay


class AnalysisState(TypedDict):
    """State carried through the LangGraph pipeline."""
    session_id: str
    mode: str
    pages: list[dict]
    full_text: str
    claims: list[dict]
    claim_results: list[dict]
    first_impression: dict | None
    financial_stress: dict | None
    competitors: dict | None
    red_flags: dict | None
    domain_credibility: dict | None
    debate: list[dict]
    heatmap: list[dict]
    overall_trust_score: float
    investor_persona: str


# ─── NODE FUNCTIONS ───────────────────────────────────────────

def node_extract_claims(state: AnalysisState) -> dict:
    """Extract claims from the deck text."""
    print(f"[BluffBuster] Extracting claims... (Text length: {len(state['full_text'])} chars)")
    claims = extract_claims(state["full_text"])
    print(f"[BluffBuster] Found {len(claims)} claims")

    # Store embeddings
    try:
        store_claims(state["session_id"], claims)
    except Exception as e:
        print(f"[Embeddings] Warning: {e}")

    return {"claims": claims}


def node_verify_claims(state: AnalysisState) -> dict:
    """Verify all claims in a single batch to maximize speed and bypass rate-limits."""
    claims = state["claims"]
    total = len(claims)
    print(f"[BluffBuster] Verifying {total} claims in ONE batch...")

    try:
        from backend.agents.claim_verifier import batch_verify_claims
        claim_results = batch_verify_claims(claims)
        for idx, res in enumerate(claim_results):
            print(f"[BluffBuster]   -> Claim {idx+1}: {res['verdict']} ({res['confidence']})")
    except Exception as e:
        print(f"[BluffBuster]   -> BATCH VERIFICATION ERROR: {e}")
        # Fallback if the mega-prompt fails
        claim_results = [{
            "claim": c["text"],
            "page_number": c.get("page_number", 0),
            "category": c.get("category", "general"),
            "verdict": "UNVERIFIABLE",
            "confidence": 0.3,
            "reasoning": f"Batch verification failed: {str(e)}",
            "evidence_sources": [],
            "repair_suggestion": None,
        } for c in claims]

    return {"claim_results": claim_results}


def node_first_impression(state: AnalysisState) -> dict:
    """Analyze first 3 slides (Founder Mode)."""
    print("[BluffBuster] Analyzing first impression...")
    first_text = get_first_n_pages(state["pages"], 3)
    result = analyze_first_impression(first_text)
    print(f"[BluffBuster] First impression score: {result.get('overall_score', 'N/A')}")
    return {"first_impression": result}


def node_claim_repair(state: AnalysisState) -> dict:
    """Repair weak claims (Founder Mode)."""
    print("[BluffBuster] Generating claim repairs...")
    repaired = repair_claims(state["claim_results"])
    return {"claim_results": repaired}


def node_financial_stress(state: AnalysisState) -> dict:
    """Stress test financials (Founder Mode)."""
    print("[BluffBuster] Stress testing financial projections...")
    result = stress_test_financials(state["full_text"])
    return {"financial_stress": result}


def node_competitor_blind(state: AnalysisState) -> dict:
    """Find competitor blind spots (Founder Mode)."""
    print("[BluffBuster] Scanning for competitor blind spots...")
    result = detect_blind_spots(state["full_text"])
    return {"competitors": result}


def node_competitor_mapper(state: AnalysisState) -> dict:
    """Map competitor trajectories (VC Mode)."""
    print("[BluffBuster] Mapping competitor trajectories...")
    result = map_competitors(state["full_text"])
    return {"competitors": result}


def node_red_flag_scorer(state: AnalysisState) -> dict:
    """Score red flags (VC Mode)."""
    print(f"[BluffBuster] Scoring red flags as {state['investor_persona']}...")
    result = score_red_flags(state["claim_results"], state["investor_persona"])
    return {"red_flags": result}


def node_domain_credibility(state: AnalysisState) -> dict:
    """Check domain credibility (VC Mode)."""
    print("[BluffBuster] Checking domain credibility...")
    result = check_domain_credibility(state["full_text"], state["claim_results"])
    return {"domain_credibility": result}


def node_temporal_decay(state: AnalysisState) -> dict:
    """Analyze the shelf-life/decay of verified claims."""
    print("[BluffBuster] Analyzing temporal claim decay...")
    enriched_claims = analyze_temporal_decay(state["claim_results"], state["full_text"])
    return {"claim_results": enriched_claims}


def node_debate(state: AnalysisState) -> dict:
    """Run adversarial debate on flagged claims synchronously in ONE batch call with ID tracking."""
    print("[BluffBuster] Starting adversarial debate with ID tracking...")
    debate_messages = []

    # Pick top 3 most contentious claims for debate
    flagged = [c for c in state["claim_results"] if c["verdict"] in ("FALSE", "EXAGGERATED")]
    debate_claims = flagged[:3] if flagged else state["claim_results"][:2]
    
    if not debate_claims:
        return {"debate": []}

    # 1. Format batch prompt with IDs
    batch_claims_text = ""
    claim_id_map = {}
    for idx, claim_result in enumerate(debate_claims):
        claim_id = f"D{idx+1}"
        claim_text = claim_result["claim"]
        claim_id_map[claim_id] = claim_result
        
        # Format evidence
        evidence_text = claim_result.get("reasoning", "")
        sources = claim_result.get("evidence_sources", [])
        for s in sources:
            evidence_text += f"\n- {s.get('title', '')}: {s.get('snippet', '')}"
            
        batch_claims_text += f"[ID: {claim_id}]\nCLAIM: {claim_text}\nVERDICT: {claim_result['verdict']}\nEVIDENCE: {evidence_text[:1000]}...\n\n"

    # 2. Batch LLM call
    print(f"[BluffBuster]   Evaluating {len(debate_claims)} claims in batch debate...")
    from backend.services.llm import chat_json
    from backend.utils.prompts import BATCH_DEBATE_SYSTEM, BATCH_DEBATE_USER
    
    try:
        result = chat_json(
            system_prompt=BATCH_DEBATE_SYSTEM,
            user_prompt=BATCH_DEBATE_USER.format(batch_claims=batch_claims_text),
            max_tokens=4000
        )
        
        debates = result.get("debates", [])
        debate_dict = { str(d.get("claim_id", "")): d for d in debates }
        
        # 3. Process outputs via ID
        for claim_id, original_claim in claim_id_map.items():
            d = debate_dict.get(claim_id)
            
            # Positional fallback
            if not d and len(debates) == len(debate_claims):
                idx = int(claim_id[1:]) - 1
                d = debates[idx]
            
            if not d:
                continue
                
            c_text = original_claim["claim"]
            sources = original_claim.get("evidence_sources", [])
            
            # Defender argues
            debate_messages.append({
                "role": "defender",
                "content": d.get("defender_argument", "No defense created."),
                "claim_ref": c_text,
                "sources": [],
            })
            
            # Prosecutor argues
            debate_messages.append({
                "role": "prosecutor",
                "content": d.get("prosecutor_argument", "No prosecution created."),
                "claim_ref": c_text,
                "sources": [{"title": s.get("title", ""), "url": s.get("url", "")} for s in sources],
            })
            
    except Exception as e:
        print(f"[BluffBuster]   BATCH DEBATE ERROR: {e}")

    print(f"[BluffBuster] Debate complete: {len(debate_messages)} messages")
    return {"debate": debate_messages}


def node_heatmap(state: AnalysisState) -> dict:
    """Generate truth heatmap from claim verdicts."""
    print("[BluffBuster] Generating truth heatmap...")
    heatmap = {}

    for c in state["claim_results"]:
        page = c["page_number"]
        if page not in heatmap:
            heatmap[page] = {"page_number": page, "claims": [], "scores": []}
        heatmap[page]["claims"].append(c)

        score_map = {"VERIFIED": 1.0, "EXAGGERATED": 0.5, "FALSE": 0.0, "UNVERIFIABLE": 0.5}
        heatmap[page]["scores"].append(score_map.get(c["verdict"], 0.5))

    result = []
    for page_num in sorted(heatmap.keys()):
        entry = heatmap[page_num]
        scores = entry["scores"]
        avg_score = sum(scores) / len(scores) if scores else 0.5
        color = "green" if avg_score > 0.7 else ("amber" if avg_score > 0.3 else "red")
        result.append({
            "page_number": page_num,
            "claims": entry["claims"],
            "page_score": round(avg_score, 2),
            "dominant_color": color,
        })

    # Overall trust score (Weighted by category importance)
    weighted_scores = []
    total_weight = 0
    
    # 70% weight to "Hard" business metrics, 30% to "Soft" operational claims
    WEIGHT_MAP = {
        "tam": 3.0, "growth": 3.0, "financial": 3.0, "competitor": 3.0,
        "team": 1.0, "technical": 1.0, "general": 1.0
    }
    
    for c in state["claim_results"]:
        verdict_score_map = {"VERIFIED": 1.0, "EXAGGERATED": 0.5, "FALSE": 0.0, "UNVERIFIABLE": 0.5}
        score = verdict_score_map.get(c["verdict"], 0.5)
        weight = WEIGHT_MAP.get(c["category"], 1.0)
        
        weighted_scores.append(score * weight)
        total_weight += weight
        
    overall = sum(weighted_scores) / total_weight if total_weight > 0 else 0.5
    
    print(f"[BluffBuster] Overall trust score (weighted): {overall:.2f}")
    return {"heatmap": result, "overall_trust_score": round(overall, 2)}


# ─── GRAPH BUILDERS ──────────────────────────────────────────

def build_founder_graph():
    """Build the Founder Mode analysis pipeline."""
    graph = StateGraph(AnalysisState)

    graph.add_node("extract_claims", node_extract_claims)
    graph.add_node("first_impression", node_first_impression)
    graph.add_node("verify_claims", node_verify_claims)
    graph.add_node("temporal_decay", node_temporal_decay)
    graph.add_node("claim_repair", node_claim_repair)
    graph.add_node("financial_stress", node_financial_stress)
    graph.add_node("competitor_blind", node_competitor_blind)
    graph.add_node("debate", node_debate)
    graph.add_node("heatmap", node_heatmap)

    graph.set_entry_point("extract_claims")
    graph.add_edge("extract_claims", "first_impression")
    graph.add_edge("first_impression", "verify_claims")
    graph.add_edge("verify_claims", "temporal_decay")
    graph.add_edge("temporal_decay", "claim_repair")
    graph.add_edge("claim_repair", "financial_stress")
    graph.add_edge("financial_stress", "competitor_blind")
    graph.add_edge("competitor_blind", "debate")
    graph.add_edge("debate", "heatmap")
    graph.add_edge("heatmap", END)

    return graph.compile()


def build_vc_graph():
    """Build the VC Mode analysis pipeline."""
    graph = StateGraph(AnalysisState)

    graph.add_node("extract_claims", node_extract_claims)
    graph.add_node("verify_claims", node_verify_claims)
    graph.add_node("temporal_decay", node_temporal_decay)
    graph.add_node("competitor_mapper", node_competitor_mapper)
    graph.add_node("red_flag_scorer", node_red_flag_scorer)
    graph.add_node("domain_credibility", node_domain_credibility)
    graph.add_node("debate", node_debate)
    graph.add_node("heatmap", node_heatmap)

    graph.set_entry_point("extract_claims")
    graph.add_edge("extract_claims", "verify_claims")
    graph.add_edge("verify_claims", "temporal_decay")
    workflow_vc = graph # graph or workflow_vc? Looking at code it was locally named graph
    graph.add_edge("temporal_decay", "competitor_mapper")
    graph.add_edge("competitor_mapper", "red_flag_scorer")
    graph.add_edge("red_flag_scorer", "domain_credibility")
    graph.add_edge("domain_credibility", "debate")
    graph.add_edge("debate", "heatmap")
    graph.add_edge("heatmap", END)

    return graph.compile()


def run_analysis(session_id: str, mode: str, pages: list[dict], investor_persona: str = "standard") -> dict:
    """
    Run the full analysis pipeline synchronously.
    Returns the final state with all results.
    """
    full_text = get_full_text(pages)

    initial_state: AnalysisState = {
        "session_id": session_id,
        "mode": mode,
        "pages": pages,
        "full_text": full_text,
        "claims": [],
        "claim_results": [],
        "first_impression": None,
        "financial_stress": None,
        "competitors": None,
        "red_flags": None,
        "domain_credibility": None,
        "debate": [],
        "heatmap": [],
        "overall_trust_score": 0.0,
        "investor_persona": investor_persona or "standard",
    }

    print(f"[BluffBuster] Starting {mode.upper()} mode analysis for session {session_id}")

    if mode == "founder":
        graph = build_founder_graph()
    else:
        graph = build_vc_graph()

    final_state = graph.invoke(initial_state)
    print(f"[BluffBuster] Analysis complete for session {session_id}")

    return final_state
