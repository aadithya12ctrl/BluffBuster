"""
Prosecutor Agent (Adversarial Debate — argues AGAINST with evidence)
"""
from backend.services.llm import chat
from backend.utils.prompts import PROSECUTOR_SYSTEM, PROSECUTOR_USER


def prosecute_claim(claim: str, verdict: str, evidence: str, persona: str = "standard") -> str:
    """
    Generate a prosecution argument against a flagged claim.
    """
    from backend.utils.investors import get_persona_prompt_injection
    fingerprint = get_persona_prompt_injection(persona)

    return chat(
        system_prompt=PROSECUTOR_SYSTEM + "\n" + fingerprint,
        user_prompt=PROSECUTOR_USER.format(
            claim=claim,
            verdict=verdict,
            evidence=evidence,
        ),
        temperature=0.0,  # Lower temperature for more factual prosecution
    )
