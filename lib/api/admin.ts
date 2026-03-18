import { supabase } from '../supabase/client';


export const adminApi = {
  async getDashboardStats() {
    try {
      const { data, error } = await supabase.rpc('get_cms_dashboard_stats');
      
      if (error) {
        throw error;
      }

      const statsData = data as any;

      // The RPC returns a JSON object that matches our expected structure
      const enrichedActivity = (statsData.recentActivity || []).map((a: any) => ({
        ...a,
        courses: { title: a.course_title },
        users: { name: a.student_email ? a.student_email.split('@')[0] : 'Student' } 
      }));

      const signups = (statsData.recentSignups || []).map((s: any) => ({
        ...s,
        name: s.email ? s.email.split('@')[0] : 'New User'
      }));

      return {
        ...statsData,
        recentActivity: enrichedActivity,
        recentSignups: signups
      };
    } catch (err) {
      console.error("Dashboard stats fetch failed:", err);

      return {
        totalUsers: 0,
        totalStudents: 0,
        totalCourses: 0,
        totalBlogs: 0,
        totalEnrollments: 0,
        totalLeads: 0,
        recentActivity: [],
        recentSignups: []
      };
    }
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
    // 1. Delete dependent records first to avoid FK constraints
    await supabase.from('student_enrollments').delete().eq('course_id', id);
    await supabase.from('lessons').delete().eq('course_id', id);
    await supabase.from('modules').delete().eq('course_id', id);
    await supabase.from('projects').delete().eq('course_id', id);
    await supabase.from('assignments').delete().eq('course_id', id);

    // 2. Finally delete the course
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Delete course error:", error);
      throw error;
    }
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

  async updateCourse(id: string, updates: any) {
    const { data, error } = await (supabase.from('courses') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCourseById(id: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getStudents() {
    const { data: students, error: studentError } = await supabase
      .from('profiles')
      .select('id, email, created_at')
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    if (studentError) throw studentError;

    // Fetch enrollments for these students
    const studentIds = (students as any[]).map(s => s.id);
    const { data: enrollments } = await supabase
      .from('student_enrollments')
      .select('id, student_id, course_id')
      .in('student_id', studentIds);

    const { data: courses } = await supabase.from('courses').select('id, title');
    const courseMap = (courses as any[] || []).reduce((acc: any, c: any) => ({ ...acc, [c.id]: c.title }), {});

    const enrichedStudents = (students as any[]).map(student => ({
      ...student,
      student_enrollments: (enrollments as any[] || [])
        .filter(e => e.student_id === student.id)
        .map(e => ({
          id: e.id,
          courses: { title: courseMap[e.course_id] || 'Unknown' }
        }))
    }));

    return enrichedStudents;
  },

  async getCourseStats() {
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('id, title');

    if (courseError) throw courseError;

    const { data: enrollments } = await supabase
      .from('student_enrollments')
      .select('course_id');

    const enrollmentCounts = (enrollments as any[] || []).reduce((acc: any, e: any) => {
      acc[e.course_id] = (acc[e.course_id] || 0) + 1;
      return acc;
    }, {});

    return (courses as any[] || []).map(course => ({
      ...course,
      enrollment_count: enrollmentCounts[course.id] || 0
    }));
  }
};
