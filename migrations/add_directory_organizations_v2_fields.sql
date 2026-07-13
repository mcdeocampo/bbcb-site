-- Migration: Directory Module v2.0 fields for directory_organizations
-- Adds featured/verified flags, extra contact fields, and a photo gallery.
-- No hours fields — organizations don't have operating hours in this model.
-- All additive and backward-compatible with existing rows.
-- Run this in the Supabase SQL Editor.

ALTER TABLE directory_organizations
    ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS website TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS facebook TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS keywords TEXT DEFAULT '',
    ADD COLUMN IF NOT EXISTS gallery TEXT[] DEFAULT '{}';
