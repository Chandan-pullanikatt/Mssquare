'use server';

import { createAdminClient } from '@/lib/supabase/service';
import { revalidatePath } from 'next/cache';

export async function createInstructorManual(email: string, password: string, remarks?: string) {
  const adminClient = createAdminClient();

  try {
    // 0. Check if user already exists in auth.users
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers();
    if (listError) throw listError;

    const existingAuthUser = users.find(u => u.email === email);
    let userId = existingAuthUser?.id;

    if (!existingAuthUser) {
      // 1. Create the user in Supabase Auth if they don't exist
      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          role: 'instructor'
        }
      });

      if (authError) {
        console.error("Auth creation error:", authError.message);
        throw authError;
      }
      userId = authData.user.id;
    } else {
      console.log(`User ${email} already exists in Auth, updating for ID: ${userId}`);
      // Optionally update password if provided and user exists
      if (password && userId) {
        const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, { password });
        if (updateError) console.warn("Failed to update password for existing user:", updateError.message);
      }
    }

    if (!userId) {
      throw new Error("Failed to determine or create user ID.");
    }

    // 2. Insert into profiles table
    const { error: profileError } = await (adminClient
      .from('profiles') as any)
      .upsert({
        id: userId,
        user_id: userId,
        email: email,
        role: 'instructor'
      }, { onConflict: 'id' });

    if (profileError) {
      console.error("Profile creation error:", profileError.message);
      throw profileError;
    }

    // 3. Insert into instructors table
    const { error: instructorError } = await (adminClient
      .from('instructors') as any)
      .upsert({
        id: userId,
        email: email,
        remarks: remarks || null,
        status: 'active'
      }, { onConflict: 'id' });

    if (instructorError) {
      console.error("Instructor creation error:", instructorError.message);
      throw instructorError;
    }

    revalidatePath('/admin/lms/instructors');
    
    return { success: true, userId };
  } catch (err: any) {
    console.error("Manual instructor creation failed:", err);
    throw new Error(err.message || "Failed to create instructor manually.");
  }
}
