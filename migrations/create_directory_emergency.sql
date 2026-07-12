-- Migration: create directory_emergency table
-- Backs the "Emergency Directory" section of the Directory Management admin
-- module and the public Directory page's Emergency Directory.
-- Run this in the Supabase SQL Editor before deploying the Directory
-- Management backend (Phase 2).

CREATE TABLE IF NOT EXISTS directory_emergency (
    id            TEXT         PRIMARY KEY,
    name          TEXT         NOT NULL    DEFAULT '',
    category      TEXT         NOT NULL    DEFAULT 'Emergency Contacts'
                  CHECK (category IN ('Emergency Contacts', 'Hospitals', 'Police', 'Fire Services', 'Disaster Response Contacts')),
    number        TEXT                     DEFAULT '',
    alt_number    TEXT                     DEFAULT '',
    address       TEXT                     DEFAULT '',
    services      TEXT                     DEFAULT '',
    lat           DOUBLE PRECISION,
    lng           DOUBLE PRECISION,
    status        TEXT         NOT NULL    DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'hidden')),
    created_at    TIMESTAMPTZ  NOT NULL    DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_directory_emergency_status
    ON directory_emergency (status);

-- Disable RLS so the server-side Python client (service role) can read/write freely.
-- This matches the setup of all other tables in this project.
ALTER TABLE directory_emergency DISABLE ROW LEVEL SECURITY;
