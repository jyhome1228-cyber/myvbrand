CREATE TABLE IF NOT EXISTS page_views (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 at TEXT NOT NULL,
 day TEXT NOT NULL,
 path TEXT NOT NULL,
 source TEXT NOT NULL,
 device TEXT NOT NULL,
 language TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_page_views_day ON page_views(day);
CREATE INDEX IF NOT EXISTS idx_page_views_at ON page_views(at);
