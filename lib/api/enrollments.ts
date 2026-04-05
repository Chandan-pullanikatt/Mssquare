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
    // Note: The 'progress' column has been removed from student_enrollments.
    // Progress tracking is likely handled by lesson_progress table or similar.
    // This is a stub to prevent crashes.
    console.warn("Attempted to update progress on student_enrollments, but column is missing.");
    return null;
  }
};
