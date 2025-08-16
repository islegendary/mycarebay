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
      const userId = crypto.randomUUID();
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
