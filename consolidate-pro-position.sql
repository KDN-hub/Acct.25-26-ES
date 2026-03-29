-- ============================================
-- Consolidate PRO / Public Relations Officer
-- into "Director of Public Relations"
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. DELETE votes from "Public Relations Officer" where the voter already
--    voted for "Director of Public Relations" (prevents duplicate key error)
DELETE FROM votes
WHERE position_id = (SELECT id FROM positions WHERE name = 'Public Relations Officer')
  AND voter_matric IN (
    SELECT voter_matric FROM votes
    WHERE position_id = (SELECT id FROM positions WHERE name = 'Director of Public Relations')
  );

-- 2. Move remaining votes from "Public Relations Officer" to "Director of Public Relations"
UPDATE votes
SET position_id = (SELECT id FROM positions WHERE name = 'Director of Public Relations')
WHERE position_id = (SELECT id FROM positions WHERE name = 'Public Relations Officer');

-- 3. Move candidates from "Public Relations Officer" to "Director of Public Relations"
UPDATE candidates
SET position_id = (SELECT id FROM positions WHERE name = 'Director of Public Relations')
WHERE position_id = (SELECT id FROM positions WHERE name = 'Public Relations Officer');

-- 4. Delete the now-empty "Public Relations Officer" position
DELETE FROM positions WHERE name = 'Public Relations Officer';

-- 5. Tidy up display order
UPDATE positions SET display_order = 7 WHERE name = 'Director of Public Relations';
UPDATE positions SET display_order = display_order - 1
WHERE display_order > 7
  AND name != 'Director of Public Relations';
