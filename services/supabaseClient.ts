
/**
 * NKELO.OS - Supabase Connectivity Service
 * Centraliza a persistência de dados e autenticação.
 */
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { Database } from '../apps/mobile/src/types/supabase';

const supabaseUrl = 'https://seu-projeto.supabase.co';
const supabaseKey = 'sua-chave-anon-public';

// Cliente tipado para garantir que as operações no DB respeitem o esquema oficial
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const DataService = {
  /**
   * Persiste o progresso do utilizador de forma atómica.
   */
  async saveProgress(userId: string, progress: any) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({ 
          user_id: userId, 
          total_points: progress.totalPoints,
          completed_lessons: progress.completedLessons,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      return { data, success: true };
    } catch (error) {
      console.error('Erro ao guardar progresso no Supabase:', error);
      return { error, success: false };
    }
  },

  /**
   * Obtém o leaderboard global sincronizado.
   */
  async getLeaderboard() {
    try {
      const { data, error } = await supabase
        .from('leaderboard_view')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      return { data, success: true };
    } catch (error) {
      console.error('Erro ao obter leaderboard:', error);
      return { data: [], success: false };
    }
  }
};
