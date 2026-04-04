const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lwecqfwyislaesgxgpze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZWNxZnd5aXNsYWVzZ3hncHplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5MjYzNSwiZXhwIjoyMDg4OTY4NjM1fQ.uCykxmA12ZZzBgKdDuZ-953T_Lt3YwSdZpQ5G14A1Ls';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFKs() {
  const { data, error } = await supabase.rpc('get_table_fks', { table_name_input: 'student_enrollments' });
  
  if (error) {
    // If RPC doesn't exist, try a direct query to information_schema (might fail due to permissions)
    console.log('RPC get_table_fks failed, trying raw query...');
    const { data: raw, error: rawError } = await supabase.from('information_schema.key_column_usage').select('*').eq('table_name', 'student_enrollments');
    if (rawError) console.error('Raw query failed:', rawError);
    else console.log('Raw result:', raw);
  } else {
    console.log('FKs:', data);
  }
}

checkFKs();
