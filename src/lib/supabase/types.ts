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
      News: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string
          content: string
          image: string | null
          category: string
          featured: boolean
          published: boolean
          author: string | null
          views: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary: string
          content: string
          image?: string | null
          category: string
          featured?: boolean
          published?: boolean
          author?: string | null
          views?: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string
          content?: string
          image?: string | null
          category?: string
          featured?: boolean
          published?: boolean
          author?: string | null
          views?: number
          createdAt?: string
          updatedAt?: string
        }
      }
      Leader: {
        Row: {
          id: string
          name: string
          slug: string
          role: string
          province: string | null
          bio: string
          photo: string | null
          proposals: string | null
          socialFacebook: string | null
          socialTwitter: string | null
          socialInstagram: string | null
          socialLinkedin: string | null
          order: number
          active: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          role: string
          province?: string | null
          bio: string
          photo?: string | null
          proposals?: string | null
          socialFacebook?: string | null
          socialTwitter?: string | null
          socialInstagram?: string | null
          socialLinkedin?: string | null
          order?: number
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          role?: string
          province?: string | null
          bio?: string
          photo?: string | null
          proposals?: string | null
          socialFacebook?: string | null
          socialTwitter?: string | null
          socialInstagram?: string | null
          socialLinkedin?: string | null
          order?: number
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      Event: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          location: string
          province: string
          date: string
          time: string | null
          image: string | null
          type: string
          status: string
          attendees: number
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          location: string
          province: string
          date: string
          time?: string | null
          image?: string | null
          type: string
          status?: string
          attendees?: number
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          location?: string
          province?: string
          date?: string
          time?: string | null
          image?: string | null
          type?: string
          status?: string
          attendees?: number
          createdAt?: string
          updatedAt?: string
        }
      }
      EventLeader: {
        Row: {
          eventId: string
          leaderId: string
        }
        Insert: {
          eventId: string
          leaderId: string
        }
        Update: {
          eventId?: string
          leaderId?: string
        }
      }
      EventConfirmation: {
        Row: {
          id: string
          eventId: string
          name: string
          email: string | null
          phone: string | null
          createdAt: string
        }
        Insert: {
          id?: string
          eventId: string
          name: string
          email?: string | null
          phone?: string | null
          createdAt?: string
        }
        Update: {
          id?: string
          eventId?: string
          name?: string
          email?: string | null
          phone?: string | null
          createdAt?: string
        }
      }
      GovernmentProgram: {
        Row: {
          id: string
          title: string
          slug: string
          area: string
          summary: string
          content: string
          icon: string | null
          order: number
          active: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          area: string
          summary: string
          content: string
          icon?: string | null
          order?: number
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          area?: string
          summary?: string
          content?: string
          icon?: string | null
          order?: number
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      Volunteer: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          province: string
          municipality: string | null
          availability: string | null
          interests: string | null
          experience: string | null
          isFiscal: boolean
          status: string
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          province: string
          municipality?: string | null
          availability?: string | null
          interests?: string | null
          experience?: string | null
          isFiscal?: boolean
          status?: string
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          province?: string
          municipality?: string | null
          availability?: string | null
          interests?: string | null
          experience?: string | null
          isFiscal?: boolean
          status?: string
          createdAt?: string
          updatedAt?: string
        }
      }
      Complaint: {
        Row: {
          id: string
          type: string
          name: string | null
          email: string | null
          phone: string | null
          province: string | null
          subject: string
          message: string
          anonymous: boolean
          status: string
          response: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          type: string
          name?: string | null
          email?: string | null
          phone?: string | null
          province?: string | null
          subject: string
          message: string
          anonymous?: boolean
          status?: string
          response?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          type?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          province?: string | null
          subject?: string
          message?: string
          anonymous?: boolean
          status?: string
          response?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      KitItem: {
        Row: {
          id: string
          title: string
          description: string
          type: string
          fileUrl: string
          thumbnail: string | null
          downloads: number
          active: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: string
          fileUrl: string
          thumbnail?: string | null
          downloads?: number
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: string
          fileUrl?: string
          thumbnail?: string | null
          downloads?: number
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      ElectionResult: {
        Row: {
          id: string
          province: string
          municipality: string | null
          votes: number
          percentage: number
          source: string
          updatedAt: string
          createdAt: string
        }
        Insert: {
          id?: string
          province: string
          municipality?: string | null
          votes?: number
          percentage?: number
          source?: string
          updatedAt?: string
          createdAt?: string
        }
        Update: {
          id?: string
          province?: string
          municipality?: string | null
          votes?: number
          percentage?: number
          source?: string
          updatedAt?: string
          createdAt?: string
        }
      }
      Alert: {
        Row: {
          id: string
          title: string
          message: string
          type: string
          active: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          type: string
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          type?: string
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      Subscriber: {
        Row: {
          id: string
          email: string
          name: string | null
          active: boolean
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          active?: boolean
          createdAt?: string
          updatedAt?: string
        }
      }
      SiteStats: {
        Row: {
          id: string
          totalVolunteers: number
          totalEvents: number
          totalNews: number
          totalLeaders: number
          updatedAt: string
        }
        Insert: {
          id?: string
          totalVolunteers?: number
          totalEvents?: number
          totalNews?: number
          totalLeaders?: number
          updatedAt?: string
        }
        Update: {
          id?: string
          totalVolunteers?: number
          totalEvents?: number
          totalNews?: number
          totalLeaders?: number
          updatedAt?: string
        }
      }
      SiteConfig: {
        Row: {
          id: string
          key: string
          value: string
          updatedAt: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          updatedAt?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          updatedAt?: string
        }
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
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
