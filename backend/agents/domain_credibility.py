"""
Domain Credibility Checker (VC Mode Feature 08)
Industry-specific benchmarking — no flat scoring.
"""
from backend.services.llm import chat_json
from backend.utils.prompts import DOMAIN_CREDIBILITY_SYSTEM, DOMAIN_CREDIBILITY_USER


def check_domain_credibility(deck_text: str, claim_results: list[dict]) -> dict:
    """
    Apply industry-specific evidentiary standards to claims.
    95% accuracy in medical AI ≠ 95% accuracy in a productivity app.
    """
    claims_text = ""
    for c in claim_results:
        claims_text += (
            f"\nCLAIM: {c['claim']}"
            f"\nVERDICT: {c['verdict']}"
            f"\nCATEGORY: {c.get('category', 'general')}"
            f"\n---"
        )

    result = chat_json(
        system_prompt=DOMAIN_CREDIBILITY_SYSTEM,
        user_prompt=DOMAIN_CREDIBILITY_USER.format(
            deck_text=deck_text,
            claims_with_verdicts=claims_text,
        ),
    )

    return result
