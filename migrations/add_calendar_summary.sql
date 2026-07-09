-- Migration: add summary column to calendar_activities
-- Run this in the Supabase SQL Editor.

ALTER TABLE calendar_activities
    ADD COLUMN IF NOT EXISTS summary TEXT NOT NULL DEFAULT '';
