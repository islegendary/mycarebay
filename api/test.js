import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    console.log('Test endpoint called');
    
    // Test basic Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
      
    if (error) {
      console.error('Supabase connection error:', error);
      return res.status(500).json({ error: 'Supabase connection failed', details: error.message });
    }
    
    // Test UUID generation
    const testId = uuidv4();
    
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      supabaseConnection: 'success',
      testUUID: testId,
      env: {
        supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
        supabaseKey: supabaseKey ? 'Set' : 'Missing'
      }
    });
    
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test failed', details: error.message });
  }
}
