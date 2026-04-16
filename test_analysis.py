"""Test the BluffBuster analysis pipeline."""
import requests
import json
import time

# Upload PDF
print("Uploading test deck...")
with open("test_deck.pdf", "rb") as f:
    r = requests.post(
        "http://localhost:8000/api/analyze",
        files={"file": ("test_deck.pdf", f, "application/pdf")},
        data={"mode": "vc"},
    )

data = r.json()
session_id = data["session_id"]
print(f"Session: {session_id}")
print(f"Pages extracted: {data.get('pages_extracted', '?')}")
print("Waiting for analysis...")

# Poll for results
for i in range(60):
    time.sleep(5)
    r = requests.get(f"http://localhost:8000/api/session/{session_id}")
    result = r.json()
    status = result["status"]
    print(f"  [{i*5+5}s] Status: {status}")

    if status == "complete":
        print("\n=== ANALYSIS COMPLETE ===")
        res = result["results"]
        print(f"Claims found: {len(res.get('claim_results', []))}")
        print(f"Overall trust score: {res.get('overall_trust_score', 'N/A')}")
        print(f"Debate messages: {len(res.get('debate', []))}")
        print(f"Heatmap pages: {len(res.get('heatmap', []))}")

        print("\n--- CLAIM VERDICTS ---")
        for c in res.get("claim_results", []):
            v = c.get("verdict", "?")
            t = c.get("claim", "?")[:70]
            print(f"  [{v}] {t}")

        print("\n--- DEBATE (first 2 messages) ---")
        for d in res.get("debate", [])[:2]:
            role = d.get("role", "?").upper()
            content = d.get("content", "").encode('ascii', 'ignore').decode('ascii')[:150]
            print(f"  [{role}] {content}...")

        print("\n--- HEATMAP ---")
        for h in res.get("heatmap", []):
            pg = h.get("page_number", "?")
            sc = h.get("page_score", "?")
            co = h.get("dominant_color", "?")
            print(f"  Page {pg}: score={sc}, color={co}")

        # Save full result
        with open("test_result.json", "w") as out:
            json.dump(result, out, indent=2)
        print("\nFull result saved to test_result.json")
        break

    elif status == "error":
        print("Analysis FAILED!")
        break
else:
    print("Timeout after 5 minutes")
