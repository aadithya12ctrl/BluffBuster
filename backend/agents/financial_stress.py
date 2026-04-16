"""
Financial Projection Stress Tester (Founder Mode Feature 03)
Benchmarks revenue projections against industry growth rates.
"""
from backend.services.llm import chat_json
from backend.services.web_search import search
from backend.utils.prompts import FINANCIAL_STRESS_SYSTEM, FINANCIAL_STRESS_USER


def stress_test_financials(deck_text: str) -> dict:
    """
    Stress test financial projections in the deck.
    """
    # Search for industry benchmarks
    industry_data_results = search(
        "startup growth rate benchmarks SaaS EdTech FinTech average revenue growth",
        max_results=5,
    )

    industry_text = ""
    for r in industry_data_results:
        industry_text += f"\n{r['title']}: {r['snippet']}\n"

    if not industry_text.strip():
        industry_text = "No specific industry benchmark data found. Use general startup growth benchmarks."

    result = chat_json(
        system_prompt=FINANCIAL_STRESS_SYSTEM,
        user_prompt=FINANCIAL_STRESS_USER.format(
            deck_text=deck_text,
            industry_data=industry_text,
        ),
        temperature=0.3,
    )

    return {
        "projections_found": result.get("projections_found", []),
        "benchmarks": result.get("benchmarks", []),
        "flags": result.get("flags", []),
        "overall_plausibility": result.get("overall_plausibility", 0.5),
    }
