"""
One-time seed script: inserts the 16 standard Bolbok hotlines into emergency_hotlines.
Run once from the BBCB Site directory:  python seed_hotlines.py
Skips any entry whose label already exists to avoid duplicates.
"""
import uuid
from datetime import datetime, timezone
from db import supabase

HOTLINES = [
    # Emergency Numbers
    {'label': '24/7 EBD Emergency Health Hotline', 'number': '0999-222-6626',  'category': 'Emergency Numbers',       'display_order': 1},
    {'label': "Mayor's Action Center",              'number': '723-1511',        'category': 'Emergency Numbers',       'display_order': 2},
    {'label': 'BFP Batangas City',                 'number': '425-7163 / 301-7996 / 09156021984', 'category': 'Emergency Numbers', 'display_order': 3},
    {'label': 'PNP Batangas City',                 'number': '408-8023',        'category': 'Emergency Numbers',       'display_order': 4},
    # Hospitals
    {'label': 'Batangas Medical Center',                            'number': '723-0911',        'category': 'Hospitals', 'display_order': 5},
    {'label': "Saint Patrick's Hospital Medical Center",            'number': '723-1605',        'category': 'Hospitals', 'display_order': 6},
    {'label': 'Jesus of Nazareth Hospital',                         'number': '723-4144',        'category': 'Hospitals', 'display_order': 7},
    {'label': 'Golden Gate General Hospital',                       'number': '723-2508',        'category': 'Hospitals', 'display_order': 8},
    {'label': 'Batangas Healthcare Specialists Medical Center',     'number': '(043) 403-8642', 'category': 'Hospitals', 'display_order': 9},
    {'label': 'United Doctors of St. Camillus de Lellis Hospital', 'number': '0918-994-2074', 'category': 'Hospitals', 'display_order': 10},
    # Other Important Hotlines
    {'label': 'Meralco - All Departments',                              'number': '16211 / 1622-2847',       'category': 'Other Important Hotlines', 'display_order': 11},
    {'label': 'National Power Corporation',                             'number': '300-3592',                'category': 'Other Important Hotlines', 'display_order': 12},
    {'label': 'PrimeWater Batangas City',                              'number': '09494142633 / 980-6928',  'category': 'Other Important Hotlines', 'display_order': 13},
    {'label': 'City Disaster Risk Reduction and Management Office',    'number': '702-3902',                'category': 'Other Important Hotlines', 'display_order': 14},
    {'label': 'LTO Batangas City',                                     'number': '740-9738',                'category': 'Other Important Hotlines', 'display_order': 15},
    {'label': 'VAWC Batangas City',                                    'number': '0956-826-7017',           'category': 'Other Important Hotlines', 'display_order': 16},
]

def main():
    existing = supabase.table('emergency_hotlines').select('label').execute()
    existing_labels = {r['label'] for r in (existing.data or [])}

    now = datetime.now(timezone.utc).isoformat()
    inserted = 0
    skipped = 0

    for h in HOTLINES:
        if h['label'] in existing_labels:
            print(f"  SKIP (exists): {h['label']}")
            skipped += 1
            continue
        row = {
            'id':            str(uuid.uuid4()),
            'label':         h['label'],
            'number':        h['number'],
            'category':      h['category'],
            'status':        'published',
            'display_order': h['display_order'],
            'description':   '',
            'created_at':    now,
            'updated_at':    now,
        }
        supabase.table('emergency_hotlines').insert(row).execute()
        print(f"  INSERTED: {h['label']}")
        inserted += 1

    print(f"\nDone — {inserted} inserted, {skipped} skipped.")

if __name__ == '__main__':
    main()
