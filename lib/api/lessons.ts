import { supabase } from '../supabaseClient';
import { Lesson } from '../../types/database';

export const lessonsApi = {
  async getLessonsByCourseId(courseId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data as Lesson[];
  },

  async getLessonById(id: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Lesson;
  },

  async createLesson(lesson: Omit<Lesson, 'id' | 'created_at'>) {
    const { data, error } = await (supabase.from('lessons') as any)
      .insert([lesson])
      .select()
      .single();
    
    if (error) throw error;
    return data as Lesson;
  },

  async updateLesson(id: string, updates: Partial<Lesson>) {
    const { data, error } = await (supabase.from('lessons') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Lesson;
  },

  async deleteLesson(id: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async reorderLessons(courseId: string, lessonIds: string[]) {
    // Sequential update to ensure order consistency
    // In a real app, you might want to use a stored procedure for bulk reordering
    for (let i = 0; i < lessonIds.length; i++) {
      const { error } = await (supabase.from('lessons') as any)
        .update({ order_index: i + 1 })
        .eq('id', lessonIds[i]);
      if (error) throw error;
    }
    return true;
  }
};
