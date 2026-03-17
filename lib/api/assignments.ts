import { supabase } from '../supabase/client';
import { Assignment } from '../../types/database';

export const assignmentsApi = {
  async getAssignmentsByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Assignment[];
  },

  async createAssignment(assignment: Omit<Assignment, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('assignments') as any)
      .insert([assignment])
      .select()
      .single();
    
    if (error) throw error;
    return data as Assignment;
  },

  async updateAssignment(id: string, updates: Partial<Assignment>) {
    const { data, error } = await (supabase.from('assignments') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Assignment;
  },

  async deleteAssignment(id: string) {
    const { error } = await supabase
      .from('assignments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
