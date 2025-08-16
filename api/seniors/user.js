import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Debug logging for environment variables
console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { userId } = req.query;
    console.log('Fetching seniors for userId:', userId);

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get seniors for the user
    const { data: seniors, error: seniorsError } = await supabase
      .from('seniors')
      .select('*')
      .eq('user_id', userId);

    if (seniorsError) {
      return res.status(500).json({ error: 'Failed to fetch seniors' });
    }

    // For each senior, get their related data
    const seniorsWithData = await Promise.all(
      seniors.map(async (senior) => {
        // Get ailments
        const { data: ailments } = await supabase
          .from('ailments')
          .select('*')
          .eq('senior_id', senior.id);

        // Get medications
        const { data: medications } = await supabase
          .from('medications')
          .select('*')
          .eq('senior_id', senior.id);

        // Get appointments
        const { data: appointments } = await supabase
          .from('appointments')
          .select('*')
          .eq('senior_id', senior.id);

        // Get contacts
        const { data: contacts } = await supabase
          .from('contacts')
          .select('*')
          .eq('senior_id', senior.id);

        return {
          ...senior,
          ailments: ailments || [],
          medications: medications || [],
          appointments: appointments || [],
          contacts: contacts || []
        };
      })
    );

    res.status(200).json(seniorsWithData);

  } catch (error) {
    console.error('Get seniors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
