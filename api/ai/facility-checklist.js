import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
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
}
