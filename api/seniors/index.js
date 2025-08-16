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
    const { userId, senior } = req.body;

    if (!userId || !senior) {
      return res.status(400).json({ error: 'User ID and senior data are required' });
    }

    const isUpdate = !!senior.id;
    const seniorId = senior.id || crypto.randomUUID();

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
      return res.status(500).json({ error: 'Failed to save senior' });
    }

    // Handle related data
    if (senior.ailments) {
      // Delete existing ailments if updating
      if (isUpdate) {
        await supabase.from('ailments').delete().eq('senior_id', seniorId);
      }
      
      // Insert new ailments
      if (senior.ailments.length > 0) {
        const ailmentsData = senior.ailments.map(ailment => ({
          id: ailment.id || crypto.randomUUID(),
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
          id: med.id || crypto.randomUUID(),
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
          id: appt.id || crypto.randomUUID(),
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
          id: contact.id || crypto.randomUUID(),
          senior_id: seniorId,
          name: contact.name,
          type: contact.type,
          phone: contact.phone,
          email: contact.email
        }));
        
        await supabase.from('contacts').insert(contactsData);
      }
    }

    res.status(200).json({
      success: true,
      seniorId: seniorId,
      message: isUpdate ? 'Senior updated successfully' : 'Senior created successfully'
    });

  } catch (error) {
    console.error('Save senior error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
