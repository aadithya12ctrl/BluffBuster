"""
Defender Agent (Adversarial Debate — argues FOR the founder)
"""
from backend.services.llm import chat
from backend.utils.prompts import DEFENDER_SYSTEM, DEFENDER_USER


def defend_claim(claim: str, verdict: str, evidence_against: str, persona: str = "standard") -> str:
    """
    Generate a defense argument for a flagged claim.
    """
    from backend.utils.investors import get_persona_prompt_injection
    fingerprint = get_persona_prompt_injection(persona)

    return chat(
        system_prompt=DEFENDER_SYSTEM + "\n" + fingerprint,
        user_prompt=DEFENDER_USER.format(
            claim=claim,
            verdict=verdict,
            evidence_against=evidence_against,
        ),
        temperature=0.5,
    )
