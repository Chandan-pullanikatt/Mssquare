-- RPC to fetch all CMS dashboard stats in a single request
CREATE OR REPLACE FUNCTION get_cms_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'totalUsers', (SELECT count(*) FROM profiles),
        'totalStudents', (SELECT count(*) FROM profiles WHERE role = 'student'),
        'totalCourses', (SELECT count(*) FROM courses),
        'totalBlogs', (SELECT count(*) FROM blogs),
        'totalEnrollments', (SELECT count(*) FROM student_enrollments),
        'totalLeads', (SELECT count(*) FROM leads),
        'recentActivity', (
            SELECT json_agg(activity) FROM (
                SELECT 
                    se.id, 
                    se.created_at, 
                    COALESCE(c.title, 'Unknown Course') as course_title, 
                    COALESCE(p.email, 'Unknown Student') as student_email
                FROM student_enrollments se
                LEFT JOIN courses c ON se.course_id = c.id
                LEFT JOIN profiles p ON se.student_id = p.id
                ORDER BY se.created_at DESC
                LIMIT 5
            ) activity
        ),
        'recentSignups', (
            SELECT json_agg(signup) FROM (
                SELECT id, email, created_at, role
                FROM profiles
                ORDER BY created_at DESC
                LIMIT 5
            ) signup
        )
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
