-- Migration: Directory Module v2.0 fields for directory_map_locations
-- Adds featured/verified flags, extra contact fields, a photo gallery, and
-- structured hours (for computed Open/Closed status) alongside the existing
-- free-text `hours` column. All additive and backward-compatible with
-- existing rows (existing values default to false/empty).
-- Run this in the Supabase SQL Editor.

ALTER TABLE directory_map_locations
    ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS website TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS facebook TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS keywords TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS hours_open TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS hours_close TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS hours_is_24h BOOLEAN DEFAULT false;
