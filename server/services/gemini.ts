import { GoogleGenAI } from "@google/genai";

// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const hasApiKey = !!process.env.GEMINI_API_KEY;
const ai = hasApiKey ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! }) : null;

export interface GapAnalysisResult {
  title: string;
  description: string;
  category: string;
  feasibility: "high" | "medium" | "low";
  marketPotential: "high" | "medium" | "low";
  innovationScore: number;
  marketSize: string;
  gapReason: string;
}

export async function analyzeGaps(query: string): Promise<GapAnalysisResult[]> {
  if (!ai || !hasApiKey) {
    console.log(`Gemini API not configured - would analyze gaps for query: ${query}`);
    // Return demo data for development/testing
    return [
      {
        title: "Demo: Smart Meeting Room Optimizer",
        description: "AI-powered system that automatically adjusts room temperature, lighting, and acoustics based on meeting type and participant count. Currently meetings rely on manual adjustments.",
        category: "Tech That's Missing",
        feasibility: "high",
        marketPotential: "medium",
        innovationScore: 7,
        marketSize: "$450M",
        gapReason: "IoT integration complexity and lack of standardized building management systems"
      }
    ];
  }

  const systemPrompt = `You are an expert innovation analyst and market researcher who identifies market gaps and untapped opportunities. Always respond with valid JSON in the exact format specified.`;

  const prompt = `Analyze the query "${query}" and identify 5-8 gaps in existing solutions - things that don't exist yet but should exist.

For each gap, provide:
1. A compelling title for the missing solution
2. A detailed description of what it would do
3. Category: one of "Tech That's Missing", "Services That Don't Exist", "Products Nobody's Made", "Business Models"
4. Feasibility: "high", "medium", or "low" based on current technology and resources
5. Market potential: "high", "medium", or "low" based on demand and addressable market
6. Innovation score: 1-10 (10 being most innovative)
7. Market size: estimated market size with currency (e.g., "$2.3B", "$890M")
8. Gap reason: why this gap exists and what prevents it from being created currently

Focus on realistic, actionable gaps that entrepreneurs and innovators could potentially pursue. Avoid science fiction or impossible solutions.

Return the results as a JSON object with the exact structure:
{
  "gaps": [
    {
      "title": "string",
      "description": "string", 
      "category": "string",
      "feasibility": "string",
      "marketPotential": "string",
      "innovationScore": number,
      "marketSize": "string",
      "gapReason": "string"
    }
  ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            gaps: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  category: { type: "string" },
                  feasibility: { type: "string" },
                  marketPotential: { type: "string" },
                  innovationScore: { type: "number" },
                  marketSize: { type: "string" },
                  gapReason: { type: "string" }
                },
                required: ["title", "description", "category", "feasibility", "marketPotential", "innovationScore", "marketSize", "gapReason"]
              }
            }
          },
          required: ["gaps"]
        }
      },
      contents: prompt,
    });

    const rawJson = response.text;
    
    if (rawJson) {
      const result = JSON.parse(rawJson);
      return result.gaps || [];
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to analyze gaps: ' + (error as Error).message);
  }
}
