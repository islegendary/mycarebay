import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Connected to Supabase');

// API Routes

// Get seniors for a user (matches Vercel route)
app.get('/api/seniors/user', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Get seniors
    const { data: seniors, error: seniorsError } = await supabase
      .from('seniors')
      .select('*')
      .eq('user_id', userId);

    if (seniorsError) {
      console.error('Error fetching seniors:', seniorsError);
      return res.status(500).json({ error: 'Failed to fetch seniors' });
    }

    if (!seniors || seniors.length === 0) {
      return res.json([]);
    }

    const seniorIds = seniors.map(s => s.id);

    // Get related data
    const [ailmentsResult, medicationsResult, appointmentsResult, contactsResult] = await Promise.all([
      supabase.from('ailments').select('*').in('senior_id', seniorIds),
      supabase.from('medications').select('*').in('senior_id', seniorIds),
      supabase.from('appointments').select('*').in('senior_id', seniorIds),
      supabase.from('contacts').select('*').in('senior_id', seniorIds)
    ]);

    const ailments = ailmentsResult.data || [];
    const medications = medicationsResult.data || [];
    const appointments = appointmentsResult.data || [];
    const contacts = contactsResult.data || [];

    // Group related data by senior
    const ailmentsBySenior = {};
    const medicationsBySenior = {};
    const appointmentsBySenior = {};
    const contactsBySenior = {};

    ailments.forEach(ailment => {
      if (!ailmentsBySenior[ailment.senior_id]) {
        ailmentsBySenior[ailment.senior_id] = [];
      }
      ailmentsBySenior[ailment.senior_id].push(ailment);
    });

    medications.forEach(med => {
      if (!medicationsBySenior[med.senior_id]) {
        medicationsBySenior[med.senior_id] = [];
      }
      medicationsBySenior[med.senior_id].push(med);
    });

    appointments.forEach(appt => {
      if (!appointmentsBySenior[appt.senior_id]) {
        appointmentsBySenior[appt.senior_id] = [];
      }
      appointmentsBySenior[appt.senior_id].push(appt);
    });

    contacts.forEach(contact => {
      if (!contactsBySenior[contact.senior_id]) {
        contactsBySenior[contact.senior_id] = [];
      }
      contactsBySenior[contact.senior_id].push(contact);
    });

    // Combine all data
    const result = seniors.map(senior => ({
      ...senior,
      ailments: ailmentsBySenior[senior.id] || [],
      medications: medicationsBySenior[senior.id] || [],
      appointments: appointmentsBySenior[senior.id] || [],
      contacts: contactsBySenior[senior.id] || []
    }));

    res.json(result);
  } catch (error) {
    console.error('Error in getSeniors:', error);
    res.status(500).json({ error: 'Failed to fetch seniors' });
  }
});

