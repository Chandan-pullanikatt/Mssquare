const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function enrollUser() {
  const emails = ['chandanpullanikatt@gmal.com', 'chandanpullanikatt@gmail.com'];
  const courseId = '110e9ba4-a833-448e-ac29-395d37f6ec91'; // Course 'TEST'

  try {
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) throw listError;
    
    let found = false;
    for (const email of emails) {
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        found = true;
        const userId = existingUser.id;
        console.log(`Found user "${email}" with ID: ${userId}`);

        // Ensure profile exists with 'student' role for student view
        console.log(`Setting profile role to 'student' for user ${userId}...`);
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ id: userId, email: email, role: 'student' });
        
        if (profileError) {
            console.warn(`Profile update warning: ${profileError.message}`);
        } else {
            console.log('Profile role set to student.');
        }

        // Enroll
        console.log(`Checking enrollment for user ${userId} in course ${courseId}...`);
        const { data: existingEnrollment } = await supabase
          .from('student_enrollments')
          .select('*')
          .eq('student_id', userId)
          .eq('course_id', courseId)
          .maybeSingle();

        if (existingEnrollment) {
          console.log('User is already enrolled in this course.');
        } else {
          console.log(`Enrolling user ${userId} in course ${courseId}...`);
          const { error: enrollError } = await supabase
            .from('student_enrollments')
            .insert({
              student_id: userId,
              course_id: courseId
            });
          if (enrollError) throw enrollError;
          console.log('Enrollment successful.');
        }
      }
    }

    if (!found) {
      console.log('No user found matching chandanpullanikatt@gmal.com or @gmail.com.');
      console.log('All available users:');
      console.log(users.map(u => u.email).join(', '));
    }

  } catch (err) {
    console.error('Error during enrollment:', err.message);
  }
}

enrollUser();
