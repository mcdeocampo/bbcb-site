-- Migration: add attachment_name column to calendar_activities
-- Run this in the Supabase SQL Editor.

ALTER TABLE calendar_activities
    ADD COLUMN IF NOT EXISTS attachment_name TEXT DEFAULT '';
