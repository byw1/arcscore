-- Inbound requests from the marketing site (demo / waitlist / score requests).
CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  audience    TEXT NOT NULL CHECK (audience IN ('athlete', 'brand', 'school', 'investor')),
  name        TEXT,
  email       TEXT NOT NULL,
  org         TEXT,
  message     TEXT,
  source      TEXT,
  user_agent  TEXT
);
CREATE INDEX IF NOT EXISTS leads_created_at ON leads (created_at);
CREATE INDEX IF NOT EXISTS leads_audience ON leads (audience);
