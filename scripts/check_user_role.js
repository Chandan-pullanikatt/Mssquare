
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser(email) {
  const log = [];
  log.push(`Checking roles for: ${email}`);
  
  try {
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    const user = users.find(u => u.email === email);
    
    if (!user) {
      log.push('User not found in auth.users');
    } else {
      log.push(`Found auth user ID: ${user.id}`);
      
      const { data: profiles } = await supabase.from('profiles').select('*').eq('id', user.id);
      log.push(`Profiles: ${JSON.stringify(profiles, null, 2)}`);

      const { data: usersTable } = await supabase.from('users').select('*').eq('id', user.id);
      log.push(`Users Table: ${JSON.stringify(usersTable, null, 2)}`);
    }
  } catch (err) {
    log.push(`Error: ${err.message}`);
  }

  fs.writeFileSync('scripts/output.txt', log.join('\n'));
  console.log('Results written to scripts/output.txt');
}

checkUser('chandanpullanikatt@gmail.com');
