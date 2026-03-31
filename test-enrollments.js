const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select('*, courses(*, lessons(id))')
    .limit(1);
    
  if (error) {
    console.error("Query Error:", error);
  } else {
    console.log("Query Success:", data);
  }
}

test();
