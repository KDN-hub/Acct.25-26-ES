-- ============================================
-- Election Settings Table
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create the election_settings table
CREATE TABLE IF NOT EXISTS election_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'Ongoing' CHECK (status IN ('Not Started', 'Ongoing', 'Ended')),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS: allow public read
ALTER TABLE election_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on election_settings"
  ON election_settings FOR SELECT USING (true);

-- 3. Seed with a single row
INSERT INTO election_settings (status) VALUES ('Ongoing');
