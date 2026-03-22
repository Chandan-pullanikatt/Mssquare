const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFetchAsStudent() {
  const email = 'chandanpullanikatt@gmail.com';
  const password = 'Chandan@123';
  
  try {
    console.log(`Logging in as ${email}...`);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    console.log('Login successful. User ID:', authData.user.id);

    console.log('Fetching enrollments from "student_enrollments"...');
    const { data: enrollments, error: enrollError } = await supabase
      .from('student_enrollments')
      .select('*')
      .eq('student_id', authData.user.id);

    if (enrollError) {
        console.log('Error fetching student_enrollments:', enrollError.message);
    } else {
        console.log(`Fetched ${enrollments.length} enrollments from "student_enrollments".`);
    }

    console.log('Fetching enrollments from "enrollments"...');
    const { data: e2, error: err2 } = await supabase
      .from('enrollments')
      .select('*');
    
    if (err2) {
        console.log('Error fetching enrollments:', err2.message);
    } else {
        console.log(`Fetched ${e2.length} enrollments from "enrollments".`);
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

testFetchAsStudent();
