-- MyCareBay Database Migration
-- Run this in your Supabase SQL Editor to set up the complete database schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'plus', 'pro')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create seniors table
CREATE TABLE IF NOT EXISTS seniors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ailments table
CREATE TABLE IF NOT EXISTS ailments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medications table
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME,
    doctor TEXT NOT NULL,
    purpose TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create error_logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    stack TEXT,
    component_stack TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    url TEXT,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    error_type TEXT DEFAULT 'runtime',
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance_logs table
CREATE TABLE IF NOT EXISTS performance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_name TEXT NOT NULL,
    load_time NUMERIC NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
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
CREATE INDEX IF NOT EXISTS idx_performance_logs_component_name ON performance_logs(component_name);
CREATE INDEX IF NOT EXISTS idx_performance_logs_load_time ON performance_logs(load_time);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seniors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ailments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Create RLS policies for seniors table
CREATE POLICY "Users can view their own seniors" ON seniors
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = seniors.user_id 
            AND users.id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage their own seniors" ON seniors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = seniors.user_id 
            AND users.id::text = auth.uid()::text
        )
    );

-- Create RLS policies for ailments table
CREATE POLICY "Users can manage ailments for their seniors" ON ailments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM seniors 
            JOIN users ON users.id = seniors.user_id 
            WHERE seniors.id = ailments.senior_id 
            AND users.id::text = auth.uid()::text
        )
    );

-- Create RLS policies for medications table
CREATE POLICY "Users can manage medications for their seniors" ON medications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM seniors 
            JOIN users ON users.id = seniors.user_id 
            WHERE seniors.id = medications.senior_id 
            AND users.id::text = auth.uid()::text
        )
    );

-- Create RLS policies for appointments table
CREATE POLICY "Users can manage appointments for their seniors" ON appointments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM seniors 
            JOIN users ON users.id = seniors.user_id 
            WHERE seniors.id = appointments.senior_id 
            AND users.id::text = auth.uid()::text
        )
    );

-- Create RLS policies for contacts table
CREATE POLICY "Users can manage contacts for their seniors" ON contacts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM seniors 
            JOIN users ON users.id = seniors.user_id 
            WHERE seniors.id = contacts.senior_id 
            AND users.id::text = auth.uid()::text
        )
    );

-- Create RLS policies for error_logs table
CREATE POLICY "Users can insert error logs" ON error_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can view error logs" ON error_logs
    FOR SELECT USING (auth.role() = 'service_role');

-- Create RLS policies for performance_logs table
CREATE POLICY "Users can insert performance logs" ON performance_logs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can view performance logs" ON performance_logs
    FOR SELECT USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seniors_updated_at BEFORE UPDATE ON seniors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ailments_updated_at BEFORE UPDATE ON ailments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medications_updated_at BEFORE UPDATE ON medications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'seniors', 'ailments', 'medications', 'appointments', 'contacts', 'error_logs', 'performance_logs')
ORDER BY table_name;
