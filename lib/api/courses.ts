import { supabase } from '../supabase/client';
import { Course } from '../../types/database';

export const coursesApi = {
  async getCourses(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description, thumbnail, price, level, category, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data as Course[];
  },

  async getCourseById(id: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, description, thumbnail, price, level, category, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Course;
  },

  async createCourse(course: Omit<Course, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('courses') as any)
      .insert([course])
      .select()
      .single();
    
    if (error) throw error;
    return data as Course;
  },

  async updateCourse(id: string, updates: Partial<Course>) {
    // 1. Fetch current version for revision history
    const { data: current } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (current) {
      const history = (current as any).revision_history || [];
      const newRevision = {
        timestamp: new Date().toISOString(),
        old_data: current,
        changes: updates
      };
      
      // Keep last 10 revisions in the record itself
      const updatedHistory = [newRevision, ...history].slice(0, 10);
      (updates as any).revision_history = updatedHistory;
    }

    const { data, error } = await (supabase.from('courses') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Course;
  },

  async deleteCourse(id: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
