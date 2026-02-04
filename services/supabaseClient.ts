
/**
 * NKELO.OS - Supabase Connectivity Service
 * Nota: As variáveis de ambiente devem ser configuradas no painel do Supabase.
 */
// @ts-ignore
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://seu-projeto.supabase.co';
const supabaseKey = 'sua-chave-anon-public';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const DataService = {
  async saveProgress(userId: string, progress: any) {
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({ user_id: userId, ...progress });
    return { data, error };
  },

  async getLeaderboard() {
    const { data, error } = await supabase
      .from('user_progress')
      .select('users(name), total_points')
      .order('total_points', { ascending: false })
      .limit(10);
    return { data, error };
  }
};
