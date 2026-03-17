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
      supabase.from('student_enrollments').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('student_enrollments')
        .select(`
          id,
          created_at,
          course_id,
          student_id
        `)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('profiles')
        .select('id, email, created_at, role')
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    // Fetch related course names and student emails for recent activity manually for robustness
    let enrichedActivity: any[] = [];
    const activityList = recentActivity as any[] || [];
    if (activityList.length > 0) {
      const courseIds = [...new Set(activityList.map((a: any) => a.course_id))];
      const studentIds = [...new Set(activityList.map((a: any) => a.student_id))];
      
      const [
        { data: courses },
        { data: students }
      ] = await Promise.all([
        supabase.from('courses').select('id, title').in('id', courseIds),
        supabase.from('profiles').select('id, email').in('id', studentIds)
      ]);
      
      const courseMap = (courses as any[] || []).reduce((acc: any, c: any) => ({ ...acc, [c.id]: c.title }), {});
      const studentMap = (students as any[] || []).reduce((acc: any, s: any) => ({ ...acc, [s.id]: s.email }), {});
      
      enrichedActivity = activityList.map((a: any) => ({
        ...a,
        courses: { title: courseMap[a.course_id] || 'Unknown Course' },
        profiles: { email: studentMap[a.student_id] || 'Student' }
      }));
    }

    return {
      totalUsers: totalUsers || 0,
      totalStudents: totalStudents || 0,
      totalCourses: totalCourses || 0,
      totalBlogs: totalBlogs || 0,
      totalEnrollments: totalEnrollments || 0,
      totalLeads: totalLeads || 0,
      recentActivity: enrichedActivity,
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
