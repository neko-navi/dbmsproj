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
      users: {
        Row: {
          id: string
          business_name: string
          email: string
          role: 'admin' | 'customer' | 'viewer'
          created_at: string
        }
        Insert: {
          id?: string
          business_name: string
          email: string
          role?: 'admin' | 'customer' | 'viewer'
          created_at?: string
        }
        Update: {
          id?: string
          business_name?: string
          email?: string
          role?: 'admin' | 'customer' | 'viewer'
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: 'Basic' | 'Premium' | 'Enterprise'
          status: 'active' | 'inactive'
          start_date: string
          end_date: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_type: 'Basic' | 'Premium' | 'Enterprise'
          status?: 'active' | 'inactive'
          start_date?: string
          end_date?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_type?: 'Basic' | 'Premium' | 'Enterprise'
          status?: 'active' | 'inactive'
          start_date?: string
          end_date?: string | null
        }
      }
      warehouses: {
        Row: {
          id: string
          user_id: string
          name: string
          city: string
          country: string
          status: 'active' | 'inactive'
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          city: string
          country: string
          status?: 'active' | 'inactive'
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          city?: string
          country?: string
          status?: 'active' | 'inactive'
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          warehouse_id: string
          recipient_name: string
          total_weight: number
          status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
        }
        Insert: {
          id?: string
          user_id: string
          warehouse_id: string
          recipient_name: string
          total_weight: number
          status?: 'pending' | 'shipped' | 'delivered' | 'cancelled'
        }
        Update: {
          id?: string
          user_id?: string
          warehouse_id?: string
          recipient_name?: string
          total_weight?: number
          status?: 'pending' | 'shipped' | 'delivered' | 'cancelled'
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          service_type: string
        }
        Insert: {
          id?: string
          name: string
          service_type: string
        }
        Update: {
          id?: string
          name?: string
          service_type?: string
        }
      }
      shipping_quotes: {
        Row: {
          order_id: string
          vendor_id: string
          shipping_price: number
          estimated_days: number
          status: 'valid' | 'expired'
        }
        Insert: {
          order_id: string
          vendor_id: string
          shipping_price: number
          estimated_days: number
          status?: 'valid' | 'expired'
        }
        Update: {
          order_id?: string
          vendor_id?: string
          shipping_price?: number
          estimated_days?: number
          status?: 'valid' | 'expired'
        }
      }
      order_history: {
        Row: {
          id: string
          order_id: string
          shipping_price: number
          payment_mode: 'prepaid' | 'COD'
          delivery_status: 'in_transit' | 'delivered' | 'failed'
          delivery_date: string | null
          tracking_id: string
        }
        Insert: {
          id?: string
          order_id: string
          shipping_price: number
          payment_mode?: 'prepaid' | 'COD'
          delivery_status: 'in_transit' | 'delivered' | 'failed'
          delivery_date?: string | null
          tracking_id: string
        }
        Update: {
          id?: string
          order_id?: string
          shipping_price?: number
          payment_mode?: 'prepaid' | 'COD'
          delivery_status?: 'in_transit' | 'delivered' | 'failed'
          delivery_date?: string | null
          tracking_id?: string
        }
      }
      shipping_rates: {
        Row: {
          id: string
          vendor_id: string
          weight_from: number
          weight_to: number
          base_price: number
          price_per_5km: number
        }
        Insert: {
          id?: string
          vendor_id: string
          weight_from: number
          weight_to: number
          base_price: number
          price_per_5km: number
        }
        Update: {
          id?: string
          vendor_id?: string
          weight_from?: number
          weight_to?: number
          base_price?: number
          price_per_5km?: number
        }
      }
    }
  }
}