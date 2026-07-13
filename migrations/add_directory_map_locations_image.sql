-- Migration: add image_url column to directory_map_locations
-- Supports an optional building/facility photo on Community Map cards
-- and map popup thumbnails.
-- Run this in the Supabase SQL Editor.

ALTER TABLE directory_map_locations
    ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
