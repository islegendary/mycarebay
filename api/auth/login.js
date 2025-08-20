import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

// Debug logging for environment variables
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Using key type:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Service Role' : 'Anonymous');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, plan = 'free' } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Check if user exists
    let { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Database error' });
    }

    let user;
    if (existingUser) {
      // User exists, return existing user
      user = existingUser;
    } else {
      // Create new user
      const userId = uuidv4();
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email,
            name,
            plan,
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        return res.status(500).json({ error: 'Failed to create user' });
      }

      user = newUser;

      // Create demo senior for new users
      if (email === 'demo@mycarebay.com') {
        try {
          const seniorId = uuidv4();
          
          // Create demo senior
          const { error: seniorError } = await supabase
            .from('seniors')
            .insert([{
              id: seniorId,
              user_id: userId,
              name: 'Eleanor Vance',
              relationship: 'Mother'
            }]);

          if (!seniorError) {
            // Create demo ailments
            await supabase.from('ailments').insert([
              { id: uuidv4(), senior_id: seniorId, name: 'Arthritis', notes: 'Affects hands and knees primarily.' },
              { id: uuidv4(), senior_id: seniorId, name: 'Hypertension', notes: 'Monitored daily.' },
              { id: uuidv4(), senior_id: seniorId, name: 'Type 2 Diabetes', notes: 'Managed with diet and medication.' }
            ]);

            // Create demo medications
            await supabase.from('medications').insert([
              { id: uuidv4(), senior_id: seniorId, name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
              { id: uuidv4(), senior_id: seniorId, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
              { id: uuidv4(), senior_id: seniorId, name: 'Ibuprofen', dosage: '200mg', frequency: 'As needed for pain' }
            ]);

            // Create demo appointments
            await supabase.from('appointments').insert([
              { id: uuidv4(), senior_id: seniorId, date: '2024-08-15', time: '10:00 AM', doctor: 'Dr. Chen', purpose: 'Cardiology Follow-up', location: 'City Heart Clinic' },
              { id: uuidv4(), senior_id: seniorId, date: '2024-09-02', time: '02:30 PM', doctor: 'Dr. Patel', purpose: 'Endocrinology Check-up', location: 'General Hospital' }
            ]);

            // Create demo contacts
            await supabase.from('contacts').insert([
              { id: uuidv4(), senior_id: seniorId, name: 'Dr. Chen (Cardiologist)', type: 'Doctor', phone: '555-0101' },
              { id: uuidv4(), senior_id: seniorId, name: 'Dr. Patel (Endocrinologist)', type: 'Doctor', phone: '555-0102' },
              { id: uuidv4(), senior_id: seniorId, name: 'Main Street Pharmacy', type: 'Pharmacist', phone: '555-0103' },
              { id: uuidv4(), senior_id: seniorId, name: 'Sarah (Neighbor)', type: 'Emergency', phone: '555-0104' }
            ]);
          }
        } catch (demoError) {
          console.error('Demo data creation error:', demoError);
          // Don't fail the login if demo data creation fails
        }
      }
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
