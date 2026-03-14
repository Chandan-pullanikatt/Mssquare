import { supabase } from '../supabaseClient';
import { User, UserRole } from '../../types/database';

export const usersApi = {
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as User;
  },

  async createUser(user: Omit<User, 'created_at'>) {
    const { data, error } = await (supabase.from('users') as any)
      .insert([user] as any)
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  },

  async updateUser(id: string, updates: Partial<User>) {
    const { data, error } = await (supabase.from('users') as any)
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  },

  async listUsersByRole(role: UserRole) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role);
    
    if (error) throw error;
    return data as User[];
  }
};
