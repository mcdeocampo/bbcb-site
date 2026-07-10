-- Migration: create emergency_alerts table (Phase 1)
-- Run this in the Supabase SQL Editor before deploying.

CREATE TABLE IF NOT EXISTS emergency_alerts (
    id                   TEXT          PRIMARY KEY,
    title                TEXT          NOT NULL    DEFAULT '',
    alert_type           TEXT          NOT NULL    DEFAULT 'Other',
    priority             TEXT          NOT NULL    DEFAULT 'Advisory'
                         CHECK (priority IN ('Advisory', 'Warning', 'Critical')),
    target_audience      TEXT          NOT NULL    DEFAULT 'All Residents',
    target_area          TEXT                      DEFAULT '',
    message              TEXT          NOT NULL    DEFAULT '',
    instructions         TEXT                      DEFAULT '',
    start_datetime       TEXT          NOT NULL    DEFAULT '',
    expiration_datetime  TEXT          NOT NULL    DEFAULT '',
    status               TEXT          NOT NULL    DEFAULT 'draft'
                         CHECK (status IN ('draft', 'active', 'expired', 'resolved', 'archived')),
    version              INTEGER       NOT NULL    DEFAULT 1,
    show_banner          BOOLEAN       NOT NULL    DEFAULT false,
    enable_popup         BOOLEAN       NOT NULL    DEFAULT false,
    created_by           TEXT                      DEFAULT '',
    created_at           TIMESTAMPTZ   NOT NULL    DEFAULT NOW(),
    updated_by           TEXT                      DEFAULT '',
    updated_at           TIMESTAMPTZ   NOT NULL    DEFAULT NOW(),
    resolved_by          TEXT                      DEFAULT '',
    resolved_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_emergency_alerts_status
    ON emergency_alerts (status);

CREATE INDEX IF NOT EXISTS idx_emergency_alerts_created_at
    ON emergency_alerts (created_at DESC);

-- Disable RLS so the server-side Python client (service role) can read/write freely.
ALTER TABLE emergency_alerts DISABLE ROW LEVEL SECURITY;
