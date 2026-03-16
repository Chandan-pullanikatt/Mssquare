import { supabase } from '../supabase/client';
import { Module } from '../../types/database';


export const modulesApi = {
  async getModulesByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('modules')
      .select('*, lessons(*)')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createModule(module: Omit<Module, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('modules') as any)
      .insert([module])
      .select()
      .single();
    
    if (error) throw error;
    return data as Module;
  },

  async updateModule(id: string, updates: Partial<Module>) {
    const { data, error } = await (supabase.from('modules') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Module;
  },

  async deleteModule(id: string) {
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
