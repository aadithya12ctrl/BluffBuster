"""
LLM-powered claim extraction — identifies factual, quantitative,
and comparative claims from extracted pitch deck text.
"""
from backend.services.llm import chat_json
from backend.utils.prompts import CLAIM_EXTRACTION_SYSTEM, CLAIM_EXTRACTION_USER


def extract_claims(full_text: str) -> list[dict]:
    """
    Extract claims from pitch deck text using LLM.
    Returns list of {text, page_number, category, context}.
    """
    result = chat_json(
        system_prompt=CLAIM_EXTRACTION_SYSTEM,
        user_prompt=CLAIM_EXTRACTION_USER.format(deck_text=full_text),
        temperature=0.2,
        max_tokens=4096,
    )

    print(f"[Extractor] Raw result: {str(result)[:500]}...")
    claims = result.get("claims", [])

    # Normalize
    normalized = []
    for c in claims:
        normalized.append({
            "text": c.get("text", c.get("claim", "")),
            "page_number": c.get("page_number", c.get("page", 0)),
            "category": c.get("category", "general"),
            "context": c.get("context", ""),
        })

    return normalized
