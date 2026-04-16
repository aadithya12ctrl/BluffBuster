import os
import sys
import json
from dotenv import load_dotenv

# Add parent directory to path to use backend modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from backend.services.llm import chat_json
from backend.utils.prompts import CLAIM_VERIFY_SYSTEM, CLAIM_VERIFY_USER

def test_model_quality():
    print("Testing google/gemma-4-26b-a4b-it:free...")
    
    claim = "Our proprietary algorithm reduces energy consumption of LLM training by 95% compared to standard PyTorch."
    evidence = """
    [1] Energy Consumption of AI: Standard LLM training is extremely intensive.
    [2] Research Paper X: Optimizing PyTorch can lead to 10-15% gains.
    [3] Competitor Y Claim: We reduce consumption by 30% using quantization.
    [4] Industry Note: Reductions higher than 50% are technically implausible without new physics or specific ASIC hardware not mentioned in the deck.
    """
    
    try:
        verdict = chat_json(
            system_prompt=CLAIM_VERIFY_SYSTEM,
            user_prompt=CLAIM_VERIFY_USER.format(
                claim=claim,
                page_number=4,
                category="technical",
                evidence=evidence
            )
        )
        
        print("\n--- MODEL RESPONSE ---")
        print(json.dumps(verdict, indent=2))
        
        if "verdict" in verdict and "reasoning" in verdict:
            print("\n[SUCCESS] Model followed JSON structure perfectly.")
            if verdict["verdict"] in ["EXAGGERATED", "FALSE"]:
                 print("[SUCCESS] Model showed good forensic skepticism (95% was challenged).")
            else:
                 print("⚠️ Model might be too optimistic.")
        else:
            print("[ERROR] Model failed to follow JSON structure.")
            
    except Exception as e:
        print(f"[ERROR] Test failed: {e}")

if __name__ == "__main__":
    test_model_quality()
