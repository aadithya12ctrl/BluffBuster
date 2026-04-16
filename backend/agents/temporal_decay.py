"""
Temporal Decay Agent — Calculates the "Shelf-Life" of startup claims.
Uses market velocity data to assess how fast a claim is likely to expire.
"""
import json
from ddgs import DDGS
from backend.services.llm import chat_json
from backend.utils.prompts import (
    BATCH_TEMPORAL_DECAY_SYSTEM, BATCH_TEMPORAL_DECAY_USER 
)

def get_market_velocity(sector: str) -> str:
    """Fetch recent competitive and funding activity for a sector without extra LLM calls."""
    print(f"[TemporalDecay] Fetching velocity data for sector: {sector}...")
    
    # Fast, hardcoded queries instead of LLM generation
    queries = [
        f"recent funding rounds in {sector} 2024",
        f"new entrants and competitors in {sector}"
    ]
    
    velocity_data = ""
    try:
        with DDGS() as ddgs:
            for q in queries:
                results = list(ddgs.text(q, max_results=3))
                for r in results:
                    velocity_data += f"\n- {r.get('title')}: {r.get('body')}"
    except Exception as e:
        print(f"[TemporalDecay] Search error: {e}")
        velocity_data = "No recent velocity data found. Assume standard decay rates."
        
    return velocity_data

def analyze_temporal_decay(claims: list[dict], full_text: str) -> list[dict]:
    """
    Apply temporal decay analysis to all claims in ONE batch LLM call with ID tracking.
    """
    if not claims:
        return []
        
    # 1. Identify Sector
    sector = claims[0].get("category", "General Tech") if claims else "General Tech"
    
    # 2. Get Market Velocity
    velocity_data = get_market_velocity(sector)
    
    # 3. Format batch claims with IDs
    batch_claims_text = ""
    claim_id_map = {}
    for idx, claim in enumerate(claims):
        claim_id = f"C{idx+1}"
        claim_id_map[claim_id] = claim
        batch_claims_text += f"[ID: {claim_id}] CLAIM: {claim.get('text', '')} | VERDICT: {claim.get('verdict', 'UNKNOWN')}\n"

    # 4. Batch Assess
    print(f"[TemporalDecay] Running batch decay analysis for {len(claims)} claims with ID tracking...")
    result = chat_json(
        system_prompt=BATCH_TEMPORAL_DECAY_SYSTEM,
        user_prompt=BATCH_TEMPORAL_DECAY_USER.format(
            velocity_data=velocity_data,
            batch_claims=batch_claims_text
        ),
        max_tokens=4000
    )
    
    decays = result.get("decays", [])
    decay_dict = { str(d.get("claim_id", "")): d for d in decays }
    
    enriched_results = []
    for claim_id, original_claim in claim_id_map.items():
        # Find match by ID
        d = decay_dict.get(claim_id)
        
        # Positional fallback
        if not d and len(decays) == len(claims):
            idx = int(claim_id[1:]) - 1
            d = decays[idx]
            
        if not d:
            d = {
                "freshness_score": 0.5,
                "estimated_expiry": "Unknown",
                "decay_reasoning": "Batch evaluation fallback."
            }
            
        enriched_results.append({
            **original_claim,
            "temporal_decay": {
                "freshness_score": d.get("freshness_score", 0.5),
                "estimated_expiry": d.get("estimated_expiry", "Unknown"),
                "decay_reasoning": d.get("decay_reasoning", "Standard market forces applied.")
            }
        })
        
    return enriched_results
