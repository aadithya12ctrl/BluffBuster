"""
DuckDuckGo + Jina AI Reader wrapper — 100% free web search pipeline for claim verification.
"""
import os
import json
import time
import hashlib
import random
import requests
import concurrent.futures
from ddgs import DDGS
from backend.services.llm import chat_json
from backend.utils.prompts import (
    SEARCH_QUERY_GENERATOR_SYSTEM, SEARCH_QUERY_GENERATOR_USER,
    SEARCH_PRUNER_SYSTEM, SEARCH_PRUNER_USER
)

CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "cache")
os.makedirs(CACHE_DIR, exist_ok=True)

def _hash_key(key: str) -> str:
    """Generate deterministic MD5 hash for caching."""
    return hashlib.md5(key.encode('utf-8')).hexdigest()

def get_cached(key: str) -> str | None:
    """Retrieve string from local disk cache if exists."""
    path = os.path.join(CACHE_DIR, f"{_hash_key(key)}.txt")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return None

def save_cache(key: str, content: str):
    """Save string to local disk cache."""
    path = os.path.join(CACHE_DIR, f"{_hash_key(key)}.txt")
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def safe_fetch_jina(url: str, retries: int = 3) -> str | None:
    """Fetch URL markdown via Jina AI with exponential backoff and caching."""
    jina_url = f"https://r.jina.ai/{url}"
    cache_key = f"jina_v2_{url}"
    cached = get_cached(cache_key)
    if cached:
        return cached

    jina_url = f"https://r.jina.ai/{url}"
    
    for i in range(retries):
        try:
            r = requests.get(jina_url, timeout=15)
            if r.status_code == 200:
                content = r.text
                save_cache(cache_key, content)
                return content
            time.sleep((2 ** i) + random.uniform(0, 1))
        except Exception:
            time.sleep((2 ** i) + random.uniform(0, 1))
            
    return None

def extract_chunks(markdown: str, claim: str, window: int = 15) -> str:
    """Extract context windows around claim keywords to save LLM tokens."""
    if not markdown:
        return ""
        
    lines = [l for l in markdown.split('\n') if len(l.strip()) > 5]
    # Filter for meaningful keywords > 3 chars
    keywords = [kw for kw in claim.lower().split() if len(kw) > 3]
    
    if not keywords:
        # Fallback to the first 4000 characters of meaningful content
        return '\n'.join(lines[:60])[:4000]

    relevant = []
    for i, line in enumerate(lines):
        if any(kw in line.lower() for kw in keywords):
            chunk = lines[max(0, i-window):i+window+1]
            relevant.append(' '.join(chunk))
            
    if not relevant:
        # Fallback to top of content
        return '\n'.join(lines[:60])[:4000]
        
    # Return top 3 non-overlapping context chunks joined by ellipses
    return '\n...\n'.join(relevant[:5])

