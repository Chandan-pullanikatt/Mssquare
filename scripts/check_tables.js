const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    const { count: enrollCount, error: enrollErr } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true });
    
    const { count: studentEnrollCount, error: studentEnrollErr } = await supabase
      .from('student_enrollments')
      .select('*', { count: 'exact', head: true });

    console.log('Table "enrollments" exists:', !enrollErr, 'Count:', enrollCount);
    if (enrollErr) console.log('Error "enrollments":', enrollErr.message);
    
    console.log('Table "student_enrollments" exists:', !studentEnrollErr, 'Count:', studentEnrollCount);
    if (studentEnrollErr) console.log('Error "student_enrollments":', studentEnrollErr.message);

    // Check my user in both
    const email = 'chandanpullanikatt@gmail.com';
    const { data: userProfile } = await supabase.from('profiles').select('id').eq('email', email).maybeSingle();
    
    if (userProfile) {
        console.log(`Checking user ID ${userProfile.id} for enrollments...`);
        const { data: e1 } = await supabase.from('enrollments').select('*').eq('student_id', userProfile.id);
        const { data: e2 } = await supabase.from('student_enrollments').select('*').eq('student_id', userProfile.id);
        console.log('Enrollments in "enrollments":', e1?.length || 0);
        console.log('Enrollments in "student_enrollments":', e2?.length || 0);
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkTables();
