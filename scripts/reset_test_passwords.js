
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TEST_USERS = [
  "chandan2@gmail.com",
  "chandanpullanikatt+business@gmail.com",
  "chandanpullanikatt@gmail.com",
  "chandanpullanikatt+bizadmin@gmail.com",
  "chandanpullanikatt+cms@gmail.com",
  "test@example.com"
];

const NEW_PASSWORD = "Chandan@123";

async function resetPasswords() {
  console.log('Starting password reset for test users...');
  
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;

    for (const email of TEST_USERS) {
      const user = users.find(u => u.email === email);
      if (user) {
        console.log(`Resetting password for: ${email} (${user.id})`);
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          user.id,
          { password: NEW_PASSWORD }
        );
        if (updateError) {
          console.error(`Failed to reset password for ${email}:`, updateError.message);
        } else {
          console.log(`Successfully reset password for ${email}`);
        }
      } else {
        console.warn(`User not found in Auth system: ${email}`);
      }
    }
    console.log('Password reset process completed.');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

resetPasswords();
