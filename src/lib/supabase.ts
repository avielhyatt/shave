import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          phone?: string
          full_name?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string
          full_name?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          phone?: string
          full_name?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          price: number
          category: string
          subcategory?: string
          location: string
          images: string[]
          contact_phone?: string
          contact_email?: string
          is_featured: boolean
          is_sold: boolean
          created_at: string
          updated_at: string
          metadata: any
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          price: number
          category: string
          subcategory?: string
          location: string
          images?: string[]
          contact_phone?: string
          contact_email?: string
          is_featured?: boolean
          is_sold?: boolean
          created_at?: string
          updated_at?: string
          metadata?: any
        }
        Update: {
          title?: string
          description?: string
          price?: number
          category?: string
          subcategory?: string
          location?: string
          images?: string[]
          contact_phone?: string
          contact_email?: string
          is_featured?: boolean
          is_sold?: boolean
          updated_at?: string
          metadata?: any
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          listing_id?: string
          content: string
          created_at: string
          read_at?: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          listing_id?: string
          content: string
          created_at?: string
        }
        Update: {
          read_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          listing_id: string
        }
        Update: never
      }
    }
  }
}