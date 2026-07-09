-- Migration: add photos and documents JSONB columns to calendar_activities
-- Run this in the Supabase SQL Editor.

ALTER TABLE calendar_activities
    ADD COLUMN IF NOT EXISTS photos    JSONB NOT NULL DEFAULT '[]'::jsonb,
    ADD COLUMN IF NOT EXISTS documents JSONB NOT NULL DEFAULT '[]'::jsonb;
