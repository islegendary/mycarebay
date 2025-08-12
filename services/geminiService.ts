import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { CareAdvice, GroundingSource, ChecklistResponse } from '../types';

// Ensure the API key is available as an environment variable
const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey });

/**
 * Fetches educational content for a specific medical ailment using the Gemini API.
 * 
 * @param ailmentName The name of the ailment to get information about.
 * @returns A string containing an easy-to-understand explanation of the ailment.
 */
export const getAilmentEducation = async (ailmentName: string): Promise<string> => {
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
export const generateFacilityChecklist = async (topic: string): Promise<ChecklistResponse> => {
    try {
        const systemInstruction = `You are an expert in senior care and geriatrics. A caregiver is preparing to visit a long-term care facility for a loved one with a specific condition. Based on the topic "${topic}", generate a detailed checklist of specific questions they should ask the facility's staff. 

The questions must be categorized into logical sections. Crucially, you must include a category named 'Equipment & Accommodations' that contains questions about necessary medical equipment, specialized support systems (like wander guards for dementia), and environmental accommodations (like handrails or accessible bathrooms) specifically relevant to "${topic}". Other categories could include 'Staff Training & Experience', 'Daily Care & Routines', and 'Emergency Protocols'.

Focus only on questions a caregiver should ask a facility related to the ailment.`;

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

    } catch (error)
 {
        console.error("Error generating facility checklist:", error);
        throw new Error("Sorry, we couldn't generate a checklist at this time. Please try again.");
    }
};