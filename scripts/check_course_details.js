const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCourse() {
  const courseId = '110e9ba4-a833-448e-ac29-395d37f6ec91';
  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();
    
    if (error) throw error;
    console.log('Course Details:', JSON.stringify(course, null, 2));

    // Also check if any other course is enrolled for this user
    const userId = '46dd6099-00e4-4b3f-bace-b20bac51f6d6';
    const { data: allEnrollments } = await supabase
      .from('student_enrollments')
      .select('*, courses(*)')
      .eq('student_id', userId);
    
    console.log('User Enrollments (Total):', allEnrollments?.length || 0);
    if (allEnrollments) {
        allEnrollments.forEach(e => {
            console.log(`- Course: ${e.courses?.title}, ID: ${e.course_id}, Status: ${e.status}, Payment: ${e.payment_status}`);
        });
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkCourse();
