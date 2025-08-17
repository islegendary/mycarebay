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
}
