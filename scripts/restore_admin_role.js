const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setAdminRole() {
  const email = 'chandanpullanikatt@gmail.com';
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');

    console.log(`Setting role: lms_admin for user ${user.id}...`);
    
    // 1. Update Auth Metadata
    await supabase.auth.admin.updateUserById(
      user.id,
      { app_metadata: { ...user.app_metadata, role: 'lms_admin' } }
    );

    // 2. Update Profiles Table
    await supabase.from('profiles').update({ role: 'lms_admin' }).eq('id', user.id);

    console.log('Role updated to lms_admin successfully.');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

setAdminRole();
