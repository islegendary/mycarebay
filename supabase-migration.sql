-- Create tables for MyCareBay application

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seniors table
CREATE TABLE IF NOT EXISTS seniors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ailments table
CREATE TABLE IF NOT EXISTS ailments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medications table
CREATE TABLE IF NOT EXISTS medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
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

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  senior_id UUID NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error logs table for monitoring and debugging
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

-- Performance logs table for monitoring component load times
CREATE TABLE IF NOT EXISTS performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_name TEXT NOT NULL,
  load_time NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
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
CREATE INDEX IF NOT EXISTS idx_performance_logs_component ON performance_logs(component_name);
CREATE INDEX IF NOT EXISTS idx_performance_logs_load_time ON performance_logs(load_time);

-- Clear existing demo data to ensure clean insertion
DELETE FROM contacts WHERE senior_id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM appointments WHERE senior_id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM medications WHERE senior_id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM ailments WHERE senior_id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM seniors WHERE id = '550e8400-e29b-41d4-a716-446655440001';
DELETE FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Insert demo user and data
INSERT INTO users (id, email, name, plan) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'demo@mycarebay.com',
  'Demo User',
  'pro'
);

-- Insert demo senior (Eleanor Vance)
INSERT INTO seniors (id, user_id, name, relationship, avatar_url)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  'Eleanor Vance',
  'Mother',
  null
);

-- Insert demo ailments
INSERT INTO ailments (id, senior_id, name, notes) VALUES
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Arthritis', 'Affects knees and hands, managed with medication.'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'Hypertension', 'Controlled with Lisinopril, monitoring blood pressure regularly.'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Type 2 Diabetes', 'Managed with diet and medication.');

-- Insert demo medications
INSERT INTO medications (id, senior_id, name, dosage, frequency) VALUES
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Lisinopril', '10mg', 'Once daily'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'Metformin', '500mg', 'Twice daily'),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', 'Ibuprofen', '400mg', 'As needed for pain');

-- Insert demo appointments
INSERT INTO appointments (id, senior_id, date, time, doctor, purpose, location) VALUES
('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440001', '2024-02-15', '10:00 AM', 'Dr. Chen', 'Cardiology check-up', 'Heart Center'),
('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440001', '2024-02-20', '2:30 PM', 'Dr. Patel', 'Endocrinology follow-up', 'Medical Plaza');

-- Insert demo contacts
INSERT INTO contacts (id, senior_id, name, type, phone, email) VALUES
('550e8400-e29b-41d4-a716-44665544000a', '550e8400-e29b-41d4-a716-446655440001', 'Dr. Chen (Cardiologist)', 'Doctor', '555-0101', 'dr.chen@heartcenter.com'),
('550e8400-e29b-41d4-a716-44665544000b', '550e8400-e29b-41d4-a716-446655440001', 'Dr. Patel (Endocrinologist)', 'Doctor', '555-0102', 'dr.patel@endocrinology.com'),
('550e8400-e29b-41d4-a716-44665544000c', '550e8400-e29b-41d4-a716-446655440001', 'Main Street Pharmacy', 'Pharmacist', '555-0103', 'pharmacy@mainstreet.com'),
('550e8400-e29b-41d4-a716-44665544000d', '550e8400-e29b-41d4-a716-446655440001', 'Sarah (Neighbor)', 'Emergency', '555-0104', 'sarah@email.com');
