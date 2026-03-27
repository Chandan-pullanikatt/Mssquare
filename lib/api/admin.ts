import { supabase } from '../supabase/client';


export const adminApi = {
  async getDashboardStats() {
    const fetchWithRetry = async (retries = 1): Promise<any> => {
      try {
        await supabase.auth.getSession();
        const { data, error } = await supabase.rpc('get_cms_dashboard_stats');
        
        // If RPC is missing (PGRST202), trigger fallback
        if (error && (error.code === 'PGRST202' || error.message?.includes('function') || error.message?.includes('not found'))) {
          console.warn("CMS Dashboard: RPC not found in production, using fallback manual fetch.");
          return this.getDashboardStatsManual();
        }
        
        if (error) throw error;
        if (!data) throw new Error("No data from RPC");

        const statsData = data as any;
        return {
          ...statsData,
          recentActivity: (statsData.recentActivity || []).map((a: any) => ({
            ...a,
            courses: { title: a.course_title },
            users: { name: a.student_email ? a.student_email.split('@')[0] : 'Student' } 
          })),
          recentSignups: (statsData.recentSignups || []).map((s: any) => ({
            ...s,
            name: s.email ? s.email.split('@')[0] : 'New User'
          }))
        };
      } catch (err: any) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchWithRetry(retries - 1);
        }
        throw err;
      }
    };

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 10000)
    );

    try {
      return await Promise.race([fetchWithRetry(), timeoutPromise]);
    } catch (err) {
      console.error("Dashboard stats fetch failed or timed out:", err);
      // Last resort fallback if RPC failed for any non-missing-function reason
      try { return await this.getDashboardStatsManual(); } catch { return null; }
    }
  },

  async getDashboardStatsManual() {
    const [
      { count: totalUsers },
      { count: totalStudents },
      { count: totalCourses },
      { count: totalBlogs },
      { count: totalEnrollments },
      { count: totalLeads },
      { count: totalInquiries },
      { data: recentActivity },
      { data: recentSignups }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('blogs').select('*', { count: 'exact', head: true }),
      supabase.from('student_enrollments').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('webservice_enquiries').select('*', { count: 'exact', head: true }),
      supabase.from('student_enrollments').select(`id, created_at, course_id, student_id`).order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('id, email, created_at, role').order('created_at', { ascending: false }).limit(5)
    ]);

    // Simple enrichment
    const enrichedActivity = (recentActivity as any[] || []).map(a => ({
      ...a,
      courses: { title: 'Loading...' }, // Component will handle empty/unknown
      users: { name: 'Student' }
    }));

    return {
      totalUsers: totalUsers || 0,
      totalStudents: totalStudents || 0,
      totalCourses: totalCourses || 0,
      totalBlogs: totalBlogs || 0,
      totalEnrollments: totalEnrollments || 0,
      totalLeads: totalLeads || 0,
      totalInquiries: totalInquiries || 0,
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
  },

  async getInstructors() {
    const { data: instructors, error: instructorError } = await supabase
      .from('instructors')
      .select('id, email, created_at, status, remarks')
      .order('created_at', { ascending: false });

    if (instructorError) throw instructorError;

    // Fetch courses for these instructors
    const instructorIds = (instructors as any[]).map(i => i.id);
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, instructor_id')
      .in('instructor_id', instructorIds);

    const enrichedInstructors = (instructors as any[]).map(instructor => ({
      ...instructor,
      courses: (courses as any[] || []).filter(c => c.instructor_id === instructor.id)
    }));

    return enrichedInstructors;
  },

  async addInstructor(email: string, remarks?: string) {
    const { inviteInstructor } = await import('@/app/actions/invite');
    return await inviteInstructor(email, remarks);
  },

  async updateInstructor(id: string, updates: any) {
    const { error } = await (supabase.from('instructors') as any)
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async deleteInstructor(id: string) {
    const { error } = await (supabase.from('instructors') as any)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async assignCourseToInstructor(courseId: string, instructorId: string) {
    const { data, error } = await (supabase.from('courses') as any)
      .update({ instructor_id: instructorId })
      .eq('id', courseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getGroupSessions() {
    const { data, error } = await supabase
      .from('group_sessions')
      .select(`
        *,
        course:courses(title),
        instructors:group_session_instructors(
          instructor_id
        )
      `)
      .order('scheduled_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createGroupSession(sessionData: any, instructorIds: string[]) {
    // 1. Create the session
    const { data: session, error: sessionError } = await (supabase.from('group_sessions') as any)
      .insert(sessionData)
      .select()
      .single();

    if (sessionError) throw sessionError;

    // 2. Link instructors
    if (instructorIds.length > 0) {
      const links = instructorIds.map(id => ({
        session_id: session.id,
        instructor_id: id
      }));
      const { error: linkError } = await (supabase.from('group_session_instructors') as any)
        .insert(links);
      if (linkError) throw linkError;
    }

    return session;
  },

  async deleteGroupSession(id: string) {
    const { error } = await (supabase.from('group_sessions') as any)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async getTimetables() {
    const { data, error } = await supabase
      .from('course_timetables')
      .select(`
        *,
        course:courses(title),
        instructor:profiles!instructor_id(email),
        instructors:timetable_instructors(
          instructor_id,
          profile:profiles!instructor_id(email)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createTimetable(timetableData: any, additionalInstructorIds: string[] = []) {
    const { data: timetable, error } = await (supabase.from('course_timetables') as any)
      .insert([timetableData])
      .select()
      .single();

    if (error) throw error;

    if (additionalInstructorIds.length > 0) {
      const links = additionalInstructorIds.map(id => ({
        timetable_id: timetable.id,
        instructor_id: id
      }));
      const { error: linkError } = await (supabase.from('timetable_instructors') as any)
        .insert(links);
      if (linkError) throw linkError;
    }

    return timetable;
  },

  async updateTimetable(id: string, updates: any, additionalInstructorIds: string[] = []) {
    const { data: timetable, error } = await (supabase.from('course_timetables') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Sync additional instructors
    if (additionalInstructorIds) {
      // 1. Delete old links
      await (supabase.from('timetable_instructors') as any)
        .delete()
        .eq('timetable_id', id);

      // 2. Insert new links
      if (additionalInstructorIds.length > 0) {
        const links = additionalInstructorIds.map((instId: string) => ({
          timetable_id: id,
          instructor_id: instId
        }));
        const { error: linkError } = await (supabase.from('timetable_instructors') as any)
          .insert(links);
        if (linkError) throw linkError;
      }
    }

    return timetable;
  },

  async deleteTimetable(id: string) {
    const { error } = await (supabase.from('course_timetables') as any)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async globalSearch(query: string) {
    if (!query || query.length < 2) return { students: [], instructors: [], courses: [] };

    // We search across profiles (students), instructors, and courses
    const [
      { data: students },
      { data: instructors },
      { data: courses }
    ] = await Promise.all([
      supabase.from('profiles')
        .select(`
          id, 
          email, 
          role
        `)
        .eq('role', 'student')
        .ilike('email', `%${query}%`)
        .limit(5),
      
      supabase.from('instructors')
        .select('id, email, status')
        .ilike('email', `%${query}%`)
        .limit(5),
      
      supabase.from('courses')
        .select('id, title, category')
        .ilike('title', `%${query}%`)
        .limit(5)
    ]);

    return {
      students: students || [],
      instructors: instructors || [],
      courses: courses || []
    };
  },

  async cmsGlobalSearch(query: string) {
    if (!query || query.length < 2) return { users: [], courses: [], blogs: [], leads: [], enquiries: [] };

    const [
      { data: users },
      { data: courses },
      { data: blogs },
      { data: leads },
      { data: enquiries }
    ] = await Promise.all([
      supabase.from('profiles')
        .select('id, email, role')
        .ilike('email', `%${query}%`)
        .limit(5),
      
      supabase.from('courses')
        .select('id, title, category')
        .ilike('title', `%${query}%`)
        .limit(5),

      supabase.from('blogs')
        .select('id, title, category, slug')
        .ilike('title', `%${query}%`)
        .limit(5),

      supabase.from('leads')
        .select('id, name, email, source')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(5),

      supabase.from('webservice_enquiries')
        .select('id, subject, status')
        .ilike('subject', `%${query}%`)
        .limit(5)
    ]);

    return {
      users: users || [],
      courses: courses || [],
      blogs: blogs || [],
      leads: leads || [],
      enquiries: enquiries || []
    };
  }
};