// Create or update a senior
app.post('/api/seniors', async (req, res) => {
  const { userId, senior } = req.body;
  
  if (!userId || !senior.name || !senior.relationship) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isUpdate = senior.id && senior.id !== 'new' && senior.id !== '';
  const seniorId = isUpdate ? senior.id : uuidv4();

  try {
    if (isUpdate) {
      // Update existing senior
      const { error: updateError } = await supabase
        .from('seniors')
        .update({
          name: senior.name,
          relationship: senior.relationship,
          updated_at: new Date().toISOString()
        })
        .eq('id', seniorId)
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating senior:', updateError);
        return res.status(500).json({ error: 'Failed to update senior' });
      }

      // Clear existing related data
      await Promise.all([
        supabase.from('ailments').delete().eq('senior_id', seniorId),
        supabase.from('medications').delete().eq('senior_id', seniorId),
        supabase.from('appointments').delete().eq('senior_id', seniorId),
        supabase.from('contacts').delete().eq('senior_id', seniorId)
      ]);
    } else {
      // Create new senior
      const { error: insertError } = await supabase
        .from('seniors')
        .insert({
          id: seniorId,
          user_id: userId,
          name: senior.name,
          relationship: senior.relationship
        });

      if (insertError) {
        console.error('Error creating senior:', insertError);
        return res.status(500).json({ error: 'Failed to create senior' });
      }
    }

    // Insert related data
    const insertPromises = [];

    if (senior.ailments && senior.ailments.length > 0) {
      const ailmentsData = senior.ailments.map(ailment => ({
        id: uuidv4(),
        senior_id: seniorId,
        name: ailment.name,
        notes: ailment.notes || ''
      }));
      insertPromises.push(supabase.from('ailments').insert(ailmentsData));
    }

    if (senior.medications && senior.medications.length > 0) {
      const medicationsData = senior.medications.map(med => ({
        id: uuidv4(),
        senior_id: seniorId,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency || ''
      }));
      insertPromises.push(supabase.from('medications').insert(medicationsData));
    }

    if (senior.appointments && senior.appointments.length > 0) {
      const appointmentsData = senior.appointments.map(appt => ({
        id: uuidv4(),
        senior_id: seniorId,
        date: appt.date,
        time: appt.time || '',
        doctor: appt.doctor,
        purpose: appt.purpose || '',
        location: appt.location || ''
      }));
      insertPromises.push(supabase.from('appointments').insert(appointmentsData));
    }

    if (senior.contacts && senior.contacts.length > 0) {
      const contactsData = senior.contacts.map(contact => ({
        id: uuidv4(),
        senior_id: seniorId,
        name: contact.name,
        type: contact.type,
        phone: contact.phone,
        email: contact.email || ''
      }));
      insertPromises.push(supabase.from('contacts').insert(contactsData));
    }

    if (insertPromises.length > 0) {
      const results = await Promise.all(insertPromises);
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        console.error('Error inserting related data:', errors);
        return res.status(500).json({ error: 'Failed to save related data' });
      }
    }
    
    res.json({ 
      success: true, 
      seniorId,
      message: isUpdate ? 'Senior updated successfully' : 'Senior created successfully'
    });

  } catch (error) {
    console.error('Error in saveSenior:', error);
    res.status(500).json({ error: 'Failed to save senior' });
  }
});

