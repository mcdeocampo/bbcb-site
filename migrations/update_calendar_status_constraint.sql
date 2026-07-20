-- Migration: update calendar_activities status check constraint
-- Run this in the Supabase SQL Editor.

ALTER TABLE calendar_activities
    DROP CONSTRAINT IF EXISTS calendar_activities_status_check;

ALTER TABLE calendar_activities
    ADD CONSTRAINT calendar_activities_status_check
    CHECK (status IN ('draft', 'scheduled', 'ongoing', 'completed', 'cancelled', 'archived'));
