import { supabase } from '../supabase/client';
import { User, UserRole } from '../../types/database';


export const usersApi = {
  async getUser(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as any;
  },

  async createUser(user: any) {
    const { data, error } = await (supabase.from('profiles') as any)
      .insert([user] as any)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: any) {
    const { data, error } = await (supabase.from('profiles') as any)
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async listUsersByRole(role: UserRole, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('role', role)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data as any[];
  },

  async listAllUsers(limit = 1000) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return (data as any[] || []).map((u: any) => ({
      ...u,
      name: u.email?.split('@')[0] || 'Unknown User'
    }));
  }
};
