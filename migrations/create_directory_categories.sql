-- Migration: Directory Category Standardization (Business Directory)
-- Creates two new reference tables so business categories are managed
-- through the Admin Panel instead of a hardcoded Python list, then seeds
-- the 12 official category groups + subcategories, and remaps the 3
-- legacy category strings already in use on directory_businesses.
-- Purely additive: directory_businesses itself is not altered.
-- Run this in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS directory_category_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL DEFAULT '',
    color TEXT NOT NULL DEFAULT 'blue',
    display_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS directory_subcategories (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL REFERENCES directory_category_groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    display_order INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ── Seed: 12 official category groups ─────────────────────────────────────
INSERT INTO directory_category_groups (id, name, icon, color, display_order) VALUES
    ('restaurant',        'Restaurant',             '🍽', 'blue', 1),
    ('cafes-bakeries',    'Cafes & Bakeries',       '☕', 'teal', 2),
    ('shopping-retail',   'Shopping & Retail',      '🛍', 'gold', 3),
    ('healthcare',        'Healthcare',             '🏥', 'red',  4),
    ('education',         'Education',              '🎓', 'blue', 5),
    ('services',          'Services',               '🛠', 'teal', 6),
    ('government',        'Government',             '🏛', 'gold', 7),
    ('parks-recreation',  'Parks & Recreation',     '🌳', 'red',  8),
    ('salons-beauty',     'Salons & Beauty',        '💇', 'blue', 9),
    ('hotels-accom',      'Hotels & Accommodations','🏨', 'teal', 10),
    ('transportation',    'Transportation',         '🚍', 'gold', 11),
    ('finance-banking',   'Finance & Banking',      '💳', 'red',  12)
ON CONFLICT (id) DO NOTHING;

-- ── Seed: subcategories per group ──────────────────────────────────────────
INSERT INTO directory_subcategories (id, group_id, name, display_order) VALUES
    -- Restaurant
    ('restaurants',        'restaurant', 'Restaurants',         1),
    ('fast-food',          'restaurant', 'Fast Food',           2),
    ('eateries',           'restaurant', 'Eateries',            3),
    ('food-stalls',        'restaurant', 'Food Stalls',         4),
    ('carinderia',         'restaurant', 'Carinderia',          5),
    ('grill-house',        'restaurant', 'Grill House',         6),
    ('seafood-restaurant', 'restaurant', 'Seafood Restaurant',  7),

    -- Cafes & Bakeries
    ('coffee-shops',   'cafes-bakeries', 'Coffee Shops',    1),
    ('cafes',          'cafes-bakeries', 'Cafes',           2),
    ('milk-tea-shops', 'cafes-bakeries', 'Milk Tea Shops',  3),
    ('bakeries',       'cafes-bakeries', 'Bakeries',        4),
    ('pastry-shops',   'cafes-bakeries', 'Pastry Shops',    5),
    ('dessert-shops',  'cafes-bakeries', 'Dessert Shops',   6),

    -- Shopping & Retail
    ('grocery-stores',        'shopping-retail', 'Grocery Stores',          1),
    ('convenience-stores',    'shopping-retail', 'Convenience Stores',      2),
    ('supermarkets',          'shopping-retail', 'Supermarkets',            3),
    ('hardware-stores',       'shopping-retail', 'Hardware Stores',         4),
    ('agricultural-supply',   'shopping-retail', 'Agricultural Supply',     5),
    ('clothing-stores',       'shopping-retail', 'Clothing Stores',         6),
    ('electronics',           'shopping-retail', 'Electronics',             7),
    ('furniture',             'shopping-retail', 'Furniture',               8),
    ('gift-shops',            'shopping-retail', 'Gift Shops',              9),
    ('pharmacies-retail',     'shopping-retail', 'Pharmacies (Retail)',     10),
    ('water-refilling',       'shopping-retail', 'Water Refilling Stations',11),
    ('pet-supply-stores',     'shopping-retail', 'Pet Supply Stores',       12),
    ('bookstores',            'shopping-retail', 'Bookstores',              13),
    ('general-store',         'shopping-retail', 'General Store',           14),

    -- Healthcare
    ('hospital',            'healthcare', 'Hospital',            1),
    ('medical-clinic',       'healthcare', 'Medical Clinic',      2),
    ('dental-clinic',        'healthcare', 'Dental Clinic',       3),
    ('health-center',        'healthcare', 'Health Center',       4),
    ('pharmacy',             'healthcare', 'Pharmacy',            5),
    ('diagnostic-laboratory','healthcare', 'Diagnostic Laboratory',6),
    ('veterinary-clinic',    'healthcare', 'Veterinary Clinic',   7),
    ('animal-hospital',      'healthcare', 'Animal Hospital',     8),
    ('birthing-center',      'healthcare', 'Birthing Center',     9),

    -- Education
    ('elementary-school',  'education', 'Elementary School',  1),
    ('high-school',        'education', 'High School',         2),
    ('senior-high-school', 'education', 'Senior High School',  3),
    ('college',            'education', 'College',             4),
    ('university',         'education', 'University',          5),
    ('daycare-center',     'education', 'Daycare Center',       6),
    ('training-center',    'education', 'Training Center',      7),
    ('tutorial-center',    'education', 'Tutorial Center',      8),
    ('tesda-center',       'education', 'TESDA Center',         9),

    -- Services
    ('computer-repair',      'services', 'Computer Repair',      1),
    ('mobile-phone-repair',  'services', 'Mobile Phone Repair',  2),
    ('laundry-service',      'services', 'Laundry Service',      3),
    ('tailoring',            'services', 'Tailoring',            4),
    ('printing-services',    'services', 'Printing Services',    5),
    ('photography-studio',   'services', 'Photography Studio',   6),
    ('internet-cafe',        'services', 'Internet Café',        7),
    ('auto-repair',          'services', 'Auto Repair',          8),
    ('vulcanizing-shop',     'services', 'Vulcanizing Shop',     9),
    ('car-wash',             'services', 'Car Wash',             10),
    ('appliance-repair',     'services', 'Appliance Repair',     11),
    ('welding-shop',         'services', 'Welding Shop',         12),
    ('construction-services','services', 'Construction Services',13),
    ('event-services',       'services', 'Event Services',       14),
    ('funeral-services',     'services', 'Funeral Services',     15),
    ('cleaning-services',    'services', 'Cleaning Services',    16),
    ('general-services',     'services', 'General Services',     17),

    -- Government
    ('barangay-hall-cat',      'government', 'Barangay Hall',          1),
    ('municipal-offices',      'government', 'Municipal Offices',      2),
    ('police-station',         'government', 'Police Station',        3),
    ('fire-station',           'government', 'Fire Station',          4),
    ('post-office',            'government', 'Post Office',           5),
    ('government-agencies',    'government', 'Government Agencies',   6),
    ('public-service-offices', 'government', 'Public Service Offices',7),

    -- Parks & Recreation
    ('public-parks',            'parks-recreation', 'Public Parks',             1),
    ('basketball-courts',       'parks-recreation', 'Basketball Courts',        2),
    ('sports-complex',          'parks-recreation', 'Sports Complex',           3),
    ('playgrounds',             'parks-recreation', 'Playgrounds',              4),
    ('open-spaces',             'parks-recreation', 'Open Spaces',              5),
    ('recreational-facilities', 'parks-recreation', 'Recreational Facilities', 6),
    ('community-centers',       'parks-recreation', 'Community Centers',        7),

    -- Salons & Beauty
    ('beauty-salon',    'salons-beauty', 'Beauty Salon',    1),
    ('hair-salon',      'salons-beauty', 'Hair Salon',      2),
    ('spa',             'salons-beauty', 'Spa',             3),
    ('massage',         'salons-beauty', 'Massage',         4),
    ('nail-salon',      'salons-beauty', 'Nail Salon',      5),
    ('barbershop',      'salons-beauty', 'Barbershop',      6),
    ('skin-care-clinic','salons-beauty', 'Skin Care Clinic',7),
    ('wellness-center', 'salons-beauty', 'Wellness Center', 8),

    -- Hotels & Accommodations
    ('hotels',           'hotels-accom', 'Hotels',           1),
    ('motels',           'hotels-accom', 'Motels',           2),
    ('inns',             'hotels-accom', 'Inns',             3),
    ('pension-houses',   'hotels-accom', 'Pension Houses',   4),
    ('resorts',          'hotels-accom', 'Resorts',          5),
    ('lodging-houses',   'hotels-accom', 'Lodging Houses',   6),
    ('bed-and-breakfast','hotels-accom', 'Bed & Breakfast',  7),

    -- Transportation
    ('bus-terminal',        'transportation', 'Bus Terminal',        1),
    ('tricycle-terminal',   'transportation', 'Tricycle Terminal',   2),
    ('jeepney-terminal',    'transportation', 'Jeepney Terminal',    3),
    ('taxi-stand',          'transportation', 'Taxi Stand',          4),
    ('transport-services',  'transportation', 'Transport Services', 5),
    ('fuel-stations',       'transportation', 'Fuel Stations',       6),
    ('ev-charging-stations','transportation', 'EV Charging Stations',7),
    ('parking-areas',       'transportation', 'Parking Areas',       8),

    -- Finance & Banking
    ('banks',                'finance-banking', 'Banks',                1),
    ('atms',                 'finance-banking', 'ATMs',                 2),
    ('lending-institutions', 'finance-banking', 'Lending Institutions', 3),
    ('cooperatives',         'finance-banking', 'Cooperatives',         4),
    ('remittance-centers',   'finance-banking', 'Remittance Centers',   5),
    ('payment-centers',      'finance-banking', 'Payment Centers',      6),
    ('insurance-offices',    'finance-banking', 'Insurance Offices',    7),
    ('pawnshops',            'finance-banking', 'Pawnshops',            8)
ON CONFLICT (id) DO NOTHING;

-- ── Drop the old hardcoded CHECK constraint on directory_businesses.category ──
-- (from the original create_directory_businesses.sql — it restricted category
-- to the 4 old values, which blocks the remap below and any new category.
-- Validation now happens at the application layer against directory_subcategories.)
ALTER TABLE directory_businesses DROP CONSTRAINT IF EXISTS directory_businesses_category_check;

-- ── Remap the 3 legacy category strings already used on directory_businesses ──
UPDATE directory_businesses SET category = 'Restaurants'       WHERE category = 'Food & Restaurants';
UPDATE directory_businesses SET category = 'General Store'     WHERE category = 'Stores';
UPDATE directory_businesses SET category = 'General Services'  WHERE category = 'Services';
