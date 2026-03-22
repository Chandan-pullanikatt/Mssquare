const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncRole() {
  const email = 'chandanpullanikatt@gmail.com';
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');

    console.log(`Setting role: student in app_metadata for user ${user.id}...`);
    const { data, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { app_metadata: { ...user.app_metadata, role: 'student' } }
    );

    if (updateError) throw updateError;
    console.log('Role synced successfully to Auth metadata.');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

syncRole();
