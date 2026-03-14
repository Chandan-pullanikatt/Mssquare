import { supabase } from '../supabaseClient';
import { Course } from '../../types/database';

export const coursesApi = {
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Course[];
  },

  async getCourseById(id: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
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
