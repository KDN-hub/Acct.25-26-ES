-- ============================================
-- Fix NEW candidate photos with correct Supabase Storage bucket
-- Run this in your Supabase SQL Editor
-- ============================================
-- NOTE: Check your bucket name in Supabase Dashboard > Storage
-- Use candidate_photos (underscore) or candidate-photos (hyphen) based on your actual bucket

UPDATE candidates SET image_url = 'https://qflfvgmdpahzeioewenh.supabase.co/storage/v1/object/public/candidate_photos/Ndianefo chibueze KelvinChief accountant.jpeg'
WHERE name = 'Ndianefo Chibueze Kelvin';

UPDATE candidates SET image_url = 'https://qflfvgmdpahzeioewenh.supabase.co/storage/v1/object/public/candidate_photos/Izundu vivianSocial director.jpeg'
WHERE name = 'Izundu Vivian';

UPDATE candidates SET image_url = 'https://qflfvgmdpahzeioewenh.supabase.co/storage/v1/object/public/candidate_photos/Oranwusi Edwin ChukwuemekaAssistant General Secretary.jpeg'
WHERE name = 'Oranwusi Edwin Chukwuemeka';

UPDATE candidates SET image_url = 'https://qflfvgmdpahzeioewenh.supabase.co/storage/v1/object/public/candidate_photos/Omobude-Aisagbonhi ShekinaAssistant General Secretary.jpeg'
WHERE name = 'Omobude-Aisagbonhi Shekina';

UPDATE candidates SET image_url = 'https://qflfvgmdpahzeioewenh.supabase.co/storage/v1/object/public/candidate_photos/Azeez Zainab OlanshileAssistant General Secretary.jpeg'
WHERE name = 'Azeez Zainab Olanshile';
