import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { errors } = req.body;

    if (!errors || !Array.isArray(errors)) {
      return res.status(400).json({ error: 'Invalid error data' });
    }

    // Log errors to database
    const { data, error } = await supabase
      .from('error_logs')
      .insert(errors.map(error => ({
        message: error.message,
        stack: error.stack,
        component_stack: error.componentStack,
        timestamp: error.timestamp,
        user_agent: error.userAgent,
        url: error.url,
        user_id: error.userId,
        error_type: error.errorType,
        severity: error.severity
      })));

    if (error) {
      console.error('Failed to log errors to database:', error);
      return res.status(500).json({ error: 'Failed to log errors' });
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Errors logged:', errors);
    }

    res.status(200).json({ success: true, logged: errors.length });
  } catch (error) {
    console.error('Error logging endpoint failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
