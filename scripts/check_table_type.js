const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableType() {
  try {
    const { data: info, error } = await supabase
        .from('pg_catalog.pg_class')
        .select('relname, relkind')
        .in('relname', ['student_enrollments', 'enrollments']);
    
    if (error) {
        console.log('Permission denied for pg_catalog.pg_class. Trying another way...');
        // relkind: r = table, v = view
    } else {
        console.log('Table/View Info:', JSON.stringify(info, null, 2));
    }

    // Checking if we can select from both
    const { count: c1 } = await supabase.from('enrollments').select('*', { count: 'exact', head: true });
    const { count: c2 } = await supabase.from('student_enrollments').select('*', { count: 'exact', head: true });
    
    console.log('enrollments count:', c1);
    console.log('student_enrollments count:', c2);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkTableType();
