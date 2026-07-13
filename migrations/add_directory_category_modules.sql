-- Migration: Extend Category Management to all 4 Directory modules
-- Adds a `module` column to the category tables (previously Business-only),
-- seeds Map Locations / Organization Directory / Emergency Directory
-- taxonomies, drops the leftover hardcoded CHECK constraints on those 3
-- tables' `category` column (same landmine already fixed on
-- directory_businesses), and remaps the handful of existing rows.
-- Run this in the Supabase SQL Editor.

-- ── 1. Add `module` column to both category tables ────────────────────────
ALTER TABLE directory_category_groups ADD COLUMN IF NOT EXISTS module TEXT NOT NULL DEFAULT 'business';
ALTER TABLE directory_subcategories   ADD COLUMN IF NOT EXISTS module TEXT NOT NULL DEFAULT 'business';

-- ── 2. Replace the global UNIQUE(name) with UNIQUE(module, name) ─────────
-- (subcategory/group names now legitimately repeat across modules, e.g.
-- "Hospital" exists under both Map Locations and Emergency Directory)
ALTER TABLE directory_category_groups DROP CONSTRAINT IF EXISTS directory_category_groups_name_key;
ALTER TABLE directory_subcategories DROP CONSTRAINT IF EXISTS directory_subcategories_name_key;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'directory_category_groups_module_name_key'
    ) THEN
        ALTER TABLE directory_category_groups
            ADD CONSTRAINT directory_category_groups_module_name_key UNIQUE (module, name);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'directory_subcategories_module_name_key'
    ) THEN
        ALTER TABLE directory_subcategories
            ADD CONSTRAINT directory_subcategories_module_name_key UNIQUE (module, name);
    END IF;
END $$;

