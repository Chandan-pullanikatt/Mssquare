const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalCheck() {
  const email = 'chandanpullanikatt@gmail.com';
  try {
    const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single();
    if (!profile) throw new Error('Profile not found');

    const { data: enrollments, error } = await supabase
      .from('student_enrollments')
      .select('*, courses(title)')
      .eq('student_id', profile.id);

    if (error) throw error;
    
    console.log(`User ${email} (ID: ${profile.id}) has ${enrollments.length} enrollments:`);
    enrollments.forEach(e => {
      console.log(`- Course: ${e.courses?.title}, ID: ${e.course_id}, Payment: ${e.payment_status}`);
    });

  } catch (err) {
    console.error('Error:', err.message);
  }
}

finalCheck();
