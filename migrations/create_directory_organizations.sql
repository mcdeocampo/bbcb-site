-- Migration: create directory_organizations table
-- Backs the "Organization Directory" section of the Directory Management
-- admin module and the public Directory page's Organization Directory.
-- Run this in the Supabase SQL Editor before deploying the Directory
-- Management backend (Phase 2).

CREATE TABLE IF NOT EXISTS directory_organizations (
    id               TEXT         PRIMARY KEY,
    name             TEXT         NOT NULL    DEFAULT '',
    category         TEXT         NOT NULL    DEFAULT 'Community Groups'
                     CHECK (category IN ('Associations', 'Youth Organizations', 'Senior Citizens', 'Community Groups')),
    description      TEXT                     DEFAULT '',
    contact_person    TEXT                    DEFAULT '',
    officers         JSONB        NOT NULL    DEFAULT '[]'::jsonb,
    contact_details   TEXT                    DEFAULT '',
    programs         TEXT                     DEFAULT '',
    location         TEXT                     DEFAULT '',
    lat              DOUBLE PRECISION,
    lng              DOUBLE PRECISION,
    status           TEXT         NOT NULL    DEFAULT 'draft'
                     CHECK (status IN ('draft', 'published', 'hidden')),
    created_at       TIMESTAMPTZ  NOT NULL    DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL    DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_directory_organizations_status
    ON directory_organizations (status);

-- Disable RLS so the server-side Python client (service role) can read/write freely.
-- This matches the setup of all other tables in this project.
ALTER TABLE directory_organizations DISABLE ROW LEVEL SECURITY;
