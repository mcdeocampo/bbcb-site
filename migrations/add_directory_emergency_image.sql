-- Migration: add image_url column to directory_emergency
-- Supports an optional official agency logo on Emergency Directory cards.
-- Run this in the Supabase SQL Editor.

ALTER TABLE directory_emergency
    ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
