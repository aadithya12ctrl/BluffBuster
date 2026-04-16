"""
Competitor Blind Spot Detector (Founder Mode Feature 04)
Finds competitors the founder didn't mention.
"""
from backend.services.llm import chat_json
from backend.services.web_search import search_competitors, search
from backend.utils.prompts import COMPETITOR_BLIND_SYSTEM, COMPETITOR_BLIND_USER


def detect_blind_spots(deck_text: str) -> dict:
    """
    Find competitors the founder missed and advise how to address them.
    """
    # Search for competitors based on the deck content
    competitor_results = search_competitors(deck_text[:500])

    # Also search more specifically
    extra_results = search(
        f"startups similar to {deck_text[:200]} competitors funding",
        max_results=5,
    )

    all_results = competitor_results + extra_results

    search_text = ""
    for r in all_results:
        search_text += f"\n{r['title']}: {r['snippet']}\nURL: {r['url']}\n---"

    result = chat_json(
        system_prompt=COMPETITOR_BLIND_SYSTEM,
        user_prompt=COMPETITOR_BLIND_USER.format(
            deck_text=deck_text,
            competitor_data=search_text,
        ),
    )

    return result
