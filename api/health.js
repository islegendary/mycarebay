export default async function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: {
      supabaseUrl: process.env.SUPABASE_URL ? 'Set' : 'Missing',
      supabaseKey: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Missing',
      geminiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Missing'
    }
  });
}
