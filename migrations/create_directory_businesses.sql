-- Migration: create directory_businesses table
-- Backs the "Business Directory" section of the Directory Management admin
-- module and the public Directory page's Business Directory.
-- Run this in the Supabase SQL Editor before deploying the Directory
-- Management backend (Phase 2).

CREATE TABLE IF NOT EXISTS directory_businesses (
    id            TEXT         PRIMARY KEY,
    name          TEXT         NOT NULL    DEFAULT '',
    category      TEXT         NOT NULL    DEFAULT 'Services'
                  CHECK (category IN ('Food & Restaurants', 'Stores', 'Services', 'Local Entrepreneurs')),
    description   TEXT                     DEFAULT '',
    address       TEXT                     DEFAULT '',
    contact       TEXT                     DEFAULT '',
    hours         TEXT                     DEFAULT '',
    image_url     TEXT                     DEFAULT '',
    social_link   TEXT                     DEFAULT '',
    lat           DOUBLE PRECISION,
    lng           DOUBLE PRECISION,
    status        TEXT         NOT NULL    DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'hidden')),
    created_at    TIMESTAMPTZ  NOT NULL    DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_directory_businesses_status
    ON directory_businesses (status);

-- Disable RLS so the server-side Python client (service role) can read/write freely.
-- This matches the setup of all other tables in this project.
ALTER TABLE directory_businesses DISABLE ROW LEVEL SECURITY;
