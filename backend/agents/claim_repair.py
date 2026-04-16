"""
Claim Repair Engine (Founder Mode Feature 02)
Suggests minimum viable fix for each weak/false claim.
"""
from backend.services.llm import chat_json
from backend.services.web_search import search_for_claim
from backend.utils.prompts import CLAIM_REPAIR_SYSTEM, CLAIM_REPAIR_USER


def repair_claims(claim_results: list[dict]) -> list[dict]:
    """
    For claims that are FALSE or EXAGGERATED, suggest minimum viable fixes.
    Returns the same claims with repair_suggestion populated.
    """
    # Filter to claims needing repair
    needs_repair = [c for c in claim_results if c.get("verdict") in ("FALSE", "EXAGGERATED")]

    if not needs_repair:
        return claim_results

    # Format for LLM
    claims_text = ""
    for c in needs_repair:
        claims_text += f"\nCLAIM: {c['claim']}\nVERDICT: {c['verdict']}\nREASONING: {c.get('reasoning', '')}\n---"

    # Get additional evidence for repair
    all_evidence = ""
    for c in needs_repair[:5]:  # Limit to 5 to avoid rate limits
        evidence = search_for_claim(c["claim"], "market data statistics")
        for e in evidence[:3]:
            all_evidence += f"\n{e['title']}: {e['snippet']}\n"

    result = chat_json(
        system_prompt=CLAIM_REPAIR_SYSTEM,
        user_prompt=CLAIM_REPAIR_USER.format(
            claims_with_verdicts=claims_text,
            evidence=all_evidence,
        ),
    )

    repairs = result.get("repairs", [])

    # Map repairs back to claim results
    repair_map = {}
    for r in repairs:
        original = r.get("original_claim", "")
        repair_map[original.lower().strip()] = r.get("repaired_claim", "")

    for c in claim_results:
        key = c["claim"].lower().strip()
        if key in repair_map:
            c["repair_suggestion"] = repair_map[key]

    return claim_results
