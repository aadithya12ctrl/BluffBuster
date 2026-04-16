"""
Competitor Trajectory Mapper (VC Mode Feature 06)
Surfaces competitors with funding history and trajectory comparison.
"""
from backend.services.llm import chat_json
from backend.services.web_search import search
from backend.utils.prompts import (
    COMPETITOR_MAPPER_SYSTEM, COMPETITOR_MAPPER_USER,
    COMPETITOR_QUERY_GENERATOR_SYSTEM, COMPETITOR_QUERY_GENERATOR_USER
)


def map_competitors(deck_text: str) -> dict:
    """
    Map the competitive landscape with funding and trajectory data.
    """
    # 1. Use expanded context
    context = deck_text[:3000]

    # 2. Hardcoded Forensic Research Queries (skip slow LLM query gen)
    print(f"[SearchAnalyst] Planning competition research strategy...")
    
    # Try to extract the core company/product name quickly; fallback to generic
    import re
    words = [w for w in re.split(r'\W+', context[:100]) if len(w) > 3]
    core_concept = " ".join(words[:3]) if words else "startup in this space"
    
    queries = [
        f"top competitors to {core_concept}",
        f"recent funding rounds for competitors to {core_concept}",
        f"alternatives to {core_concept}"
    ]

    all_raw_results = []

    # 3. Parallel Research Execution
    def run_comp_query(q):
        print(f"[SearchAnalyst]   Hunting: {q}...")
        return search(q, max_results=4)

    import concurrent.futures
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        results_lists = list(executor.map(run_comp_query, queries))
        for res_list in results_lists:
            all_raw_results.extend(res_list)

    # 4. Format Evidence for Final Synthesis
    search_text = ""
    for r in all_raw_results:
        search_text += f"\nTITLE: {r['title']}\nSNIPPET: {r['snippet']}\nURL: {r['url']}\n---"

    print(f"[BluffBuster]   Synthesizing landscape from {len(all_raw_results)} intelligence sources...")

    # 5. Final Synthesis
    result = chat_json(
        system_prompt=COMPETITOR_MAPPER_SYSTEM,
        user_prompt=COMPETITOR_MAPPER_USER.format(
            deck_text=context,
            search_results=search_text,
        ),
    )

    return result
