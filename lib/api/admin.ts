import { supabase } from '../supabaseClient';

export const adminApi = {
  async getDashboardStats() {
    const [
      { count: totalUsers },
      { count: totalStudents },
      { count: totalCourses },
      { count: totalBlogs },
      { count: totalEnrollments },
      { count: totalLeads },
      { data: recentActivity },
      { data: recentSignups }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('enrollments').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('enrollments')
        .select(`
          id,
          enrolled_at,
          users (name),
          courses (title)
        `)
        .order('enrolled_at', { ascending: false })
        .limit(5),
      supabase.from('users')
        .select('id, name, created_at, role')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    return {
      totalUsers: totalUsers || 0,
      totalStudents: totalStudents || 0,
      totalCourses: totalCourses || 0,
      totalBlogs: totalBlogs || 0,
      totalEnrollments: totalEnrollments || 0,
      totalLeads: totalLeads || 0,
      recentActivity: recentActivity || [],
      recentSignups: recentSignups || []
    };
  }
};
