-- Migration: add image_url column to directory_organizations
-- Supports an optional official logo/emblem on Organization Directory cards.
-- Run this in the Supabase SQL Editor.

ALTER TABLE directory_organizations
    ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
