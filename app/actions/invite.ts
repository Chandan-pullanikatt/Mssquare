'use server';

import { createClient } from '@/lib/supabase/server';
import { sendInstructorInvitation } from '@/lib/email';

export async function inviteInstructor(email: string, remarks?: string) {
  const supabase = await createClient();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to enable invitations.");
  }

  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // 1. Check if user already exists in the instructors table
  const { data: existingInstructor, error: instructorFetchError } = await adminClient
    .from('instructors')
    .select('id, email, status')
    .eq('email', email)
    .maybeSingle();

  if (instructorFetchError) {
    console.error("Error checking existing instructor:", instructorFetchError);
  }

  if (existingInstructor && existingInstructor.status === 'active') {
    throw new Error(`This email address (${email}) is already registered as an active instructor.`);
  }

  // 2. Check if user already exists in auth.users
  const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
  if (listError) throw listError;

  const existingAuthUser = users.find(u => u.email === email);
  let userId = existingAuthUser?.id;

  // 3. Decide whether to invite or re-invite
  // If user doesn't exist OR user has not confirmed their email yet
  if (!existingAuthUser || !existingAuthUser.confirmed_at) {
    console.log(`Inviting/Re-inviting user: ${email}. Existing: ${!!existingAuthUser}, Confirmed: ${!!existingAuthUser?.confirmed_at}`);
    
    // Generate secure invitation link
    const { data: inviteData, error: inviteError } = await adminClient.auth.admin.generateLink({
      type: 'invite',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/auth/set-password`,
        data: {
          role: 'instructor'
        }
      }
    });

    if (inviteError) {
      console.error("Invite Link Generation Error:", inviteError.message);
      if (!existingAuthUser) throw inviteError;
    } else {
      userId = inviteData.user.id;
      
      // 3. Send custom email via Resend
      try {
        await sendInstructorInvitation({
          email: email,
          inviteLink: inviteData.properties.action_link
        });
        console.log(`Custom invitation email sent to ${email}`);
      } catch (emailErr: any) {
        console.error("Failed to send custom invitation email:", emailErr);
        throw new Error(`User was invited, but the email failed to send: ${emailErr.message || "Unknown Error"}`);
      }
    }
  }

  // 4. Add to the dedicated instructors table if not already there
  const { error: instructorError } = await adminClient
    .from('instructors')
    .upsert({
      id: userId,
      email: email,
      remarks: remarks || null,
      status: userId === existingAuthUser?.id && existingAuthUser?.confirmed_at ? 'active' : 'invited'
    }, { onConflict: 'email' });

  if (instructorError) {
    console.error("Error adding to instructors table:", instructorError);
    throw new Error("User was found/invited but could not be added to the instructors list.");
  }

  return { success: true, userId, isNew: !existingAuthUser };
}
