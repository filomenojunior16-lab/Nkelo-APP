
import { LearningMode } from "@nkelo/shared";

/**
 * NKELO.OS Secure AI Service v4.3
 * Gateway central para processamento neural via Supabase Edge Functions.
 */

const SUPABASE_URL = 'https://seu-projeto.supabase.co'; 
const SUPABASE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/nkelo-ai`;

export const AIService = {
  /**
   * Adapta o conteúdo educativo para diferentes modos cognitivos.
   */
  async transmuteContent(content: string, mode: LearningMode, title: string, lessonId: string): Promise<string> {
    const cacheKey = `nkelo_cache_${lessonId}_${mode}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transmute',
          model: 'gemini-3-flash-preview',
          payload: { content, mode, title },
          systemInstruction: `És o Mentor Nkelo. Transmuta o conteúdo para o modo ${mode}.`
        })
      });

      const data = await response.json();
      const result = data.text || content;
      localStorage.setItem(cacheKey, result);
      return result;
    } catch (error) {
      return content;
    }
  },

  /**
   * Consulta complexa ao Mentor Nkelo.
   */
  async askComplexQuestion(prompt: string): Promise<string> {
    try {
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          model: 'gemini-3-pro-preview',
          prompt,
          systemInstruction: 'Mentor Nkelo: Sábio angolano.'
        })
      });
      const data = await response.json();
      return data.text || "Erro na sincronia neural.";
    } catch (error) {
      return "Sistemas offline.";
    }
  },

  /**
   * IA Adaptativa para recomendação de módulos.
   */
  async getAdaptiveRecommendation(completedLessons: string[], score: number): Promise<{recommendedModule: string, justification: string}> {
    try {
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'recommend',
          payload: { completedLessons, score }
        })
      });
      const data = await response.json();
      return data.recommendation || { recommendedModule: 'CIVICS', justification: 'Foca na cidadania.' };
    } catch (error) {
      return { recommendedModule: 'CIVICS', justification: 'O sistema sugere reforçar a base.' };
    }
  },

  /**
   * Radar de Exploração com Grounding e Sistema de Recompensa.
   */
  async exploreLocation(query: string, userId: string, lat?: number, lng?: number): Promise<{text: string, links: any[], rewarded: boolean}> {
    try {
      const response = await fetch(SUPABASE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'explore',
          query,
          userId,
          location: lat && lng ? { latitude: lat, longitude: lng } : undefined
        })
      });
      const data = await response.json();
      return { 
        text: data.text, 
        links: data.links || [], 
        rewarded: data.rewarded || false 
      };
    } catch (error) {
      return { text: "Erro ao triangular coordenadas.", links: [], rewarded: false };
    }
  }
};
