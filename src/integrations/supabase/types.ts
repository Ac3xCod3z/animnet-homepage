export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      code_redemptions: {
        Row: {
          code_id: string
          id: string
          redeemed_at: string
          season: number | null
          wallet_address: string
        }
        Insert: {
          code_id: string
          id?: string
          redeemed_at?: string
          season?: number | null
          wallet_address: string
        }
        Update: {
          code_id?: string
          id?: string
          redeemed_at?: string
          season?: number | null
          wallet_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "code_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "redemption_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      device_fingerprints: {
        Row: {
          created_at: string | null
          fingerprint_hash: string
          id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          fingerprint_hash: string
          id?: string
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          fingerprint_hash?: string
          id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      game_scores: {
        Row: {
          created_at: string | null
          id: string
          score: number
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          score: number
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          id?: string
          score?: number
          wallet_address?: string
        }
        Relationships: []
      }
      ip_tracking: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          id: string
          ip_address: string
          last_attempt: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          id?: string
          ip_address: string
          last_attempt?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          id?: string
          ip_address?: string
          last_attempt?: string | null
        }
        Relationships: []
      }
      redemption_codes: {
        Row: {
          code: string
          cooldown_period: unknown | null
          created_at: string
          id: string
          max_redemptions: number
          season: number | null
          total_redemptions: number
          updated_at: string
        }
        Insert: {
          code: string
          cooldown_period?: unknown | null
          created_at?: string
          id?: string
          max_redemptions?: number
          season?: number | null
          total_redemptions?: number
          updated_at?: string
        }
        Update: {
          code?: string
          cooldown_period?: unknown | null
          created_at?: string
          id?: string
          max_redemptions?: number
          season?: number | null
          total_redemptions?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_redeem_code:
        | {
            Args: {
              p_code: string
              p_user_id: string
              p_wallet_address: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_code: string
              p_wallet_address: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_code: string
              p_wallet_address: string
              p_ip_address: string
              p_fingerprint: string
              p_game_score: number
              p_recaptcha_token: string
            }
            Returns: Json
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
