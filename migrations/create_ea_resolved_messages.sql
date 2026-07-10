-- Migration: ea_resolved_messages
-- Per-priority custom resolved notification messages for the Emergency Alert system.
-- Run once in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS ea_resolved_messages (
  priority         TEXT PRIMARY KEY CHECK (priority IN ('Critical', 'Warning', 'Advisory')),
  use_custom       BOOLEAN     NOT NULL DEFAULT FALSE,
  custom_message   TEXT        NOT NULL DEFAULT '',
  updated_by       TEXT        NOT NULL DEFAULT 'System',
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  previous_message TEXT        NOT NULL DEFAULT ''
);

-- Seed one row per priority so the admin panel always has something to display.
INSERT INTO ea_resolved_messages (priority, use_custom, custom_message, updated_by, updated_at, previous_message)
VALUES
  ('Critical', FALSE, '', 'System', NOW(), ''),
  ('Warning',  FALSE, '', 'System', NOW(), ''),
  ('Advisory', FALSE, '', 'System', NOW(), '')
ON CONFLICT (priority) DO NOTHING;
