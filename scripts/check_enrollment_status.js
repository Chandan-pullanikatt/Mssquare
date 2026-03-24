const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
  const email = 'chandanpullanikatt@gmail.com';
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    
    if (profileError) throw profileError;
    console.log('Profile:', JSON.stringify(profile, null, 2));

    if (profile) {
      const { data: enrollments, error: enrollError } = await supabase
        .from('student_enrollments')
        .select('*, courses(title)')
        .eq('student_id', profile.id);
      
      if (enrollError) throw enrollError;
      console.log('Enrollments:', JSON.stringify(enrollments, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkStatus();
