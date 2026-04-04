const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lwecqfwyislaesgxgpze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZWNxZnd5aXNsYWVzZ3hncHplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5MjYzNSwiZXhwIjoyMDg4OTY4NjM1fQ.uCykxmA12ZZzBgKdDuZ-953T_Lt3YwSdZpQ5G14A1Ls';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyManualJoin() {
  // 1. Fetch Enrollments
  const { data: enrollments, error } = await supabase
    .from('student_enrollments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching enrollments:', error);
    return;
  }

  console.log(`Fetched ${enrollments.length} enrollments`);

  if (enrollments.length === 0) return;

  const studentIds = enrollments.map(e => e.student_id);
  const courseIds = enrollments.map(e => e.course_id);

  // 2. Fetch Profiles & Courses
  const [{ data: profiles }, { data: courses }] = await Promise.all([
    supabase.from('profiles').select('id, email').in('id', studentIds),
    supabase.from('courses').select('id, title').in('id', courseIds)
  ]);

  const profileMap = (profiles || []).reduce((acc, p) => ({ ...acc, [p.id]: p.email }), {});
  const courseMap = (courses || []).reduce((acc, c) => ({ ...acc, [c.id]: c.title }), {});

  // 3. Join
  const enriched = enrollments.map(e => ({
    ...e,
    student_name: profileMap[e.student_id]?.split('@')[0] || 'Unknown Student',
    student_email: profileMap[e.student_id] || 'Unknown',
    course_title: courseMap[e.course_id] || 'Unknown Course'
  }));

  console.log('Enriched Sample:', enriched[0]);
}

verifyManualJoin();
