"""
OpenRouter LLM client wrapper — uses elephant-alpha via OpenRouter API.
"""
import json
import time
import requests
from backend.config import LLM_API_KEY, LLM_BASE_URL, LLM_MODEL

def chat(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.3,
    max_tokens: int = 4096,
    json_mode: bool = False,
) -> str:
    """
    Send a chat completion request to OpenRouter API.
    Returns the raw text response.
    """
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]

    base_url = f"{LLM_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": LLM_MODEL,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    max_retries = 8
    response = None
    last_error = None
    
    for attempt in range(max_retries):
        try:
            response = requests.post(base_url, headers=headers, json=payload, timeout=120)
            
            if response.status_code == 429:
                if attempt < max_retries - 1:
                    wait_time = min((2 ** attempt) * 3 + 5, 120)
                    print(f"[LLM] Rate limit hit. Waiting {wait_time}s (Attempt {attempt+1}/{max_retries})...")
                    time.sleep(wait_time)
                    continue
                else:
                    print(f"[LLM] Failed after {max_retries} rate limit retries.")
                    response.raise_for_status()
            
            if response.status_code != 200:
                print(f"[LLM] Error {response.status_code}: {response.text[:300]}")
                response.raise_for_status()

            data = response.json()
            if "choices" not in data:
                print(f"[LLM] No 'choices' in response: {json.dumps(data)[:300]}")
                raise KeyError("choices")
                
            message = data["choices"][0]["message"]
            content = message.get("content")
            reasoning = message.get("reasoning")
            
            # Use content if available, otherwise fallback to reasoning
            final_output = content or reasoning
            
            if final_output is None or (isinstance(final_output, str) and not final_output.strip()):
                print(f"[LLM] Response content and reasoning are both missing/empty. Message keys: {list(message.keys())}")
                raise ValueError("null or empty content")
                
            return final_output
            
        except requests.exceptions.HTTPError as e:
            last_error = e
            if response is not None and response.status_code == 400 and "json_object" in response.text:
                print("[LLM] Fallback: Model doesn't support JSON mode. Retrying without it...")
                payload.pop("response_format", None)
                continue
                
            if attempt < max_retries - 1:
                status = response.status_code if response is not None else 'N/A'
                wait_time = min((2 ** attempt) * 3 + 5, 120)
                print(f"[LLM] HTTP error ({status}). Waiting {wait_time}s (Attempt {attempt+1}/{max_retries})...")
                time.sleep(wait_time)
            else:
                raise e
        except Exception as e:
            last_error = e
            if attempt < max_retries - 1:
                wait_time = min((2 ** attempt) * 3 + 5, 120)
                print(f"[LLM] Error: {e}. Retrying in {wait_time}s (Attempt {attempt+1}/{max_retries})...")
                time.sleep(wait_time)
            else:
                raise e
    
    # Safety net: should never reach here, but just in case
    raise RuntimeError(f"[LLM] Exhausted all {max_retries} retries. Last error: {last_error}")

def chat_json(system_prompt: str, user_prompt: str, temperature: float = 0.3, max_tokens: int = 4096) -> dict:
    """
    Send a chat completion and parse the response as JSON.
    Handles lists by returning the first element and strips markdown if present.
    """
    try:
        text = chat(system_prompt, user_prompt, temperature, max_tokens, json_mode=True)
    except Exception as e:
        print(f"[LLM] chat_json: LLM call failed: {e}")
        return {"error": str(e), "verdict": "UNVERIFIABLE", "confidence": 0.0, "reasoning": f"LLM unavailable: {e}"}
    
    if text is None:
        print("[LLM] chat_json: Received None from chat(), returning fallback.")
        return {"error": "null_response", "verdict": "UNVERIFIABLE", "confidence": 0.0, "reasoning": "LLM returned empty response"}
    
    def parse_raw(s: str):
        # 1. Try direct parse
        try:
            return json.loads(s)
        except json.JSONDecodeError:
            pass
            
        # 2. Try to extract from markdown blocks
        import re
        json_match = re.search(r'```json\s*(.*?)\s*```', s, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
        
        # 3. Try generic code block
        json_match = re.search(r'```\s*(.*?)\s*```', s, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
        
        # 4. Try to find the first '{' and last '}'
        start = s.find('{')
        end = s.rfind('}')
        if start != -1 and end != -1:
            try:
                return json.loads(s[start:end+1])
            except json.JSONDecodeError:
                pass
                
        # 5. Try to find the first '[' and last ']'
        start = s.find('[')
        end = s.rfind(']')
        if start != -1 and end != -1:
            try:
                return json.loads(s[start:end+1])
            except json.JSONDecodeError:
                pass
        
        return {"raw_response": s}

    parsed = parse_raw(text)
    
    # If the response is a list, take the first element (common for multi-claim models)
    if isinstance(parsed, list) and len(parsed) > 0:
        return parsed[0]
    
    return parsed