def search_for_claim(claim: str, context: str = "") -> list[dict]:
    """
    Balanced search pipeline: Use claim directly as DDG query -> Parallel Scrape Top 1 -> Return.
    Provides deep evidence with minimal latency.
    """
    # 1. Cache Check
    cache_key = f"claim_v7_deep_{claim}_{context}"
    cached_results = get_cached(cache_key)
    if cached_results:
        try:
            return json.loads(cached_results)
        except json.JSONDecodeError:
            pass

    print(f"[SearchAnalyst] Deep searching: {claim[:50]}...")
    
    # 2. Fast DDG search using the claim
    ddg_raw = []
    try:
        with DDGS() as ddgs:
            ddg_raw = list(ddgs.text(claim, max_results=5))
    except Exception as e:
        print(f"[SearchAnalyst] DDG Search error: {e}")

    final_results = []
    
    # 3. Scrape the Top 1 URL for Deep Context (Parallel)
    if ddg_raw:
        top_res = ddg_raw[0]
        url = top_res.get("href", "")
        
        # Scrape and extract context
        deep_context = ""
        markdown = safe_fetch_jina(url)
        if markdown:
            deep_context = extract_chunks(markdown, claim)
            
        # Add the deep result
        final_results.append({
            "title": f"[DEEP] {top_res.get('title', '')}",
            "url": url,
            "snippet": f"{deep_context[:3500]}..." if deep_context else top_res.get("body", ""),
            "is_deep": True if deep_context else False
        })
        
        # Add the remaining DDG results as snippets
        for r in ddg_raw[1:4]:
            final_results.append({
                "title": r.get("title", ""),
                "url": r.get("href", ""),
                "snippet": r.get("body", ""),
                "is_deep": False
            })

    # 4. Cache and return
    if final_results:
        save_cache(cache_key, json.dumps(final_results))
        
    return final_results

    final_results = []
    
    try:
        with DDGS() as ddgs:
            # Optimal reach (6 results)
            search_results = list(ddgs.text(query, max_results=6))
            
            if not search_results and context:
                query = f"{base_claim} verify fact check"
                search_results = list(ddgs.text(query, max_results=6))

            # 3. Parallel Scrape Planning
            scrape_candidates = []
            keywords = [kw for kw in base_claim.lower().split() if len(kw) > 3]

            for r in search_results:
                title = r.get("title", "")
                url = r.get("href", "")
                body = r.get("body", "")
                
                # Snippet Relevance check
                snippet_match_count = sum(1 for kw in keywords if kw in body.lower())
                
                # If snippet is amazing, just use it
                if keywords and snippet_match_count > (len(keywords) * 0.7):
                    final_results.append({
                        "title": title,
                        "url": url,
                        "snippet": f"[DDG Snippet] {body}",
                        "relevance_score": 0.95
                    })
                elif len(scrape_candidates) < 3:
                    # Mark for parallel scraping
                    scrape_candidates.append(r)
                else:
                    # Regular snippet
                    final_results.append({
                        "title": title,
                        "url": url,
                        "snippet": f"[DDG Snippet] {body}",
                        "relevance_score": 0.6
                    })

            # 4. Execute Parallel Scrapes
            if scrape_candidates:
                def process_url(r):
                    url = r.get("href", "")
                    title = r.get("title", "")
                    markdown = safe_fetch_jina(url)
                    if markdown:
                        chunks = extract_chunks(markdown, base_claim)
                        return {
                            "title": title,
                            "url": url,
                            "snippet": f"[Jina Parallel Content] {chunks[:3000]}",
                            "relevance_score": 0.85
                        }
                    else:
                        return {
                            "title": title,
                            "url": url,
                            "snippet": f"[DDG Snippet] {r.get('body', '')}",
                            "relevance_score": 0.5
                        }

                with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
                    scraping_results = list(executor.map(process_url, scrape_candidates))
                    final_results.extend(scraping_results)
                    
    except Exception as e:
        print(f"[WebSearch] Parallel Pipeline error: {e}")

    # Save to Cache
    if final_results:
        save_cache(cache_key, json.dumps(final_results))
        
    return final_results
        
    return final_results


def search_competitors(company_description: str, industry: str = "") -> list[dict]:
    """Retrieve raw DDG searches for the competitor agent."""
    query = f"top competitors and alternatives for {company_description}"
    if industry:
        query += f" in {industry} sector"
    query += " market share funding history"
    
    final_results = []
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=8))
            for r in results:
                final_results.append({
                    "title": r.get("title", ""),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", "")[:500],
                    "relevance_score": 0.7
                })
    except Exception as e:
        print(f"[WebSearch] Competitor search error: {e}")
        
    return final_results

def search(query: str, max_results: int = 5, search_depth: str = "basic") -> list[dict]:
    """Generic DDG search proxy for backwards compatibility with old Tavily signature."""
    final_results = []
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=max_results))
            for r in results:
                final_results.append({
                    "title": r.get("title", ""),
                    "url": r.get("href", ""),
                    "snippet": r.get("body", "")[:500],
                    "relevance_score": 0.5
                })
    except Exception as e:
        print(f"[WebSearch] Generic search error: {e}")
        
    return final_results
