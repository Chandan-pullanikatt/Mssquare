const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPolicies() {
  try {
    const { data: policies, error } = await supabase.rpc('get_policies_for_table', { table_name: 'student_enrollments' });
    
    if (error) {
        console.log('RPC get_policies_for_table failed, trying direct select from pg_policies...');
        const { data: pgPolicies, error: pgError } = await supabase
            .from('pg_policies')
            .select('*')
            .eq('tablename', 'student_enrollments');
        
        if (pgError) {
            console.log('Failed to fetch from pg_policies. This is expected if Rls is strict or service role lacks permission for pg_catalog.');
            console.log('Alternative: Checking if RLS is enabled on the table...');
            // We can't easily check RLS enabled status via simple JS client if we don't have an RPC.
        } else {
            console.log('Policies (pg_policies):', JSON.stringify(pgPolicies, null, 2));
        }
    } else {
        console.log('Policies:', JSON.stringify(policies, null, 2));
    }

    // Try a simple select with authenticated user to see if it returns anything
    // We can't "buy" an authenticated session here easily, so we just stick to metadata research.

  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkPolicies();
