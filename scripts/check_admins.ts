import { createAdminClient } from '../lib/supabase/service';

async function listAdmins() {
  const supabase = createAdminClient();
  
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('email, role')
    .in('role', ['lms_admin', 'business_admin', 'cms_admin']);

  if (error) {
    console.error('Error fetching admin profiles:', error);
    return;
  }

  console.log('Current Admin Profiles:');
  console.table(profiles);
}

listAdmins();
