import requests
import json
import time

# Upload PDF
print("Uploading test deck (FOUNDER MODE)...")
with open("test_deck.pdf", "rb") as f:
    r = requests.post(
        "http://localhost:8000/api/analyze",
        files={"file": ("test_deck.pdf", f, "application/pdf")},
        data={"mode": "founder"},
    )

data = r.json()
session_id = data["session_id"]
print(f"Session: {session_id}")

# Poll for results
for i in range(100):
    time.sleep(5)
    r = requests.get(f"http://localhost:8000/api/session/{session_id}")
    result = r.json()
    status = result["status"]
    print(f"  [{i*5+5}s] Status: {status}")

    if status == "complete":
        print("\n=== ANALYSIS COMPLETE (FOUNDER MODE) ===")
        res = result["results"]
        
        # Verify Founder Keys
        print(f"Claims found (with repairs?): {len(res.get('claim_results', []))}")
        print(f"Financial Stress Data: {'YES' if res.get('financial_stress') else 'NO'}")
        print(f"Blind Spots / Competitors: {'YES' if res.get('competitors') else 'NO'}")
        print(f"Mode Check: {res.get('mode')}")

        # Save to founder_result.json
        with open("founder_result.json", "w") as out:
            json.dump(result, out, indent=2)
        print("\nFull result saved to founder_result.json")
        break
    elif status == "error":
        print("Analysis FAILED!")
        break
else:
    print("Timeout")
