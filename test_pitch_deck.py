"""Test the BluffBuster analysis pipeline with Pitch-Deck-Example.pdf."""
import requests
import json
import time
import os

FILE_PATH = "Pitch-Deck-Example.pdf"

if not os.path.exists(FILE_PATH):
    print(f"Error: {FILE_PATH} not found.")
    exit(1)

# Upload PDF
print(f"Uploading {FILE_PATH}...")
with open(FILE_PATH, "rb") as f:
    r = requests.post(
        "http://localhost:8000/api/analyze",
        files={"file": (FILE_PATH, f, "application/pdf")},
        data={"mode": "vc"},
    )

data = r.json()
if "session_id" not in data:
    print(f"Upload failed: {data}")
    exit(1)

session_id = data["session_id"]
print(f"Session: {session_id}")
print(f"Pages extracted: {data.get('pages_extracted', '?')}")
print("Waiting for analysis... (Parallel search is active)")

# Poll for results
start_time = time.time()
for i in range(120): # Longer timeout for larger deck
    time.sleep(5)
    try:
        r = requests.get(f"http://localhost:8000/api/session/{session_id}")
        result = r.json()
        status = result["status"]
        elapsed = int(time.time() - start_time)
        print(f"  [{elapsed}s] Status: {status}")

        if status == "complete":
            print("\n=== ANALYSIS COMPLETE ===")
            res = result["results"]
            print(f"Claims found: {len(res.get('claim_results', []))}")
            print(f"Overall trust score: {res.get('overall_trust_score', 'N/A')}")
            print(f"Debate messages: {len(res.get('debate', []))}")
            
            print("\n--- CLAIM VERDICTS (Top 10) ---")
            for c in res.get("claim_results", [])[:10]:
                v = c.get("verdict", "?")
                t = c.get("claim", "?")[:70]
                print(f"  [{v}] {t}")

            # Save full result
            with open("pitch_deck_result.json", "w") as out:
                json.dump(result, out, indent=2)
            print("\nFull result saved to pitch_deck_result.json")
            break

        elif status == "error":
            print("Analysis FAILED!")
            break
    except Exception as e:
        print(f"Polling error: {e}")
else:
    print("Timeout after 10 minutes")
