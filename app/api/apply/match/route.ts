import { createAdminClient } from '@/lib/supabase/service';
import { NextResponse } from 'next/server';
import { sendMatchWelcome } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Save Lead to Database (Unified Table)
    const { error: dbError } = await supabase
      .from('leads')
      .insert({ 
        email, 
        name: 'Website Lead', 
        source: 'Program Match Form' 
      } as any);

    if (dbError) {
      console.error('Supabase Database Insert Error (Match Lead):', dbError);
      return NextResponse.json({ error: `Database insert failed: ${dbError.message}` }, { status: 500 });
    }

    // 2. Notify Admin
    try {
      await supabase.from('notifications').insert({
        title: 'New Program Match Lead',
        message: `New interest from ${email} via Start Today form.`,
        target_role: 'cms_admin',
        type: 'success'
      } as any);
    } catch (notifErr) {
      console.warn('Silent failure on admin notification (Match Lead):', notifErr);
    }

    // 3. Send Welcome Email
    try {
      await sendMatchWelcome({ email });
    } catch (emailErr) {
      console.error('Non-blocking: Failed to send welcome email (Match Lead):', emailErr);
      // We don't throw here so the user sees a success message on the site
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in match lead application:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
