"""
Investor Fingerprint Library — The DNA and "Thesis" of major VC firms.
Used to bias the forensic analysis and red flag scoring.
"""

INVESTOR_PROFILES = {
    "standard": {
        "name": "Standard Due Diligence",
        "color": "#00F096", # forensic green
        "thesis": "Balanced forensic audit across TAM, Tech, and Growth.",
        "red_flag_priority": "Verify everything. Trust no one without proof.",
        "debate_persona": "Cynical but fair auditor.",
        "icon": "Microscope"
    },
    "sequoia": {
        "name": "Sequoia Capital",
        "color": "#004e1c", # seq green
        "thesis": "Market dominance and durable moats. Is this a multi-generational business?",
        "red_flag_priority": "TAM is everything. Penalize small markets brutally. Heavily scrutinize network effects and 'Defensibility'.",
        "debate_persona": "Elite historian looking for the next category king.",
        "icon": "Trees"
    },
    "yc": {
        "name": "Y Combinator",
        "color": "#ff6600", # yc orange
        "thesis": "Velocity, simplicity, and founder-market fit. Can they build fast?",
        "red_flag_priority": "Dislike bloated tech stacks and slow launch cycles. Prioritize growth-rate over revenue scale. Scrutinize 'Problem Clarity'.",
        "debate_persona": "Direct, no-BS product hacker.",
        "icon": "Zap"
    },
    "tiger": {
        "name": "Tiger Global",
        "color": "#000000", # sleek black/gold
        "thesis": "Aggressive scale and market landgrabs. Growth-at-any-cost.",
        "red_flag_priority": "Obsessed with YoY revenue growth and GMV velocity. Penalize low-multiple, low-growth sectors. Scrutinize 'Scale Velocity'.",
        "debate_persona": "High-velocity capital deployment strategist.",
        "icon": "TrendingUp"
    },
    "benchmark": {
        "name": "Benchmark",
        "color": "#0070f3", # blue
        "thesis": "Product-led growth and unit economics. Is the product a machine?",
        "red_flag_priority": "Penalize high CAC and marketing-led growth. Obsessed with retention and LTV/CAC ratios. Scrutinize 'Unit Economics'.",
        "debate_persona": "Deep technical analyzer focused on organic friction-less growth.",
        "icon": "Cpu"
    }
}

def get_fingerprint(persona_id: str) -> dict:
    return INVESTOR_PROFILES.get(persona_id.lower(), INVESTOR_PROFILES["standard"])

def get_persona_prompt_injection(persona_id: str) -> str:
    profile = get_fingerprint(persona_id)
    return (
        f"\n[INVESTOR LENS: {profile['name']}]\n"
        f"THESIS: {profile['thesis']}\n"
        f"PRIORITY: {profile['red_flag_priority']}\n"
    )
