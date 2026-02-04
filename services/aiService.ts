
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { LearningMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const AIService = {
  // IA de Transmutação Adaptativa (Core Pedagógico)
  async transmuteContent(content: string, mode: LearningMode, title: string) {
    try {
      let instruction = "";
      switch (mode) {
        case LearningMode.STORYTELLING:
          instruction = `Transforma este conteúdo numa lição épica contada por um sábio angolano. Usa o título "${title}" como mote. Torna-o uma história de aventura onde o aluno é o herói.`;
          break;
        case LearningMode.PRACTICE:
          instruction = `Converte este conteúdo em 3 passos práticos de "como fazer". Foca em simulação, ação e experimentação imediata para uma criança.`;
          break;
        case LearningMode.TACTICAL:
          instruction = `Resume este conteúdo em tópicos ultra-diretos e técnicos (estilo militar/científico) para um engenheiro de elite.`;
          break;
        default:
          return content;
      }
        
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `${instruction}\n\nTexto original: ${content}`,
      });
      return response.text || content;
    } catch (e) {
      console.error("Erro na transmutação:", e);
      return content;
    }
  },

  async getAdaptiveRecommendation(userHistory: string[], lastScore: number) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analisa este perfil de estudante angolano: Lições Concluídas [${userHistory.join(', ')}]. Score Recente: ${lastScore}%. Recomenda o próximo ModuleType ideal e justifica em uma frase curta.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendedModule: { type: Type.STRING },
              justification: { type: Type.STRING }
            },
            required: ["recommendedModule", "justification"]
          }
        }
      });
      const text = response.text?.trim();
      if (!text) return { recommendedModule: 'LOGIC', justification: 'Continue explorando o sistema.' };
      return JSON.parse(text);
    } catch (e) {
      return { recommendedModule: 'LOGIC', justification: 'Fortalecer o raciocínio base.' };
    }
  },

  async speakLesson(text: string) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Lê este dossiê educacional: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (e) {
      return null;
    }
  },

  async askComplexQuestion(userQuery: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userQuery,
        config: {
          thinkingConfig: { thinkingBudget: 15000 },
          systemInstruction: "És o Mentor Nkelo. Responde como um cientista angolano inspirador. Usa termos tecnológicos e patrióticos.",
        }
      });
      return response.text || "Kernel ocupado.";
    } catch (e) {
      return "Erro de sinal.";
    }
  },

  async exploreLocation(query: string, lat?: number, lng?: number) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Explica a importância de: ${query} para Angola.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
            }
          }
        },
      });
      
      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = chunks
        .filter((c: any) => c.maps && c.maps.uri)
        .map((c: any) => ({
          title: c.maps.title || "Ver no Mapa",
          uri: c.maps.uri
        }));

      return { text, links };
    } catch (e) {
      return { text: "Erro ao acessar radar.", links: [] };
    }
  }
};
