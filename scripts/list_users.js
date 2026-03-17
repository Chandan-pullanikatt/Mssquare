
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function listAllUsers() {
  console.log('Fetching all users from Supabase Auth...');
  
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    console.log(`Found ${users.length} users.`);
    
    // For each user, fetch their profile role
    const usersWithRoles = await Promise.all(users.map(async (u) => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', u.id)
        .maybeSingle();
      
      return {
        email: u.email,
        id: u.id,
        role: profile?.role || 'no profile'
      };
    }));

    fs.writeFileSync('scripts/all_users.json', JSON.stringify(usersWithRoles, null, 2));
    console.log('Results written to scripts/all_users.json');
    console.table(usersWithRoles);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

listAllUsers();
