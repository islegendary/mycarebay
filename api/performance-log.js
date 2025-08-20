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
    const { componentName, loadTime, timestamp, userAgent, url } = req.body;

    if (!componentName || typeof loadTime !== 'number') {
      return res.status(400).json({ error: 'Invalid performance data' });
    }

    // Log performance metrics to database
    const { data, error } = await supabase
      .from('performance_logs')
      .insert({
        component_name: componentName,
        load_time: loadTime,
        timestamp: timestamp,
        user_agent: userAgent,
        url: url
      });

    if (error) {
      console.error('Failed to log performance to database:', error);
      return res.status(500).json({ error: 'Failed to log performance' });
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance logged: ${componentName} - ${loadTime}ms`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Performance logging endpoint failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
