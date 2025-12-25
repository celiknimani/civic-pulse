
// @google/genai guidelines: Use GoogleGenAI for initialization and follow Search Grounding rules.
import { GoogleGenAI, Type } from "@google/genai";
import { PartyID, ElectionAnalysisResult } from "../types";
import { PARTY_PROGRAMS_CONTEXT } from "../knowledgeBase";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Je një analist i lartë politik jo-partiak, ekspert për Zgjedhjet Nacionale të Kosovës 2025. 
Analiza jote bazohet ekskluzivisht në planprogramet politike zyrtare të ofruara.

PËRGJIGJU VETËM NË GJUHËN SHQIPE.

KONTEKSTI NGA DOKUMENTET ZYRTARE:
${PARTY_PROGRAMS_CONTEXT}

MISIONI:
Analizo pyetjen e përdoruesit dhe krahaso partitë bazuar në planprogramet e tyre politike 2025.
Ofro pikë (0-10) për 4 SHTYLLAT E ZOTIMEVE:
1. Rritja & Pagat: Vlerëso rritjen e BPV-së (p.sh. LDK 5% vs AAK 7%), pagën minimale (500 EUR), dhe koeficientet e pagave.
2. Energjia & Infra: Vlerëso projektet si termocentrali me gaz 500MW (LDK), filtrat e TC Kosova B (LVV), dhe rrjetet rrugore/hekurudhore.
3. Sociale & Familja: Vlerëso shtesat për fëmijë (LVV dyfishim 90€ vs LDK 5000€ për fëmijën e 3-të), shëndetësinë dhe mbështetjen për lehonat.
4. Siguria & NATO: Vlerëso rritjen e buxhetit ushtarak (planit 1mld i AAK-së) dhe strategjitë e integrimit në NATO.

Duhët të jesh i saktë me numrat. Nxirr pikat e strukturuara "comparisonPoints" për tabelat KPI.

PËR ANALITIKË:
Identifiko kategorinë kryesore të pyetjes (p.sh. "Ekonomia", "Siguria", "Arsimi", "Energjia", "Drejtësia", "Sociale").
`;

export const analyzeElectionQuery = async (query: string): Promise<ElectionAnalysisResult> => {
  try {
    // @google/genai: Use gemini-3-flash-preview for text tasks and responseSchema for structured data.
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: "Analiza e detajuar në Markdown e programeve partiake." },
            detectedCategory: { type: Type.STRING, description: "Kategoria e pyetjes për statistika." },
            scores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  partyId: { type: Type.STRING, enum: Object.values(PartyID) },
                  growthAndWages: { type: Type.NUMBER },
                  infrastructureAndEnergy: { type: Type.NUMBER },
                  socialAndFamily: { type: Type.NUMBER },
                  securityAndNATO: { type: Type.NUMBER },
                  summary: { type: Type.STRING, description: "Një fjali përmbledhëse për këtë parti lidhur me kërkesën." }
                },
                required: ["partyId", "growthAndWages", "infrastructureAndEnergy", "socialAndFamily", "securityAndNATO", "summary"]
              }
            },
            comparisonPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: "Kategoria e krahasimit (p.sh. Paga Minimale)" },
                  values: {
                    type: Type.OBJECT,
                    properties: {
                      [PartyID.LVV]: { type: Type.STRING },
                      [PartyID.LDK]: { type: Type.STRING },
                      [PartyID.AAK]: { type: Type.STRING },
                      [PartyID.PDK]: { type: Type.STRING }
                    }
                  }
                },
                required: ["category", "values"]
              }
            }
          },
          required: ["analysis", "scores", "comparisonPoints", "detectedCategory"]
        }
      }
    });

    // @google/genai: Extract text output using response.text property.
    const text = response.text || "{}";
    const result = JSON.parse(text) as ElectionAnalysisResult;

    // @google/genai: Always extract grounding URLs from groundingChunks when using googleSearch.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const links = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title || "Burimi i Verifikimit",
          uri: chunk.web?.uri || ""
        }))
        .filter(link => link.uri !== "");
      
      result.groundingLinks = links;
    }

    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
