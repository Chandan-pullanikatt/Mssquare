const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function getDefinition() {
  const tableName = 'student_enrollments';
  try {
    // This query fetches policies from pg_policies
    const { data: policies, error: polError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', tableName);
    
    if (polError) {
        console.log('Could not fetch from pg_policies (likely permission denied for service role).');
    } else {
        console.log('Policies:', JSON.stringify(policies, null, 2));
    }

    // Check if RLS is enabled
    const { data: tableInfo, error: tableError } = await supabase
        .from('pg_tables')
        .select('*')
        .eq('tablename', tableName);
    
    if (tableError) {
        console.log('Could not fetch from pg_tables.');
    } else {
        console.log('Table Info:', JSON.stringify(tableInfo, null, 2));
    }

    // Try to get columns list one more time with a simple select
    const { data: sample, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
    
    if (sample) {
        console.log('Sample Row Keys (Columns):', Object.keys(sample[0] || {}));
    }

  } catch (err) {
    console.error('Error:', err.message);
  }
}

getDefinition();
