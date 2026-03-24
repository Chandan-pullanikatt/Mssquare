const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function finalizeEnrollment() {
  const email = 'chandanpullanikatt@gmail.com';
  const courseId = '110e9ba4-a833-448e-ac29-395d37f6ec91';

  try {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      console.error(`User ${email} not found.`);
      return;
    }

    const userId = user.id;

    // 1. Update Profile Role to 'student'
    console.log(`Setting role to 'student' for ${email}...`);
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'student' })
      .eq('id', userId);
    
    if (profileError) {
      console.error('Error updating profile role:', profileError.message);
    } else {
      console.log('Profile role updated to student.');
    }

    // 2. Update Enrollment Payment Status to 'success'
    console.log(`Setting payment_status to 'success' for enrollment in course ${courseId}...`);
    const { error: enrollError } = await supabase
      .from('student_enrollments')
      .update({ payment_status: 'success' })
      .eq('student_id', userId)
      .eq('course_id', courseId);
    
    if (enrollError) {
      console.error('Error updating enrollment:', enrollError.message);
    } else {
      console.log('Enrollment payment_status updated to success.');
    }

    console.log('Finalization complete.');
  } catch (err) {
    console.error('Error during finalization:', err.message);
  }
}

finalizeEnrollment();
