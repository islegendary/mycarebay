import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { CareAdvice, GroundingSource, ChecklistResponse, Senior } from '@/types';

// Ensure the API key is available as an environment variable
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
console.log('API Key available:', !!apiKey);
console.log('API Key length:', apiKey ? apiKey.length : 0);
let ai: GoogleGenAI | null = null;

if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
    console.log('AI client initialized');
} else {
    console.log('No API key found, AI features disabled');
}

/**
 * Fetches educational content for a specific medical ailment using the Gemini API.
 * 
 * @param ailmentName The name of the ailment to get information about.
 * @returns A string containing an easy-to-understand explanation of the ailment.
 */
export const getAilmentEducation = async (ailmentName: string): Promise<string> => {
    if (!ai) {
        return "AI features are not available. Please check your configuration.";
    }

    try {
        const prompt = `
      Provide a simple and easy-to-understand overview for a non-medical caregiver about the following condition: "${ailmentName}".
      Your response should be helpful, reassuring, and clear. 
      Please structure your response into the following sections using markdown headings:
      
      ### What is ${ailmentName}?
      (A brief, simple definition of the condition.)
      
      ### Common Symptoms
      (A bulleted list of common symptoms to watch for.)
      
      ### General Care & Support
      (A bulleted list of general, non-prescription ways to provide comfort and support.)

      **Important Disclaimer:** This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a physician or other qualified health provider with any questions you may have regarding a medical condition.
    `;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;

    } catch (error) {
        console.error("Error fetching ailment education:", error);
        return "Sorry, we couldn't retrieve information at this time. Please check your connection or try again later.";
    }
};

/**
 * Fetches comprehensive advice on senior care topics using Google Search grounding.
 * 
 * @param question The user's question about senior care.
 * @returns An object containing the textual advice and a list of sources.
 */
export const getCareAdvice = async (question: string): Promise<CareAdvice> => {
    console.log('getCareAdvice called with question:', question);
    console.log('AI client available:', !!ai);

    if (!ai) {
        console.log('AI client not available, returning fallback message');
        return {
            text: "AI features are not available. Please check your configuration.",
            sources: []
        };
    }

    try {
        const systemInstruction = `You are an expert AI assistant specializing in senior care. Your goal is to provide clear, empathetic, and actionable advice to family caregivers. When a user asks a question, use the provided search results to formulate a comprehensive answer. If they ask for a list or checklist, format it clearly with markdown. Always cite your sources.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: question,
            config: {
                systemInstruction,
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingSource[] ?? [];

        return { text, sources };

    } catch (error) {
        console.error("Error fetching care advice:", error);
        throw new Error("Sorry, we couldn't retrieve AI-powered advice at this time. Please try again.");
    }
};

/**
 * Generates a checklist of questions for a caregiver to ask a long-term care facility.
 * @param topic The ailment or topic to focus the checklist on (e.g., "Alzheimer's Disease").
 * @returns A structured checklist object.
 */
export const generateFacilityChecklist = async (topic: string, selectedSenior?: Senior | null): Promise<ChecklistResponse> => {
    console.log('generateFacilityChecklist called with topic:', topic);
    console.log('selectedSenior:', selectedSenior);
    console.log('AI client available:', !!ai);

    if (!ai) {
        console.log('AI client not available, returning fallback checklist');
        return {
            checklist: [{
                category: "AI Not Available",
                questions: ["AI features are not available. Please check your configuration."]
            }]
        };
    }

    try {
        // Determine if this is ailment-specific or general
        const hasAilments = selectedSenior?.ailments && selectedSenior.ailments.length > 0;
        const ailmentNames = hasAilments ? selectedSenior.ailments.map(a => a.name).join(', ') : '';
        const seniorName = selectedSenior?.name || 'your loved one';

        let systemInstruction = '';

        if (hasAilments) {
            systemInstruction = `You are an expert in senior care and geriatrics. A caregiver is preparing to visit a long-term care facility for ${seniorName} who has ${ailmentNames}. Generate a detailed checklist of specific questions they should ask the facility's staff.

The questions must be categorized into logical sections. Focus on:
1. 'Equipment & Accommodations' - Questions about necessary medical equipment, specialized support systems, and environmental accommodations specifically for ${ailmentNames}
2. 'Staff Training & Experience' - Questions about staff expertise with ${ailmentNames}
3. 'Daily Care & Routines' - Questions about how the facility handles daily care for someone with ${ailmentNames}
4. 'Emergency Protocols' - Questions about emergency procedures specific to ${ailmentNames}
5. 'Facility Assessment' - Questions to help determine if this facility is the right choice for someone with ${ailmentNames}

Make the questions specific to ${ailmentNames} and focused on determining if the facility can properly care for someone with these conditions.`;
        } else {
            systemInstruction = `You are an expert in senior care and geriatrics. A caregiver is preparing to visit a long-term care facility for general assessment. Generate a detailed checklist of specific questions they should ask the facility's staff.

The questions must be categorized into logical sections. Focus on:
1. 'General Facility Assessment' - Questions about overall facility quality, cleanliness, and atmosphere
2. 'Staff & Care' - Questions about staff ratios, training, and general care practices
3. 'Safety & Security' - Questions about safety protocols, emergency procedures, and security measures
4. 'Activities & Social Life' - Questions about activities, social opportunities, and quality of life
5. 'Medical Care' - Questions about medical staff, medication management, and healthcare coordination
6. 'Costs & Policies' - Questions about pricing, policies, and what's included

Make these general questions that would help assess any long-term care facility.`;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a checklist for the topic: ${topic}`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        checklist: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    category: {
                                        type: Type.STRING,
                                        description: "The name of the question category (e.g., 'Staff Training', 'Equipment & Accommodations')."
                                    },
                                    questions: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.STRING,
                                            description: "A specific question to ask the facility."
                                        }
                                    }
                                },
                                required: ["category", "questions"]
                            }
                        }
                    },
                    required: ["checklist"]
                },
            },
        });

        const jsonText = response.text;
        return JSON.parse(jsonText) as ChecklistResponse;

    } catch (error) {
        console.error("Error generating facility checklist:", error);
        throw new Error("Sorry, we couldn't generate a checklist at this time. Please try again.");
    }
};