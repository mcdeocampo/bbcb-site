-- Migration: create calendar_activities table
-- Run this in the Supabase SQL Editor before deploying the calendar backend.

CREATE TABLE IF NOT EXISTS calendar_activities (
    id               TEXT         PRIMARY KEY,
    title            TEXT         NOT NULL    DEFAULT '',
    category         TEXT         NOT NULL    DEFAULT 'Government Activities',
    date             TEXT         NOT NULL    DEFAULT '',
    start_time       TEXT                     DEFAULT '',
    end_time         TEXT                     DEFAULT '',
    location         TEXT                     DEFAULT '',
    short_description TEXT                    DEFAULT '',
    full_description TEXT                     DEFAULT '',
    requirements     TEXT                     DEFAULT '',
    attachment_url   TEXT                     DEFAULT '',
    status           TEXT         NOT NULL    DEFAULT 'draft'
                     CHECK (status IN ('draft', 'published', 'hidden')),
    created_at       TIMESTAMPTZ  NOT NULL    DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL    DEFAULT NOW()
);

-- Index for fast public-facing queries filtered by status and ordered by date
CREATE INDEX IF NOT EXISTS idx_calendar_activities_status_date
    ON calendar_activities (status, date);

-- Disable RLS so the server-side Python client (service role) can read/write freely.
-- This matches the setup of all other tables in this project.
ALTER TABLE calendar_activities DISABLE ROW LEVEL SECURITY;
