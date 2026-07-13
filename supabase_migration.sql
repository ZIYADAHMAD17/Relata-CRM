-- Run this in your Supabase SQL Editor to add the required columns and tables

-- 1. Add extra profile columns to the people table
ALTER TABLE people
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS birthday TEXT,
  ADD COLUMN IF NOT EXISTS linkedin TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_contact TEXT,
  ADD COLUMN IF NOT EXISTS next_follow_up TEXT;

-- 2. Create the notes table for per-person notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS and allow all operations (adjust for your auth setup)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all notes" ON notes FOR ALL USING (true) WITH CHECK (true);

-- Done! These changes are required for PersonProfile extra fields and notes.
