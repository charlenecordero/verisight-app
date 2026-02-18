
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeMedia = async (
  base64Data: string,
  mimeType: string,
  mediaType: 'image' | 'video' | 'audio'
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  let specificInstructions = "";
  
  if (mediaType === 'audio') {
    specificInstructions = `
      Perform a forensic audio analysis. Look for:
      - Neural grain or metallic "ringing" in vocals.
      - Spectral gaps or unnatural frequency cutoffs.
      - Robotic phrasing or lack of natural breath/performance micro-variations.
      - Phase inconsistencies in stereo imaging characteristic of early AI audio models.
    `;
  } else if (mediaType === 'image') {
    specificInstructions = `
      Perform deep artistic forensics. Distinguish between human-made digital/traditional art and AI generation. Look for:
      - "Neural brush strokes" (procedural patterns that mimic art but lack intent).
      - Inconsistent light sources on complex jewelry or fabric.
      - Layering errors in digital art (background bleeding into foreground).
      - Procedural gradients that look too mathematically perfect.
    `;
  } else {
    specificInstructions = `
      Standard video forensic analysis. Check for temporal flickering, frame-to-frame consistency, and motion blur artifacts.
    `;
  }

  const prompt = `
    Perform a high-level forensic analysis of this ${mediaType} to determine if it is AI-generated or authentic.
    ${specificInstructions}
    
    Provide a structured JSON response evaluating the likelihood of it being AI-generated.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data.split(',')[1],
            },
          },
          { text: prompt },
        ],
      },
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isAiGenerated: { type: Type.BOOLEAN },
            confidenceScore: { type: Type.NUMBER, description: "Confidence score from 0 to 100" },
            summary: { type: Type.STRING },
            verdict: { 
              type: Type.STRING, 
              enum: ["REAL", "AI_GENERATED", "UNCERTAIN"] 
            },
            artifacts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
                },
                required: ["title", "description", "severity"]
              }
            }
          },
          required: ["isAiGenerated", "confidenceScore", "summary", "verdict", "artifacts"]
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw new Error("Failed to analyze the media. Please try again.");
  }
};
