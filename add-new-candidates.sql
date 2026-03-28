-- ============================================
-- Add 3 New Positions & 5 New Candidates
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Insert the 3 new positions (continuing display_order from 12)
INSERT INTO positions (name, display_order) VALUES
  ('Chief Accountant',              12),
  ('Social Director',               13),
  ('Assistant General Secretary',   14);

-- 2. Insert the 5 new candidates
DO $$
DECLARE
  pos_chief_accountant     UUID;
  pos_social_director      UUID;
  pos_asst_gen_secretary   UUID;
BEGIN
  SELECT id INTO pos_chief_accountant    FROM positions WHERE name = 'Chief Accountant';
  SELECT id INTO pos_social_director     FROM positions WHERE name = 'Social Director';
  SELECT id INTO pos_asst_gen_secretary  FROM positions WHERE name = 'Assistant General Secretary';

  INSERT INTO candidates (position_id, name, image_url) VALUES
    -- Chief Accountant (1 candidate)
    (pos_chief_accountant,   'Ndianefo Chibueze Kelvin',                '/candidate-photos/ndianefo-chibueze-kelvin.jpg'),

    -- Social Director (1 candidate)
    (pos_social_director,    'Izundu Vivian',                           '/candidate-photos/izundu-vivian.jpg'),

    -- Assistant General Secretary (3 candidates)
    (pos_asst_gen_secretary, 'Oranwusi Edwin Chukwuemeka',              '/candidate-photos/oranwusi-edwin-chukwuemeka.jpg'),
    (pos_asst_gen_secretary, 'Omobude-Aisagbonhi Shekina',             '/candidate-photos/omobude-aisagbonhi-shekina.jpg'),
    (pos_asst_gen_secretary, 'Azeez Zainab Olanshile',                 '/candidate-photos/azeez-zainab-olanshile.jpg');
END $$;
