
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUser(email) {
  console.log(`Updating roles for: ${email}`);
  
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log('User not found');
    return;
  }

  // Update profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role: 'lms_admin' })
    .eq('id', user.id);
  
  if (profileError) console.error('Error updating profiles:', profileError);
  else console.log('Profiles table updated to lms_admin');

  // Update users table
  const { error: userError } = await supabase
    .from('users')
    .update({ role: 'lms_admin' })
    .eq('id', user.id);
    
  if (userError) console.error('Error updating users:', userError);
  else console.log('Users table updated to lms_admin');
}

updateUser('chandanpullanikatt@gmail.com');
