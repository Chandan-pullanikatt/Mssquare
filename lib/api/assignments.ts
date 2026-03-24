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

  async createAssignment(assignment: Omit<Assignment, 'id' | 'created_at' | 'updated_at'>) {
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
  },

  // Rubric Methods
  async getAssignmentRubric(assignmentId: string) {
    const { data, error } = await supabase
      .from('assignment_rubric')
      .select('*')
      .eq('assignment_id', assignmentId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async addRubricCriterion(criterion: any) {
    const { data, error } = await (supabase.from('assignment_rubric') as any)
      .insert([criterion])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateRubricCriterion(id: string, updates: any) {
    const { data, error } = await (supabase.from('assignment_rubric') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteRubricCriterion(id: string) {
    const { error } = await supabase
      .from('assignment_rubric')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
