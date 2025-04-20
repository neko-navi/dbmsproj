import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import toast from 'react-hot-toast';

type User = Database['public']['Tables']['users']['Row'];

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, businessName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      // Check for hardcoded admin credentials
      if (email === 'admin@shipme.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-id',
          business_name: 'ShipMe Admin',
          email: 'admin@shipme.com',
          role: 'admin',
          created_at: new Date().toISOString()
        };
        set({ user: adminUser, loading: false, error: null });
        toast.success(`Welcome back, ${adminUser.business_name}!`);
        return;
      }

      // Check for hardcoded viewer credentials
      if (email === 'viewer@shipme.com' && password === 'viewer123') {
        const viewerUser: User = {
          id: 'viewer-id',
          business_name: 'Viewer Account',
          email: 'viewer@shipme.com',
          role: 'viewer',
          created_at: new Date().toISOString()
        };
        set({ user: viewerUser, loading: false, error: null });
        toast.success(`Welcome back, ${viewerUser.business_name}!`);
        return;
      }

      // For regular users, proceed with normal authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error('No user returned from authentication');
      }

      // Then fetch the user profile from our users table
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        throw new Error('Failed to fetch user profile');
      }

      if (!profile) {
        throw new Error('User profile not found');
      }

      set({ user: profile, loading: false, error: null });
      toast.success(`Welcome back, ${profile.business_name}!`);
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Sign in error:', errorMessage);
      set({ user: null, loading: false, error: errorMessage });
      toast.error('Invalid email or password');
      throw error;
    }
  },
  signUp: async (email: string, password: string, businessName: string) => {
    try {
      set({ loading: true, error: null });

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName,
          }
        }
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!authData.user) {
        throw new Error('No user returned from sign up');
      }

      const { error: profileError } = await supabase
        .from('users')
        .insert([{ 
          id: authData.user.id,
          email, 
          business_name: businessName,
          role: 'customer'
        }]);
      
      if (profileError) {
        throw new Error('Failed to create user profile');
      }

      set({ loading: false, error: null });
      toast.success('Registration successful! Please sign in.');
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Sign up error:', errorMessage);
      set({ loading: false, error: errorMessage });
      toast.error('Failed to create account');
      throw error;
    }
  },
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }

      set({ user: null, loading: false, error: null });
      toast.success('Signed out successfully');
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Sign out error:', errorMessage);
      set({ loading: false, error: errorMessage });
      throw error;
    }
  },
  loadUser: async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(sessionError.message);
      }

      if (!session) {
        set({ user: null, loading: false, error: null });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        throw new Error('Failed to fetch user profile');
      }

      set({ user: profile, loading: false, error: null });
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.error('Load user error:', errorMessage);
      set({ loading: false, error: errorMessage });
    }
  },
}));