const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lwecqfwyislaesgxgpze.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZWNxZnd5aXNsYWVzZ3hncHplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5MjYzNSwiZXhwIjoyMDg4OTY4NjM1fQ.uCykxmA12ZZzBgKdDuZ-953T_Lt3YwSdZpQ5G14A1Ls';

const supabase = createClient(supabaseUrl, supabaseKey);

async function dump() {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select('*')
    .limit(1);
  
  if (error) console.error('Error:', error);
  else console.log('Record:', data[0]);
}

dump();
