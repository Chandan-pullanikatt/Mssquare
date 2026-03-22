const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuthMetadata() {
  const email = 'chandanpullanikatt@gmail.com';
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('User not found');

    console.log('User Auth Metadata:', JSON.stringify(user.app_metadata, null, 2));
    console.log('User ID:', user.id);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkAuthMetadata();
