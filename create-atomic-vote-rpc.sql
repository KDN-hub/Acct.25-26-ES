-- ============================================
-- Atomic Vote Submission RPC Function
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create the atomic vote transaction function
CREATE OR REPLACE FUNCTION submit_votes_atomic(
  p_voter_matric TEXT,
  p_votes JSONB  -- Array of {position_id, candidate_id}
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_has_voted BOOLEAN;
  v_vote JSONB;
BEGIN
  -- Step 1: Check if voter exists and hasn't voted (with row lock)
  SELECT has_voted INTO v_has_voted
  FROM voters
  WHERE matric_number = p_voter_matric
  FOR UPDATE;  -- Lock the row to prevent race conditions

  IF v_has_voted IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Voter not found');
  END IF;

  IF v_has_voted = true THEN
    RETURN jsonb_build_object('success', false, 'error', 'You have already voted.');
  END IF;

  -- Step 2: Insert all votes
  FOR v_vote IN SELECT * FROM jsonb_array_elements(p_votes)
  LOOP
    INSERT INTO votes (voter_matric, position_id, candidate_id)
    VALUES (
      p_voter_matric,
      (v_vote->>'position_id')::UUID,
      (v_vote->>'candidate_id')::UUID
    );
  END LOOP;

  -- Step 3: Mark voter as voted
  UPDATE voters
  SET has_voted = true, voted_at = NOW()
  WHERE matric_number = p_voter_matric;

  -- All 3 steps succeeded — transaction commits automatically
  RETURN jsonb_build_object('success', true);

EXCEPTION WHEN OTHERS THEN
  -- Any error rolls back the entire transaction
  RAISE;
END;
$$;

-- 2. Recount all votes and verify data integrity
-- (Run this to check current state)
SELECT
  p.name AS position,
  c.name AS candidate,
  COUNT(v.id) AS actual_votes
FROM candidates c
JOIN positions p ON c.position_id = p.id
LEFT JOIN votes v ON v.candidate_id = c.id
GROUP BY p.name, c.name
ORDER BY p.name, actual_votes DESC;
