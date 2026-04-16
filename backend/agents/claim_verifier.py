"""
Claim Verification Agent (VC Mode Feature 05)
Verifies each claim against live web evidence via Tavily API.
"""
import uuid
from backend.services.llm import chat_json
from backend.services.web_search import search_for_claim
from backend.utils.prompts import (
    CLAIM_VERIFY_SYSTEM, CLAIM_VERIFY_USER,
    BATCH_CLAIM_VERIFY_SYSTEM, BATCH_CLAIM_VERIFY_USER
)

def verify_claim(claim: dict) -> dict:
    """
    Verify a single claim against live web evidence.
    Returns enriched claim dict with verdict, confidence, reasoning, sources.
    """
    claim_text = claim.get("text", "")
    page_number = claim.get("page_number", 0)
    category = claim.get("category", "general")
    context = claim.get("context", "")

    # 1. Search for evidence
    print(f"[Verifier DEBUG] Verifying: {claim_text[:50]}")
    evidence_results = search_for_claim(claim_text, context)
    
    if evidence_results:
        top_res = evidence_results[0]
        print(f"[Verifier DEBUG] Top Evidence: {top_res.get('title', 'No Title')} ({top_res.get('url', 'No URL')})")
    else:
        print(f"[Verifier DEBUG] Zero evidence found for this claim.")

    # 2. Format evidence for LLM
    evidence_text = ""
    for i, e in enumerate(evidence_results, 1):
        evidence_text += f"\n[{i}] {e['title']}\n    URL: {e['url']}\n    Content: {e['snippet']}\n"

    if not evidence_text.strip():
        evidence_text = "No web evidence found for this claim."

    # 3. Get LLM verdict (Injecting salt to bust any possible internal API caching)
    request_id = str(uuid.uuid4())[:8]
    result = chat_json(
        system_prompt=CLAIM_VERIFY_SYSTEM + f"\n\nTransaction-ID: {request_id}",
        user_prompt=CLAIM_VERIFY_USER.format(
            claim=claim_text,
            page_number=page_number,
            category=category,
            evidence=evidence_text,
        ),
    )

    return {
        "claim": claim_text,
        "page_number": page_number,
        "category": category,
        "verdict": result.get("verdict", "UNVERIFIABLE"),
        "confidence": result.get("confidence", 0.5),
        "reasoning": result.get("reasoning", ""),
        "evidence_sources": evidence_results,
        "repair_suggestion": None,
    }


def batch_verify_claims(claims: list[dict]) -> list[dict]:
    """
    Verify all claims in a single LLM call with ID-based matching.
    """
    if not claims:
        return []
        
    print(f"[Verifier] Structuring batch evidence for {len(claims)} claims with ID tracking...")
    
    # 1. Gather all evidence
    batch_context = ""
    evidence_map = {}
    claim_id_map = {}
    
    for idx, claim in enumerate(claims):
        claim_id = f"C{idx+1}"
        claim_text = claim.get("text", "")
        claim_id_map[claim_id] = claim
        
        # Clean query for better search: Truncate very long visionary claims
        search_query = claim_text
        if len(search_query) > 120:
            # Take first 100 chars + any detected keywords
            search_query = search_query[:100] + "..."

        # Get evidence (fast, no LLM)
        evidence_results = search_for_claim(search_query, claim.get("context", ""))
        evidence_map[claim_id] = evidence_results
        
        # Format evidence block with ID
        ev_text = ""
        for i, e in enumerate(evidence_results, 1):
            ev_text += f"  [{i}] {e['title']} - {e['snippet'][:200]}...\n"
        
        if not ev_text:
            ev_text = "  No direct web evidence found for this specific claim.\n"
            
        batch_context += f"[ID: {claim_id}]\nCLAIM: {claim_text}\nEVIDENCE:\n{ev_text}\n---\n"

    # 2. Make SINGLE LLM Call
    print(f"[Verifier] Doing batch LLM verification call with deep context...")
    request_id = str(uuid.uuid4())[:8]
    
    result = chat_json(
        system_prompt=BATCH_CLAIM_VERIFY_SYSTEM + f"\n\nTransaction-ID: {request_id}",
        user_prompt=BATCH_CLAIM_VERIFY_USER.format(batch_data=batch_context),
        max_tokens=12000 # Increased for deep context
    )
    
    # 3. Match outputs to claims via ID
    verdicts = result.get("verdicts", [])
    verdict_dict = { str(v.get("claim_id", "")): v for v in verdicts }
    
    final_results = []
    for claim_id, original_claim in claim_id_map.items():
        v = verdict_dict.get(claim_id)
        
        # Positional fallback if LLM ignored IDs
        if not v and len(verdicts) == len(claims):
            idx = int(claim_id[1:]) - 1
            v = verdicts[idx]
        
        if not v:
            print(f"[Verifier] WARNING: No verdict found for ID {claim_id}. Using fallback.")
            v = {}
        
        final_results.append({
            "claim": original_claim.get("text", ""),
            "page_number": original_claim.get("page_number", 0),
            "category": original_claim.get("category", "general"),
            "verdict": v.get("verdict", "UNVERIFIABLE"),
            "confidence": v.get("confidence", 0.5),
            "reasoning": v.get("reasoning", "Analysis could not be mapped."),
            "evidence_sources": evidence_map.get(claim_id, []),
            "repair_suggestion": None,
        })
        
    return final_results
