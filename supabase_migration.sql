-- Run ALL of this in your Supabase SQL Editor
-- Go to: supabase.com → Your Project → SQL Editor → New Query

-- ─── Fix RLS policies for all tables ──────────────────────────────────────

-- PEOPLE table
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all people" ON people;
CREATE POLICY "Allow all people" ON people FOR ALL USING (true) WITH CHECK (true);

-- Make sure score and status columns exist
ALTER TABLE people
  ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 50,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Good',
  ADD COLUMN IF NOT EXISTS avatar TEXT,
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS birthday TEXT,
  ADD COLUMN IF NOT EXISTS linkedin TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_contact TEXT,
  ADD COLUMN IF NOT EXISTS next_follow_up TEXT;

-- ORGANIZATIONS table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all organizations" ON organizations;
CREATE POLICY "Allow all organizations" ON organizations FOR ALL USING (true) WITH CHECK (true);

-- Make sure all org columns exist
ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS logo TEXT,
  ADD COLUMN IF NOT EXISTS employees INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS contacts INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS revenue TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT;

-- MEETINGS table
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all meetings" ON meetings;
CREATE POLICY "Allow all meetings" ON meetings FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE meetings
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS date TEXT,
  ADD COLUMN IF NOT EXISTS time TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'video',
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Upcoming',
  ADD COLUMN IF NOT EXISTS attendees JSONB DEFAULT '[]';

-- TASKS table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all tasks" ON tasks;
CREATE POLICY "Allow all tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'To Do',
  ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium',
  ADD COLUMN IF NOT EXISTS assignee TEXT,
  ADD COLUMN IF NOT EXISTS "dueDate" TEXT;

-- DOCUMENTS table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all documents" ON documents;
CREATE POLICY "Allow all documents" ON documents FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'file',
  ADD COLUMN IF NOT EXISTS size TEXT,
  ADD COLUMN IF NOT EXISTS url TEXT;

-- INVOICES table
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all invoices" ON invoices;
CREATE POLICY "Allow all invoices" ON invoices FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS invoice_number TEXT,
  ADD COLUMN IF NOT EXISTS client_name TEXT,
  ADD COLUMN IF NOT EXISTS amount NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS due_date TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending';

-- NOTES table (create if not exists)
CREATE TABLE IF NOT EXISTS notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all notes" ON notes;
CREATE POLICY "Allow all notes" ON notes FOR ALL USING (true) WITH CHECK (true);

-- Done! All tables now allow read/write without authentication.
