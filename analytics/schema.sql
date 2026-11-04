-- Cloudflare D1 initialization for MYV anonymous page views
CREATE TABLE IF NOT EXISTS page_views (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 occurred_at INTEGER NOT NULL,
 local_date TEXT NOT NULL,
 path TEXT NOT NULL,
 source TEXT NOT NULL,
 device TEXT NOT NULL,
 language TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_page_views_at ON page_views(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_date ON page_views(local_date);
