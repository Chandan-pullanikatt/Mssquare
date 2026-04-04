const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lwecqfwyislaesgxgpze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZWNxZnd5aXNsYWVzZ3hncHplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5MjYzNSwiZXhwIjoyMDg4OTY4NjM1fQ.uCykxmA12ZZzBgKdDuZ-953T_Lt3YwSdZpQ5G14A1Ls';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select(`
      id,
      created_at,
      course_id,
      student_id,
      payment_status,
      course:courses(title),
      student:profiles!student_id(email)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', data.length, 'records found');
    if (data.length > 0) console.log('Sample record:', data[0]);
  }
}

test();
