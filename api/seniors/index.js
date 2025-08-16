import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

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
    console.log('=== SAVE SENIOR REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { userId, senior } = req.body;

    if (!userId || !senior) {
      console.error('Missing required data:', { userId: !!userId, senior: !!senior });
      return res.status(400).json({ error: 'User ID and senior data are required' });
    }

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const isUpdate = !!senior.id;
    const seniorId = senior.id || uuidv4();
    
    console.log('Save senior request:', { userId, seniorName: senior.name, isUpdate, seniorId });

    // Start a transaction
    const { data: seniorData, error: seniorError } = await supabase
      .from('seniors')
      .upsert({
        id: seniorId,
        user_id: userId,
        name: senior.name,
        relationship: senior.relationship,
        avatar_url: senior.avatar_url,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (seniorError) {
      console.error('Failed to save senior:', seniorError);
      return res.status(500).json({ error: 'Failed to save senior' });
    }
    
    console.log('Senior saved successfully:', seniorData);

    // Handle related data
    if (senior.ailments) {
      // Delete existing ailments if updating
      if (isUpdate) {
        await supabase.from('ailments').delete().eq('senior_id', seniorId);
      }
      
      // Insert new ailments
      if (senior.ailments.length > 0) {
        const ailmentsData = senior.ailments.map(ailment => ({
          id: ailment.id || uuidv4(),
          senior_id: seniorId,
          name: ailment.name,
          notes: ailment.notes
        }));
        
        await supabase.from('ailments').insert(ailmentsData);
      }
    }

    if (senior.medications) {
      if (isUpdate) {
        await supabase.from('medications').delete().eq('senior_id', seniorId);
      }
      
      if (senior.medications.length > 0) {
        const medicationsData = senior.medications.map(med => ({
          id: med.id || uuidv4(),
          senior_id: seniorId,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency
        }));
        
        await supabase.from('medications').insert(medicationsData);
      }
    }

    if (senior.appointments) {
      if (isUpdate) {
        await supabase.from('appointments').delete().eq('senior_id', seniorId);
      }
      
      if (senior.appointments.length > 0) {
        const appointmentsData = senior.appointments.map(appt => ({
          id: appt.id || uuidv4(),
          senior_id: seniorId,
          date: appt.date,
          time: appt.time,
          doctor: appt.doctor,
          purpose: appt.purpose,
          location: appt.location
        }));
        
        await supabase.from('appointments').insert(appointmentsData);
      }
    }

    if (senior.contacts) {
      if (isUpdate) {
        await supabase.from('contacts').delete().eq('senior_id', seniorId);
      }
      
      if (senior.contacts.length > 0) {
        const contactsData = senior.contacts.map(contact => ({
          id: contact.id || uuidv4(),
          senior_id: seniorId,
          name: contact.name,
          type: contact.type,
          phone: contact.phone,
          email: contact.email
        }));
        
        await supabase.from('contacts').insert(contactsData);
      }
    }

    console.log('=== SAVE SUCCESSFUL ===');
    res.status(200).json({
      success: true,
      seniorId: seniorId,
      message: isUpdate ? 'Senior updated successfully' : 'Senior created successfully'
    });

  } catch (error) {
    console.error('=== SAVE SENIOR ERROR ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
