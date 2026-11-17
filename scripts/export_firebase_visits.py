"""Export non-identifying Firestore visitor counts into a GitHub Pages JSON file.

Requires GitHub Actions secret FIREBASE_SERVICE_ACCOUNT_JSON. Raw visitor IDs,
individual timestamps, and per-person records are never published.
"""
import json
import os
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

from google.cloud import firestore
from google.oauth2 import service_account

raw = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON", "").strip()
if not raw:
    raise SystemExit("FIREBASE_SERVICE_ACCOUNT_JSON is not configured; leave current stats intact")

credentials = service_account.Credentials.from_service_account_info(json.loads(raw))
db = firestore.Client(project=credentials.project_id, credentials=credentials)
if credentials.project_id != "myvbrand":
    raise SystemExit("Wrong Firebase project. Expected myvbrand.")

now = datetime.now(ZoneInfo("Asia/Seoul"))
today = now.date()
cutoff = today - timedelta(days=29)
dates, source_counts, page_counts, device_counts = Counter(), Counter(), Counter(), Counter()
valid = 0

# One Firestore event is recorded per browser per local date.
# Only aggregate values, not documents, are written to the public repository.
for snapshot in db.collection("visits").where("date", ">=", cutoff.isoformat()).stream():
    row = snapshot.to_dict() or {}
    try:
        d = datetime.strptime(row.get("date", ""), "%Y-%m-%d").date()
    except (ValueError, TypeError):
        continue
    if not cutoff <= d <= today:
        continue
    valid += 1
    dates[d.isoformat()] += 1
    source_counts[str(row.get("source") or "direct")[:100]] += 1
    page_counts[str(row.get("path") or "/")[:160]] += 1
    device_counts[str(row.get("device") or "other")[:30]] += 1

# Source/page subgroups with fewer than three visits are not published to avoid
# exposing an individual user's rare referring source or path.
def grouped(counter, field):
    common = [(k, v) for k, v in counter.most_common() if v >= 3]
    other = sum(v for _, v in counter.items() if v < 3)
    out = [{field: k, "views": v} for k, v in common[:30]]
    if other:
        out.append({field: "기타", "views": other})
    return out

def day(n):
    d = today - timedelta(days=n)
    return {"date": d.isoformat(), "views": dates[d.isoformat()]}

weekly_start = today - timedelta(days=today.weekday())
result = {
    "metric": "daily_browser_visits",
    "source": "Firebase Firestore / visits",
    "connected": True,
    "asOf": now.isoformat(),
    "today": day(0),
    "yesterday": day(1),
    "twoDaysAgo": day(2),
    "weekStart": weekly_start.isoformat(),
    "week": sum(v for k, v in dates.items() if k >= weekly_start.isoformat()),
    "month": sum(v for k, v in dates.items() if k >= today.replace(day=1).isoformat()),
    "days": [{"date": k, "views": v} for k, v in sorted(dates.items(), reverse=True)],
    "sources": grouped(source_counts, "source"),
    "pages": grouped(page_counts, "path"),
    "devices": grouped(device_counts, "device"),
    "observedRecords30d": valid,
}
output = Path("data/visitor-stats.json")
output.parent.mkdir(exist_ok=True, parents=True)
output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
