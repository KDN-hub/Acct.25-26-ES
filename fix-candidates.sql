-- ============================================
-- FIX: Clean up duplicates & re-seed with correct image URLs
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Wipe everything clean (order matters due to FK constraints)
TRUNCATE votes CASCADE;
TRUNCATE candidates CASCADE;
TRUNCATE positions CASCADE;

-- 2. Insert the 11 real positions
INSERT INTO positions (name, display_order) VALUES
  ('Executive President',          1),
  ('Vice President',               2),
  ('General Secretary',            3),
  ('Assistant Social Director',    4),
  ('Assistant Welfare Director',   5),
  ('Treasurer',                    6),
  ('Public Relations Officer',     7),
  ('Director of Public Relations', 8),
  ('Welfare Director',             9),
  ('Sports Director',             10),
  ('Chaplain',                    11);

-- 3. Insert all 13 candidates with URL-encoded image URLs
DO $$
DECLARE
  base_url TEXT := 'https://qflfvgmdpahzeioewenh.supabase.co/storage/v1/object/public/candidate_photos/';
  pos_exec_president      UUID;
  pos_vice_president      UUID;
  pos_gen_secretary       UUID;
  pos_asst_social_dir     UUID;
  pos_asst_welfare_dir    UUID;
  pos_treasurer           UUID;
  pos_pro                 UUID;
  pos_dir_public_rel      UUID;
  pos_welfare_dir         UUID;
  pos_sports_dir          UUID;
  pos_chaplain            UUID;
BEGIN
  SELECT id INTO pos_exec_president   FROM positions WHERE name = 'Executive President';
  SELECT id INTO pos_vice_president   FROM positions WHERE name = 'Vice President';
  SELECT id INTO pos_gen_secretary    FROM positions WHERE name = 'General Secretary';
  SELECT id INTO pos_asst_social_dir  FROM positions WHERE name = 'Assistant Social Director';
  SELECT id INTO pos_asst_welfare_dir FROM positions WHERE name = 'Assistant Welfare Director';
  SELECT id INTO pos_treasurer        FROM positions WHERE name = 'Treasurer';
  SELECT id INTO pos_pro              FROM positions WHERE name = 'Public Relations Officer';
  SELECT id INTO pos_dir_public_rel   FROM positions WHERE name = 'Director of Public Relations';
  SELECT id INTO pos_welfare_dir      FROM positions WHERE name = 'Welfare Director';
  SELECT id INTO pos_sports_dir       FROM positions WHERE name = 'Sports Director';
  SELECT id INTO pos_chaplain         FROM positions WHERE name = 'Chaplain';

  INSERT INTO candidates (position_id, name, image_url) VALUES
    -- Executive President
    (pos_exec_president,   'Olaleye Adeife Precious',
     base_url || 'Olaleye%20Adeife%20PreciousExecutive%20President.jpeg'),

    -- Vice President (2 candidates)
    (pos_vice_president,   'Adigun Aderinsola Ademide',
     base_url || 'Adigun%20Aderinsola%20AdemideVice%20President.jpeg'),
    (pos_vice_president,   'Fakowajo Ayobami',
     base_url || 'Fakowajo%20AyobamiVice%20President.jpeg'),

    -- General Secretary (2 candidates)
    (pos_gen_secretary,    'Okodugha Daniel',
     base_url || 'Okodugha%20Daniel%20General%20secretary.jpeg'),
    (pos_gen_secretary,    'Adegbite Adedolapo',
     base_url || 'Adegbite%20AdedolapoGeneral%20Secretary.jpeg'),

    -- Assistant Social Director
    (pos_asst_social_dir,  'Ebere Grace Oluchukwu',
     base_url || 'Ebere%20Grace%20OluchukwuAssistant%20social%20director.jpeg'),

    -- Assistant Welfare Director
    (pos_asst_welfare_dir, 'Gbokoyi Oluwatimileyin Boluwatife',
     base_url || 'Gbokoyi%20Oluwatimileyin%20BoluwatifeAssistant%20welfare%20director.jpeg'),

    -- Treasurer
    (pos_treasurer,        'Nwobu Kasie Chiamaka',
     base_url || 'Nwobu%20Kasie%20ChiamakaTreasurer.jpeg'),

    -- Public Relations Officer
    (pos_pro,              'Daodu Moyinoluwa Anthonia',
     base_url || 'Daodu%20Moyinoluwa%20AnthoniaPublic%20Relations%20officer.jpeg'),

    -- Director of Public Relations
    (pos_dir_public_rel,   'Jegede Benjamin Oladimeji',
     base_url || 'Jegede%20Benjamin%20OladimejiDirector%20of%20Public%20relations.jpeg'),

    -- Welfare Director
    (pos_welfare_dir,      'Yisau Sofiyyah Abeke',
     base_url || 'Yisau%20Sofiyyah%20AbekeWelfare%20director.jpeg'),

    -- Sports Director
    (pos_sports_dir,       'Oseji Promise Chidinma',
     base_url || 'Oseji%20Promise%20ChidinmaSports%20director.jpeg'),

    -- Chaplain
    (pos_chaplain,         'Olorunyomi Folafunmi',
     base_url || 'Olorunyomi%20FolafunmiChaplain.jpeg');
END $$;
