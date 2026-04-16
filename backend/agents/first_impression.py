"""
First Impression Analyzer (Founder Mode Feature 01)
Analyzes first 3 slides for hook strength, problem clarity, solution comprehension.
"""
from backend.services.llm import chat_json
from backend.utils.prompts import FIRST_IMPRESSION_SYSTEM, FIRST_IMPRESSION_USER


def analyze_first_impression(first_slides_text: str) -> dict:
    """
    Analyze the first 3 slides for first-impression impact.
    Returns scores and specific rewrites.
    """
    result = chat_json(
        system_prompt=FIRST_IMPRESSION_SYSTEM,
        user_prompt=FIRST_IMPRESSION_USER.format(slides_text=first_slides_text),
        temperature=0.3,
    )

    return {
        "problem_clarity": result.get("problem_clarity", 0.5),
        "hook_strength": result.get("hook_strength", 0.5),
        "solution_comprehension": result.get("solution_comprehension", 0.5),
        "overall_score": result.get("overall_score", 0.5),
        "feedback": result.get("feedback", ""),
        "rewrites": result.get("rewrites", []),
    }
