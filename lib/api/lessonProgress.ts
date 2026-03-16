import { supabase } from '../supabaseClient';
import { LessonProgress } from '../../types/database';

export const lessonProgressApi = {
  async markLessonAsCompleted(userId: string, lessonId: string) {
    const { data, error } = await (supabase.from('lesson_progress') as any)
      .upsert([{ user_id: userId, lesson_id: lessonId }], { onConflict: 'user_id,lesson_id' })
      .select()
      .single();
    
    if (error) throw error;
    return data as LessonProgress;
  },

  async getUserProgress(userId: string, courseId: string) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*, lessons!inner(course_id)')
      .eq('user_id', userId)
      .eq('lessons.course_id', courseId);
    
    if (error) throw error;
    return data;
  },

  async getAllUserProgress(userId: string) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*, lessons!inner(course_id)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  },

  async isLessonCompleted(userId: string, lessonId: string) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};
