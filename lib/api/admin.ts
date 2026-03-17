import { supabase } from '../supabase/client';


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
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
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
      supabase.from('profiles')
        .select('id, email, created_at, role')
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
  },

  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async deleteCourse(id: string) {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  async createCourse(courseData: any) {
    const { data, error } = await (supabase.from('courses') as any)
      .insert([courseData as any])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStudents() {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        created_at,
        enrollments (
          id,
          courses (title)
        )
      `)
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getCourseStats() {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        id,
        title,
        enrollments (count)
      `);

    if (error) throw error;
    
    // Transform to include a direct enrollment_count field
    return (data as any[]).map(course => ({
      ...course,
      enrollment_count: course.enrollments[0]?.count || 0
    }));
  }
};