// Delete a senior (matches Vercel route) - MUST come before /:seniorId route
app.delete('/api/seniors/delete', async (req, res) => {
  const { seniorId, userId } = req.query;

  if (!seniorId || !userId) {
    return res.status(400).json({ error: 'Senior ID and User ID are required' });
  }

  try {
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
    await Promise.all([
      supabase.from('ailments').delete().eq('senior_id', seniorId),
      supabase.from('medications').delete().eq('senior_id', seniorId),
      supabase.from('appointments').delete().eq('senior_id', seniorId),
      supabase.from('contacts').delete().eq('senior_id', seniorId)
    ]);

    // Delete the senior
    const { data, error } = await supabase
      .from('seniors')
      .delete()
      .eq('id', seniorId);

    if (error) {
      console.error('Error deleting senior:', error);
      return res.status(500).json({ error: 'Failed to delete senior' });
    }

    res.json({ success: true, message: 'Senior deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSenior:', error);
    res.status(500).json({ error: 'Failed to delete senior' });
  }
});

// Delete a senior (generic route)
app.delete('/api/seniors/:seniorId', async (req, res) => {
  const { seniorId } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  try {
    // Delete related data first (due to foreign key constraints)
    await Promise.all([
      supabase.from('ailments').delete().eq('senior_id', seniorId),
      supabase.from('medications').delete().eq('senior_id', seniorId),
      supabase.from('appointments').delete().eq('senior_id', seniorId),
      supabase.from('contacts').delete().eq('senior_id', seniorId)
    ]);

    // Delete the senior
    const { error, count } = await supabase
      .from('seniors')
      .delete()
      .eq('id', seniorId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting senior:', error);
      return res.status(500).json({ error: 'Failed to delete senior' });
    }

    if (count === 0) {
      return res.status(404).json({ error: 'Senior not found' });
    }

    res.json({ success: true, message: 'Senior deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSenior:', error);
    res.status(500).json({ error: 'Failed to delete senior' });
  }
});

// User authentication routes
app.post('/api/auth/login', async (req, res) => {
  const { email, name, plan } = req.body;
  
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  try {
    // Check if user exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking user:', selectError);
      return res.status(500).json({ error: 'Authentication failed' });
    }

    if (existingUser) {
      // User exists, return existing user
      res.json(existingUser);
    } else {
      // Create new user
      const userId = uuidv4();
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email,
          name,
          plan: plan || 'free'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return res.status(500).json({ error: 'Failed to create user' });
      }
      
      res.json(newUser);
    }
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// AI Endpoints
app.post('/api/ai/care-advice', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const { seniorProfile, question } = req.body;
    
    if (!seniorProfile || !question) {
      return res.status(400).json({ error: 'Missing seniorProfile or question' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a knowledgeable senior care advisor. Please provide personalized care advice based on the following information:

Senior Profile:
- Name: ${seniorProfile.name}
- Age: ${seniorProfile.age}
- Ailments: ${seniorProfile.ailments ? seniorProfile.ailments.join(', ') : 'None specified'}
- Medications: ${seniorProfile.medications ? seniorProfile.medications.join(', ') : 'None specified'}
- Care Level: ${seniorProfile.care_level || 'Not specified'}
- Mobility Level: ${seniorProfile.mobility_level || 'Not specified'}
- Dietary Restrictions: ${seniorProfile.dietary_restrictions ? seniorProfile.dietary_restrictions.join(', ') : 'None specified'}
- Additional Notes: ${seniorProfile.notes || 'None'}

Question: ${question}

Please provide practical, actionable advice that considers their specific health conditions and circumstances. Format your response in clear, easy-to-read sections.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const advice = response.text();

    res.status(200).json({ advice });
  } catch (error) {
    console.error('Error generating care advice:', error);
    res.status(500).json({ error: 'Failed to generate care advice' });
  }
});

app.post('/api/ai/facility-checklist', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const { seniorProfile } = req.body;
    
    if (!seniorProfile) {
      return res.status(400).json({ error: 'Missing seniorProfile' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const ailments = seniorProfile.ailments || [];
    const medications = seniorProfile.medications || [];
    const careLevel = seniorProfile.care_level || 'unknown';
    const mobilityLevel = seniorProfile.mobility_level || 'unknown';

    const prompt = `Generate a comprehensive facility inspection checklist for evaluating senior care facilities for ${seniorProfile.name}.

Senior Profile Details:
- Age: ${seniorProfile.age}
- Health Conditions: ${ailments.length > 0 ? ailments.join(', ') : 'None specified'}
- Current Medications: ${medications.length > 0 ? medications.join(', ') : 'None specified'}
- Care Level Needed: ${careLevel}
- Mobility Level: ${mobilityLevel}
- Special Dietary Needs: ${seniorProfile.dietary_restrictions ? seniorProfile.dietary_restrictions.join(', ') : 'None'}

Create a detailed checklist organized by categories that addresses their specific needs. Include:

1. **Medical Care & Health Services**
2. **Safety & Accessibility** 
3. **Staff Qualifications & Ratios**
4. **Living Environment & Amenities**
5. **Nutrition & Dining**
6. **Activities & Social Programs**
7. **Emergency Procedures**

For each category, provide 5-8 specific questions or items to check, tailored to the senior's health conditions and needs. Format as a clear, printable checklist with checkboxes.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const checklist = response.text();

    res.status(200).json({ checklist });
  } catch (error) {
    console.error('Error generating facility checklist:', error);
    res.status(500).json({ error: 'Failed to generate facility checklist' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});
