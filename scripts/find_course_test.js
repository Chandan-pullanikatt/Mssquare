const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findCourse() {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title')
      .ilike('title', 'test');
    
    if (error) throw error;
    console.log(JSON.stringify(courses, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

findCourse();
