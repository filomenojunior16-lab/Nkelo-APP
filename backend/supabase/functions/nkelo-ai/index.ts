
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { GoogleGenAI, Type } from "@google/genai";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Gera um hash SHA-256 para servir como chave de cache única.
 */
async function hashString(str: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { action, payload, prompt, systemInstruction, model: modelName, query, location, userId } = body;
    
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    );

    // --- LOGICA DE CACHE ---
    // Apenas para ações determinísticas como transmute e chat
    const shouldCache = action === 'transmute' || action === 'chat' || !action;
    let promptHash = "";

    if (shouldCache && userId) {
      const contentToHash = action === 'transmute' ? `${userId}-${payload.content}-${payload.mode}` : `${userId}-${prompt}`;
      promptHash = await hashString(contentToHash);

      const { data: cached, error: cacheError } = await supabaseAdmin
        .from('ai_cache')
        .select('response')
        .eq('hash', promptHash)
        .single();

      if (!cacheError && cached?.response) {
        return new Response(
          JSON.stringify({ text: cached.response, cached: true }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // --- PROCESSAMENTO GEMINI ---
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let finalResponseText = "";
    let extraData = {};

    if (action === 'transmute') {
      const { content, mode } = payload;
      const MODE_PROMPTS: Record<string, string> = {
        STORYTELLING: "MODO ANCESTRAL: Usa storytelling angolano, analogias locais e tom de fogueira.",
        PRACTICE: "MODO OFICINA: Explica passo a passo como uma oficina prática Maker.",
        TACTICAL: "MODO SINCRONIA: Briefing direto, frases curtas e objetivas.",
      };

      const systemPrompt = `És o Mentor Nkelo, IA Soberana de Angola. Converte para crianças. Regras: Analogias locais, chama de Aspirante, usa Kwanza (AOA). ${MODE_PROMPTS[mode] ?? MODE_PROMPTS.TACTICAL}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Conteúdo: ${content}`,
        config: { systemInstruction: systemPrompt }
      });
      finalResponseText = response.text || "";
    } else if (action === 'explore') {
      const searchQuery = query || prompt || "Angola";
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Explora: ${searchQuery}`,
        config: {
          systemInstruction: 'Mentor Nkelo. Usa Grounding para precisão factual sobre Angola.',
          tools: [{ googleMaps: {} }, { googleSearch: {} }],
        }
      });
      finalResponseText = response.text || "";

      // Recompensa XP (Não cacheada por ser dinâmica)
      if (userId) {
        await supabaseAdmin.rpc('increment_xp', { user_id: userId, xp_amount: 10 });
        extraData = { rewarded: true };
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      extraData = { 
        ...extraData,
        links: groundingChunks.map((c: any) => c.maps ? {uri: c.maps.uri, title: c.maps.title, type:'map'} : (c.web ? {uri: c.web.uri, title: c.web.title, type:'web'} : null)).filter(Boolean)
      };
    } else if (action === 'recommend') {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Progresso: ${payload.completedLessons.join(',')}`,
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
      return new Response(JSON.stringify({ recommendation: JSON.parse(response.text) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const response = await ai.models.generateContent({
        model: modelName || 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: systemInstruction || 'És o Mentor Nkelo.' }
      });
      finalResponseText = response.text || "";
    }

    // --- SALVAR NO CACHE ---
    if (shouldCache && promptHash && finalResponseText) {
      await supabaseAdmin.from('ai_cache').upsert({
        hash: promptHash,
        response: finalResponseText,
        user_id: userId,
        action_type: action || 'chat'
      });
    }

    return new Response(JSON.stringify({ text: finalResponseText, ...extraData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Erro Nkelo Kernel:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
