export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      buyer_profiles: {
        Row: {
          address: string
          business_registration_no: string | null
          buyer_type: string
          buying_interests: string[] | null
          company_type: string | null
          contact_person_name: string
          created_at: string
          email: string
          gst_number: string | null
          id: string
          location: string
          phone_primary: string
          phone_secondary: string | null
          profile_id: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          address: string
          business_registration_no?: string | null
          buyer_type: string
          buying_interests?: string[] | null
          company_type?: string | null
          contact_person_name: string
          created_at?: string
          email: string
          gst_number?: string | null
          id?: string
          location: string
          phone_primary: string
          phone_secondary?: string | null
          profile_id: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          address?: string
          business_registration_no?: string | null
          buyer_type?: string
          buying_interests?: string[] | null
          company_type?: string | null
          contact_person_name?: string
          created_at?: string
          email?: string
          gst_number?: string | null
          id?: string
          location?: string
          phone_primary?: string
          phone_secondary?: string | null
          profile_id?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      farmer_profiles: {
        Row: {
          annual_production_tons: number | null
          certifications: string[] | null
          created_at: string
          district: string | null
          equipment_owned: string[] | null
          experience_years: number | null
          farm_size_acres: number | null
          farming_methods: string[] | null
          id: string
          irrigation_type: string | null
          preferred_market_channels: string[] | null
          primary_crops: string[] | null
          profile_id: string
          region: string | null
          secondary_crops: string[] | null
          soil_type: string | null
          state: string | null
          storage_capacity_tons: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_production_tons?: number | null
          certifications?: string[] | null
          created_at?: string
          district?: string | null
          equipment_owned?: string[] | null
          experience_years?: number | null
          farm_size_acres?: number | null
          farming_methods?: string[] | null
          id?: string
          irrigation_type?: string | null
          preferred_market_channels?: string[] | null
          primary_crops?: string[] | null
          profile_id: string
          region?: string | null
          secondary_crops?: string[] | null
          soil_type?: string | null
          state?: string | null
          storage_capacity_tons?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_production_tons?: number | null
          certifications?: string[] | null
          created_at?: string
          district?: string | null
          equipment_owned?: string[] | null
          experience_years?: number | null
          farm_size_acres?: number | null
          farming_methods?: string[] | null
          id?: string
          irrigation_type?: string | null
          preferred_market_channels?: string[] | null
          primary_crops?: string[] | null
          profile_id?: string
          region?: string | null
          secondary_crops?: string[] | null
          soil_type?: string | null
          state?: string | null
          storage_capacity_tons?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "farmer_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      logistics_profiles: {
        Row: {
          address: string
          business_registration_licence: string
          company_name: string
          contact_person: string
          created_at: string
          email: string
          fleet_details: Json | null
          id: string
          location: string
          operating_hours: string | null
          phone_primary: string
          phone_secondary: string | null
          profile_id: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          address: string
          business_registration_licence: string
          company_name: string
          contact_person: string
          created_at?: string
          email: string
          fleet_details?: Json | null
          id?: string
          location: string
          operating_hours?: string | null
          phone_primary: string
          phone_secondary?: string | null
          profile_id: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          address?: string
          business_registration_licence?: string
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          fleet_details?: Json | null
          id?: string
          location?: string
          operating_hours?: string | null
          phone_primary?: string
          phone_secondary?: string | null
          profile_id?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          order_type: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          order_type: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          order_type?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          location: string | null
          metadata: Json | null
          phone: string | null
          portal_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          phone?: string | null
          portal_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          phone?: string | null
          portal_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
