-- ============================================
-- AD E-Voting: Database Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Positions table
CREATE TABLE IF NOT EXISTS positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Drop and recreate candidates table with position reference
DROP TABLE IF EXISTS candidates;
CREATE TABLE candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id UUID NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voter_matric TEXT NOT NULL,
  position_id UUID NOT NULL REFERENCES positions(id),
  candidate_id UUID NOT NULL REFERENCES candidates(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(voter_matric, position_id)  -- one vote per position per voter
);

-- 4. Add voted_at column to voters if it doesn't exist
-- (already exists in your table)

-- 5. RLS Policies (allow public read for positions/candidates, insert for votes)
ALTER TABLE positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on positions" ON positions FOR SELECT USING (true);
CREATE POLICY "Allow public read on candidates" ON candidates FOR SELECT USING (true);
CREATE POLICY "Allow public insert on votes" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on votes" ON votes FOR SELECT USING (true);

-- Voters table policies (allow read + update for vote marking)
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on voters" ON voters FOR SELECT USING (true);
CREATE POLICY "Allow public update on voters" ON voters FOR UPDATE USING (true);

-- ============================================
-- Sample Data: Temporary positions & candidates
-- ============================================

INSERT INTO positions (name, display_order) VALUES
  ('President', 1),
  ('Vice President', 2),
  ('General Secretary', 3),
  ('Financial Secretary', 4),
  ('Treasurer', 5),
  ('Public Relations Officer', 6);

-- Get position IDs and insert candidates
DO $$
DECLARE
  pos_president UUID;
  pos_vp UUID;
  pos_secretary UUID;
  pos_finsec UUID;
  pos_treasurer UUID;
  pos_pro UUID;
BEGIN
  SELECT id INTO pos_president FROM positions WHERE name = 'President';
  SELECT id INTO pos_vp FROM positions WHERE name = 'Vice President';
  SELECT id INTO pos_secretary FROM positions WHERE name = 'General Secretary';
  SELECT id INTO pos_finsec FROM positions WHERE name = 'Financial Secretary';
  SELECT id INTO pos_treasurer FROM positions WHERE name = 'Treasurer';
  SELECT id INTO pos_pro FROM positions WHERE name = 'Public Relations Officer';

  INSERT INTO candidates (position_id, name) VALUES
    -- President
    (pos_president, 'Candidate A'),
    (pos_president, 'Candidate B'),
    -- Vice President
    (pos_vp, 'Candidate C'),
    (pos_vp, 'Candidate D'),
    -- General Secretary
    (pos_secretary, 'Candidate E'),
    (pos_secretary, 'Candidate F'),
    -- Financial Secretary
    (pos_finsec, 'Candidate G'),
    (pos_finsec, 'Candidate H'),
    -- Treasurer
    (pos_treasurer, 'Candidate I'),
    (pos_treasurer, 'Candidate J'),
    -- PRO
    (pos_pro, 'Candidate K'),
    (pos_pro, 'Candidate L');
END $$;
