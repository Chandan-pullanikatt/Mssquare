import { supabase } from '../supabase/client';
import { Enrollment } from '../../types/database';


export const enrollmentsApi = {
  async getEnrollmentsByUser(userId: string) {
    const { data, error } = await supabase
      .from('student_enrollments')
      .select('*, courses(*, lessons(id))')
      .eq('student_id', userId);
    
    if (error) throw error;
    return data;
  },

  async enrollInCourse(userId: string, courseId: string) {
    const { data, error } = await (supabase.from('student_enrollments') as any)
      .insert([{ student_id: userId, course_id: courseId, payment_status: 'success' }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Enrollment;
  },

  async updateProgress(userId: string, courseId: string, progress: number) {
    const { data, error } = await (supabase.from('student_enrollments') as any)
      .update({ progress })
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Enrollment;
  }
};
