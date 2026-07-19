export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          client_id: string;
          display_name: string;
          avatar: string;
          color: string;
          xp: number;
          coins: number;
          level: number;
          total_games: number;
          total_truths: number;
          total_dares: number;
          dares_completed: number;
          dares_failed: number;
          achievements: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          display_name?: string;
          avatar?: string;
          color?: string;
          xp?: number;
          coins?: number;
          level?: number;
          total_games?: number;
          total_truths?: number;
          total_dares?: number;
          dares_completed?: number;
          dares_failed?: number;
          achievements?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      rooms: {
        Row: {
          id: string;
          code: string;
          host_client_id: string;
          phase: string;
          mode: string;
          settings: Json;
          game_state: Json;
          is_private: boolean;
          password: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          host_client_id: string;
          phase?: string;
          mode?: string;
          settings?: Json;
          game_state?: Json;
          is_private?: boolean;
          password?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["rooms"]["Insert"]>;
      };
      room_players: {
        Row: {
          id: string;
          room_id: string;
          client_id: string;
          display_name: string;
          avatar: string;
          color: string;
          is_host: boolean;
          is_connected: boolean;
          xp: number;
          coins: number;
          truths_answered: number;
          dares_completed: number;
          dares_failed: number;
          skips: number;
          combo: number;
          max_combo: number;
          payload: Json;
          joined_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          client_id: string;
          display_name: string;
          avatar?: string;
          color?: string;
          is_host?: boolean;
          is_connected?: boolean;
          xp?: number;
          coins?: number;
          truths_answered?: number;
          dares_completed?: number;
          dares_failed?: number;
          skips?: number;
          combo?: number;
          max_combo?: number;
          payload?: Json;
          joined_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["room_players"]["Insert"]>;
      };
      chat_messages: {
        Row: {
          id: string;
          room_id: string;
          client_id: string;
          display_name: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          client_id: string;
          display_name: string;
          body: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
      };
      leaderboard_entries: {
        Row: {
          id: string;
          client_id: string;
          display_name: string;
          avatar: string;
          mode: string | null;
          xp_earned: number;
          dares_completed: number;
          truths_answered: number;
          is_mvp: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          display_name: string;
          avatar?: string;
          mode?: string | null;
          xp_earned?: number;
          dares_completed?: number;
          truths_answered?: number;
          is_mvp?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leaderboard_entries"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];
export type RoomPlayerRow = Database["public"]["Tables"]["room_players"]["Row"];
export type ChatMessageRow = Database["public"]["Tables"]["chat_messages"]["Row"];
export type LeaderboardRow = Database["public"]["Tables"]["leaderboard_entries"]["Row"];
