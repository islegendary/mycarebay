-- Supabase Database Update Migration
-- Run this in your Supabase SQL Editor to align database with code

-- Step 1: Remove avatar_url column from seniors table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'seniors' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE seniors DROP COLUMN avatar_url;
        RAISE NOTICE 'Removed avatar_url column from seniors table';
    ELSE
        RAISE NOTICE 'avatar_url column does not exist in seniors table';
    END IF;
END $$;

-- Step 2: Ensure all required tables exist with correct structure
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seniors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ailments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  time TEXT,
  doctor TEXT NOT NULL,
  purpose TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Create error logging tables (if they don't exist)
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  stack TEXT,
  component_stack TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  user_agent TEXT,
  url TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_name TEXT NOT NULL,
  load_time NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  user_agent TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 4: Create indexes (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_seniors_user_id ON seniors(user_id);
CREATE INDEX IF NOT EXISTS idx_ailments_senior_id ON ailments(senior_id);
CREATE INDEX IF NOT EXISTS idx_medications_senior_id ON medications(senior_id);
CREATE INDEX IF NOT EXISTS idx_appointments_senior_id ON appointments(senior_id);
CREATE INDEX IF NOT EXISTS idx_contacts_senior_id ON contacts(senior_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_performance_logs_timestamp ON performance_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_logs_component ON performance_logs(component_name);
CREATE INDEX IF NOT EXISTS idx_performance_logs_load_time ON performance_logs(load_time);

-- Step 5: Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seniors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ailments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_logs ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Step 7: Create RLS policies for seniors table
DROP POLICY IF EXISTS "Users can view their own seniors" ON seniors;
CREATE POLICY "Users can view their own seniors" ON seniors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = seniors.user_id 
      AND users.id::text = auth.uid()::text
    )
  );

DROP POLICY IF EXISTS "Users can manage their own seniors" ON seniors;
CREATE POLICY "Users can manage their own seniors" ON seniors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = seniors.user_id 
      AND users.id::text = auth.uid()::text
    )
  );

-- Step 8: Create RLS policies for related tables (ailments, medications, appointments, contacts)
-- These policies ensure users can only access data related to their own seniors

-- Ailments policies
DROP POLICY IF EXISTS "Users can manage ailments for their seniors" ON ailments;
CREATE POLICY "Users can manage ailments for their seniors" ON ailments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM seniors 
      JOIN users ON users.id = seniors.user_id
      WHERE seniors.id = ailments.senior_id 
      AND users.id::text = auth.uid()::text
    )
  );

-- Medications policies
DROP POLICY IF EXISTS "Users can manage medications for their seniors" ON medications;
CREATE POLICY "Users can manage medications for their seniors" ON medications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM seniors 
      JOIN users ON users.id = seniors.user_id
      WHERE seniors.id = medications.senior_id 
      AND users.id::text = auth.uid()::text
    )
  );

-- Appointments policies
DROP POLICY IF EXISTS "Users can manage appointments for their seniors" ON appointments;
CREATE POLICY "Users can manage appointments for their seniors" ON appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM seniors 
      JOIN users ON users.id = seniors.user_id
      WHERE seniors.id = appointments.senior_id 
      AND users.id::text = auth.uid()::text
    )
  );

-- Contacts policies
DROP POLICY IF EXISTS "Users can manage contacts for their seniors" ON contacts;
CREATE POLICY "Users can manage contacts for their seniors" ON contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM seniors 
      JOIN users ON users.id = seniors.user_id
      WHERE seniors.id = contacts.senior_id 
      AND users.id::text = auth.uid()::text
    )
  );

-- Step 9: Create RLS policies for logging tables (more permissive for monitoring)
-- Error logs - allow insert for all authenticated users, read for admins
DROP POLICY IF EXISTS "Users can insert error logs" ON error_logs;
CREATE POLICY "Users can insert error logs" ON error_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can view error logs" ON error_logs;
CREATE POLICY "Admins can view error logs" ON error_logs
  FOR SELECT USING (auth.role() = 'service_role');

-- Performance logs - allow insert for all authenticated users, read for admins
DROP POLICY IF EXISTS "Users can insert performance logs" ON performance_logs;
CREATE POLICY "Users can insert performance logs" ON performance_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can view performance logs" ON performance_logs;
CREATE POLICY "Admins can view performance logs" ON performance_logs
  FOR SELECT USING (auth.role() = 'service_role');

-- Step 10: Verify the update was successful
SELECT 
  'Database update completed successfully' as status,
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM seniors) as seniors_count,
  (SELECT COUNT(*) FROM ailments) as ailments_count,
  (SELECT COUNT(*) FROM medications) as medications_count,
  (SELECT COUNT(*) FROM appointments) as appointments_count,
  (SELECT COUNT(*) FROM contacts) as contacts_count;

-- Step 11: Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'seniors', 'ailments', 'medications', 'appointments', 'contacts', 'error_logs', 'performance_logs')
ORDER BY tablename;
