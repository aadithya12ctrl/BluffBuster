"""
Investor Red Flag Scorer (VC Mode Feature 07)
Weighted scoring mimicking VC due diligence priorities.
"""
from backend.services.llm import chat_json
from backend.utils.prompts import RED_FLAG_SYSTEM, RED_FLAG_USER


def score_red_flags(claim_results: list[dict], persona: str = "standard") -> dict:
    """
    Score red flags with VC-weighted priorities.
    """
    claims_text = ""
    for c in claim_results:
        claims_text += (
            f"\nCLAIM: {c['claim']}"
            f"\nVERDICT: {c['verdict']}"
            f"\nCONFIDENCE: {c.get('confidence', 0)}"
            f"\nCATEGORY: {c.get('category', 'general')}"
            f"\nREASONING: {c.get('reasoning', '')}"
            f"\n---"
        )

    from backend.utils.investors import get_persona_prompt_injection
    fingerprint = get_persona_prompt_injection(persona)

    result = chat_json(
        system_prompt=RED_FLAG_SYSTEM + "\n" + fingerprint,
        user_prompt=RED_FLAG_USER.format(claims_with_verdicts=claims_text),
    )

    return result
