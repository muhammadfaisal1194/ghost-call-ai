-- GhostCall AI — Supabase Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS calls (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_name      TEXT        NOT NULL,
  mission          TEXT        NOT NULL,
  phone_number     TEXT        NOT NULL,
  tone             TEXT        NOT NULL DEFAULT 'firm',
  status           TEXT        NOT NULL DEFAULT 'pending',
  transcript       TEXT,
  outcome_summary  TEXT,
  vapi_call_id     TEXT,
  created_at       TIMESTAMP   NOT NULL DEFAULT now()
);

-- Index for webhook lookups by vapi_call_id
CREATE INDEX IF NOT EXISTS idx_calls_vapi_call_id ON calls(vapi_call_id);

-- Optional: enable Row Level Security
-- ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Public read" ON calls FOR SELECT USING (true);
-- CREATE POLICY "Service role write" ON calls FOR ALL USING (auth.role() = 'service_role');
