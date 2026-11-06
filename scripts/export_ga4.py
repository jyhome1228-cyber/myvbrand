"""Export anonymous GA4 aggregate counts for GitHub Pages. No user-level records."""
import json, os
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import DateRange, Dimension, Metric, RunReportRequest
from google.oauth2 import service_account

prop = os.environ.get("GA4_PROPERTY_ID", "").strip()
raw = os.environ.get("GA4_SERVICE_ACCOUNT_JSON", "").strip()
if not prop or not raw:
    raise SystemExit("Missing GA4_PROPERTY_ID or GA4_SERVICE_ACCOUNT_JSON repository secrets.")
credentials = service_account.Credentials.from_service_account_info(json.loads(raw))
client = BetaAnalyticsDataClient(credentials=credentials)
property_name = "properties/" + prop
now = datetime.now(ZoneInfo("Asia/Seoul"))
start = (now.date() - timedelta(days=29)).isoformat()
end = now.date().isoformat()

def report(dimensions, limit=1000):
    response = client.run_report(RunReportRequest(
        property=property_name,
        date_ranges=[DateRange(start_date=start, end_date=end)],
        dimensions=[Dimension(name=d) for d in dimensions],
        metrics=[Metric(name="screenPageViews")],
        limit=limit
    ))
    return [(tuple(d.value for d in row.dimension_values), int(row.metric_values[0].value))
            for row in response.rows]

days = {}
for (date,), count in report(["date"]):
    days[f"{date[:4]}-{date[4:6]}-{date[6:]}"] = count
sources = {}
for (source,), count in report(["sessionSource"], 100):
    sources[source or "(direct)"] = count
pages = {}
for (path,), count in report(["pagePath"], 100):
    if path.startswith("/admin"): continue
    pages[path] = count
devices = dict((d[0], c) for d,c in report(["deviceCategory"]))
def day(n):
    date = (now.date() - timedelta(days=n)).isoformat()
    return {"date": date, "views": days.get(date, 0)}
result = {
    "metric": "page_views_not_unique_visitors",
    "source": "Google Analytics 4",
    "asOf": now.isoformat(),
    "today": day(0), "yesterday": day(1), "twoDaysAgo": day(2),
    "days": [{"date": k, "views": v} for k,v in sorted(days.items(),reverse=True)],
    "sources": [{"source": k, "views": v} for k,v in sorted(sources.items(),key=lambda x:-x[1])],
    "pages": [{"path": k, "views": v} for k,v in sorted(pages.items(),key=lambda x:-x[1])],
    "devices": [{"device": k, "views": v} for k,v in sorted(devices.items(),key=lambda x:-x[1])]
}
out = Path("data/visitor-stats.json")
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
