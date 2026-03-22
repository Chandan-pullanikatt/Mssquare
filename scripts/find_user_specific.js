const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findUser() {
  const email = 'chandanpullanikatt@gmal.com';
  console.log(`Searching for user "${email}"...`);
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    const user = users.find(u => u.email === email);
    if (user) {
      console.log('Found user:');
      console.log(JSON.stringify(user, null, 2));
    } else {
      console.log(`User "${email}" not found.`);
      const similar = users.find(u => u.email.includes('chandanpullanikatt'));
      if (similar) {
        console.log('Found similar user:', similar.email);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

findUser();
