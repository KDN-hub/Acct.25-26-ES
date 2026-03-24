-- ============================================
-- Accounting Department 25/26 Election
-- Seed: Positions & Candidates
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Clear existing sample data (votes first due to FK constraints)
DELETE FROM votes;
DELETE FROM candidates;
DELETE FROM positions;

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

-- 3. Insert all 13 candidates linked to their positions
DO $$
DECLARE
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
    -- Executive President (1 candidate)
    (pos_exec_president,   'Olaleye Adeife Precious',              '/candidate-photos/olaleye-adeife-precious.jpg'),

    -- Vice President (2 candidates)
    (pos_vice_president,   'Adigun Aderinsola Ademide',            '/candidate-photos/adigun-aderinsola-ademide.jpg'),
    (pos_vice_president,   'Fakowajo Ayobami',                     '/candidate-photos/fakowajo-ayobami.jpg'),

    -- General Secretary (2 candidates)
    (pos_gen_secretary,    'Okodugha Daniel',                      '/candidate-photos/okodugha-daniel.jpg'),
    (pos_gen_secretary,    'Adegbite Adedolapo',                   '/candidate-photos/adegbite-adedolapo.jpg'),

    -- Assistant Social Director (1 candidate)
    (pos_asst_social_dir,  'Ebere Grace Oluchukwu',                '/candidate-photos/ebere-grace-oluchukwu.jpg'),

    -- Assistant Welfare Director (1 candidate)
    (pos_asst_welfare_dir, 'Gbokoyi Oluwatimileyin Boluwatife',    '/candidate-photos/gbokoyi-oluwatimileyin-boluwatife.jpg'),

    -- Treasurer (1 candidate)
    (pos_treasurer,        'Nwobu Kasie Chiamaka',                 '/candidate-photos/nwobu-kasie-chiamaka.jpg'),

    -- Public Relations Officer (1 candidate)
    (pos_pro,              'Daodu Moyinoluwa Anthonia',             '/candidate-photos/daodu-moyinoluwa-anthonia.jpg'),

    -- Director of Public Relations (1 candidate)
    (pos_dir_public_rel,   'Jegede Benjamin Oladimeji',            '/candidate-photos/jegede-benjamin-oladimeji.jpg'),

    -- Welfare Director (1 candidate)
    (pos_welfare_dir,      'Yisau Sofiyyah Abeke',                 '/candidate-photos/yisau-sofiyyah-abeke.jpg'),

    -- Sports Director (1 candidate)
    (pos_sports_dir,       'Oseji Promise Chidinma',               '/candidate-photos/oseji-promise-chidinma.jpg'),

    -- Chaplain (1 candidate)
    (pos_chaplain,         'Olorunyomi Folafunmi',                 '/candidate-photos/olorunyomi-folafunmi.jpg');
END $$;
