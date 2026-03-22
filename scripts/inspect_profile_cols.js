const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectProfile() {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    
    if (error) throw error;
    console.log('Profile Columns:', Object.keys(profile));
    console.log('Sample Profile Data:', JSON.stringify(profile, null, 2));

  } catch (err) {
    console.error('Error:', err.message);
  }
}

inspectProfile();
