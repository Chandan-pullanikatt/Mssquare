
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = ['business_projects', 'service_requests', 'consultancy_services', 'profiles', 'users'];
  console.log('Checking for tables:', tables.join(', '));
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`[OK] Table '${table}' exists (empty or has data).`);
        } else if (error.message.includes('does not exist')) {
          console.log(`[MISSING] Table '${table}' does NOT exist.`);
        } else {
          console.log(`[ERROR] Table '${table}': ${error.message}`);
        }
      } else {
        console.log(`[OK] Table '${table}' exists.`);
      }
    } catch (err) {
      console.error(`[CRITICAL] Table '${table}':`, err.message);
    }
  }
}

checkTables();
