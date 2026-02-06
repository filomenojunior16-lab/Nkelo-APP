
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          xp_total: number
          name: string
          updated_at: string
        }
        Insert: {
          id: string
          xp_total?: number
          name: string
          updated_at?: string
        }
        Update: {
          id?: string
          xp_total?: number
          name?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          user_id: string
          total_points: number
          completed_lessons: string[]
          updated_at: string
          time_spent: number | null
        }
        Insert: {
          user_id: string
          total_points?: number
          completed_lessons?: string[]
          updated_at?: string
          time_spent?: number | null
        }
        Update: {
          user_id?: string
          total_points?: number
          completed_lessons?: string[]
          updated_at?: string
          time_spent?: number | null
        }
      }
    }
    Views: {
      leaderboard_view: {
        Row: {
          user_id: string
          name: string
          total_points: number
          rank: number
        }
      }
    }
    Functions: {
      increment_xp: {
        Args: {
          user_id: string
          xp_amount: number
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