-- ── 3. Seed: Map Locations (module = 'map') ────────────────────────────────
INSERT INTO directory_category_groups (id, module, name, icon, color, display_order) VALUES
    ('map-government',       'map', 'Government',         '🏛', 'blue', 1),
    ('map-healthcare',       'map', 'Healthcare',          '🏥', 'red',  2),
    ('map-education',        'map', 'Education',           '🎓', 'gold', 3),
    ('map-tourism',          'map', 'Tourism',              '🏖', 'teal', 4),
    ('map-parks-recreation', 'map', 'Parks & Recreation',  '🌳', 'blue', 5),
    ('map-transportation',   'map', 'Transportation',      '🚍', 'gold', 6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO directory_subcategories (id, module, group_id, name, display_order) VALUES
    ('map-barangay-hall',      'map', 'map-government', 'Barangay Hall',    1),
    ('map-municipal-office',   'map', 'map-government', 'Municipal Office', 2),
    ('map-police-station',     'map', 'map-government', 'Police Station',   3),
    ('map-fire-station',       'map', 'map-government', 'Fire Station',     4),

    ('map-hospital',           'map', 'map-healthcare', 'Hospital',       1),
    ('map-health-center',      'map', 'map-healthcare', 'Health Center',  2),
    ('map-medical-clinic',     'map', 'map-healthcare', 'Medical Clinic', 3),

    ('map-elementary-school',  'map', 'map-education', 'Elementary School', 1),
    ('map-high-school',        'map', 'map-education', 'High School',       2),
    ('map-college',            'map', 'map-education', 'College',           3),

    ('map-tourist-attraction', 'map', 'map-tourism', 'Tourist Attraction',  1),
    ('map-historical-landmark','map', 'map-tourism', 'Historical Landmark', 2),
    ('map-cultural-site',      'map', 'map-tourism', 'Cultural Site',       3),

    ('map-public-park',       'map', 'map-parks-recreation', 'Public Park',     1),
    ('map-playground',        'map', 'map-parks-recreation', 'Playground',      2),
    ('map-sports-complex',    'map', 'map-parks-recreation', 'Sports Complex',  3),

    ('map-bus-terminal',      'map', 'map-transportation', 'Bus Terminal',      1),
    ('map-tricycle-terminal', 'map', 'map-transportation', 'Tricycle Terminal', 2),
    ('map-jeepney-terminal',  'map', 'map-transportation', 'Jeepney Terminal',  3)
ON CONFLICT (id) DO NOTHING;

-- ── 4. Seed: Organization Directory (module = 'organization') ─────────────
INSERT INTO directory_category_groups (id, module, name, icon, color, display_order) VALUES
    ('org-government',  'organization', 'Government Organizations',     '🏛', 'blue', 1),
    ('org-community',   'organization', 'Community Organizations',      '🤝', 'teal', 2),
    ('org-youth',        'organization', 'Youth Organizations',          '🧑‍🤝‍🧑', 'gold', 3),
    ('org-senior',       'organization', 'Senior Citizen Organizations', '👴', 'red',  4),
    ('org-women',        'organization', 'Women''s Organizations',       '👩', 'blue', 5),
    ('org-religious',    'organization', 'Religious Organizations',     '⛪', 'teal', 6),
    ('org-volunteer',    'organization', 'Volunteer Organizations',     '🙋', 'gold', 7)
ON CONFLICT (id) DO NOTHING;

INSERT INTO directory_subcategories (id, module, group_id, name, display_order) VALUES
    ('org-barangay-council',    'organization', 'org-government', 'Barangay Council',     1),
    ('org-sk-council',          'organization', 'org-government', 'SK Council',            2),
    ('org-barangay-committees', 'organization', 'org-government', 'Barangay Committees',   3),

    ('org-homeowners-association', 'organization', 'org-community', 'Homeowners Association', 1),
    ('org-peoples-organization',   'organization', 'org-community', 'People''s Organization',  2),
    ('org-cooperative',            'organization', 'org-community', 'Cooperative',             3),

    ('org-youth-club',   'organization', 'org-youth', 'Youth Club',  1),
    ('org-sports-club',  'organization', 'org-youth', 'Sports Club', 2),

    ('org-senior-citizens-association', 'organization', 'org-senior', 'Senior Citizens Association', 1),

    ('org-womens-association', 'organization', 'org-women', 'Women''s Association', 1),

    ('org-church-ministry',  'organization', 'org-religious', 'Church Ministry', 1),
    ('org-religious-group',  'organization', 'org-religious', 'Religious Group',  2),

    ('org-volunteer-group',    'organization', 'org-volunteer', 'Volunteer Group',   1),
    ('org-civic-organization', 'organization', 'org-volunteer', 'Civic Organization',2)
ON CONFLICT (id) DO NOTHING;

-- ── 5. Seed: Emergency Directory (module = 'emergency') ───────────────────
INSERT INTO directory_category_groups (id, module, name, icon, color, display_order) VALUES
    ('em-police',       'emergency', 'Police',             '🚓', 'blue', 1),
    ('em-fire-rescue',  'emergency', 'Fire & Rescue',      '🚒', 'red',  2),
    ('em-medical',      'emergency', 'Medical Emergency',  '🏥', 'teal', 3),
    ('em-disaster',     'emergency', 'Disaster Response',  '📡', 'gold', 4),
    ('em-utilities',    'emergency', 'Utilities',          '🔌', 'blue', 5),
    ('em-hotlines',     'emergency', 'Emergency Hotlines', '📞', 'red',  6)
ON CONFLICT (id) DO NOTHING;

INSERT INTO directory_subcategories (id, module, group_id, name, display_order) VALUES
    ('em-police-station', 'emergency', 'em-police', 'Police Station', 1),
    ('em-police-hotline',  'emergency', 'em-police', 'Police Hotline', 2),

    ('em-fire-station',  'emergency', 'em-fire-rescue', 'Fire Station', 1),
    ('em-rescue-team',   'emergency', 'em-fire-rescue', 'Rescue Team',  2),
    ('em-bert',          'emergency', 'em-fire-rescue', 'BERT',         3),

    ('em-hospital',       'emergency', 'em-medical', 'Hospital',      1),
    ('em-ambulance',      'emergency', 'em-medical', 'Ambulance',     2),
    ('em-health-center',  'emergency', 'em-medical', 'Health Center', 3),

    ('em-mdrrmo',            'emergency', 'em-disaster', 'MDRRMO',            1),
    ('em-evacuation-center', 'emergency', 'em-disaster', 'Evacuation Center', 2),

    ('em-electric-utility', 'emergency', 'em-utilities', 'Electric Utility', 1),
    ('em-water-utility',    'emergency', 'em-utilities', 'Water Utility',    2),

    ('em-hotline-national', 'emergency', 'em-hotlines', 'National', 1),
    ('em-hotline-local',    'emergency', 'em-hotlines', 'Local',     2)
ON CONFLICT (id) DO NOTHING;

-- ── 6. Drop the leftover hardcoded CHECK constraints on the other 3 tables ─
-- (same fix already applied to directory_businesses — validation now happens
-- at the application layer against directory_subcategories)
ALTER TABLE directory_map_locations   DROP CONSTRAINT IF EXISTS directory_map_locations_category_check;
ALTER TABLE directory_organizations   DROP CONSTRAINT IF EXISTS directory_organizations_category_check;
ALTER TABLE directory_emergency       DROP CONSTRAINT IF EXISTS directory_emergency_category_check;

-- ── 7. Remap existing rows to the new taxonomy ────────────────────────────
-- Map's 'Barangay Hall' already matches the new subcategory name exactly.
UPDATE directory_emergency SET category = 'Hospital' WHERE category = 'Hospitals';
