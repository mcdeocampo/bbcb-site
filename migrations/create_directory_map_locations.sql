-- Migration: create directory_map_locations table
-- Backs the "Community Map" section of the Directory Management admin
-- module and the public Directory page's Community Map.
-- Run this in the Supabase SQL Editor before deploying the Directory
-- Management backend (Phase 2).

CREATE TABLE IF NOT EXISTS directory_map_locations (
    id            TEXT         PRIMARY KEY,
    name          TEXT         NOT NULL    DEFAULT '',
    category      TEXT         NOT NULL    DEFAULT 'Public Facilities'
                  CHECK (category IN ('Barangay Hall', 'Health Center', 'Schools', 'Evacuation Centers', 'Public Facilities')),
    description   TEXT                     DEFAULT '',
    address       TEXT                     DEFAULT '',
    contact       TEXT                     DEFAULT '',
    hours         TEXT                     DEFAULT '',
    lat           DOUBLE PRECISION,
    lng           DOUBLE PRECISION,
    status        TEXT         NOT NULL    DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'hidden')),
    created_at    TIMESTAMPTZ  NOT NULL    DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_directory_map_locations_status
    ON directory_map_locations (status);

-- Disable RLS so the server-side Python client (service role) can read/write freely.
-- This matches the setup of all other tables in this project.
ALTER TABLE directory_map_locations DISABLE ROW LEVEL SECURITY;
