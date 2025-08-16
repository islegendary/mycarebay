import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { seniorId, userId } = req.query;

    if (!seniorId || !userId) {
      return res.status(400).json({ error: 'Senior ID and User ID are required' });
    }

    // Verify the senior belongs to the user
    const { data: senior, error: fetchError } = await supabase
      .from('seniors')
      .select('*')
      .eq('id', seniorId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !senior) {
      return res.status(404).json({ error: 'Senior not found or access denied' });
    }

    // Delete related data first (due to foreign key constraints)
    await supabase.from('ailments').delete().eq('senior_id', seniorId);
    await supabase.from('medications').delete().eq('senior_id', seniorId);
    await supabase.from('appointments').delete().eq('senior_id', seniorId);
    await supabase.from('contacts').delete().eq('senior_id', seniorId);

    // Delete the senior
    const { error: deleteError } = await supabase
      .from('seniors')
      .delete()
      .eq('id', seniorId);

    if (deleteError) {
      return res.status(500).json({ error: 'Failed to delete senior' });
    }

    res.status(200).json({
      success: true,
      message: 'Senior deleted successfully'
    });

  } catch (error) {
    console.error('Delete senior error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
