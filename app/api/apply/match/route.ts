import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendMatchWelcome } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Save Lead to Database (Unified Table)
    const { error: dbError } = await supabase
      .from('leads')
      .insert({ 
        email, 
        name: 'Website Lead', 
        source: 'Program Match Form' 
      } as any);

    if (dbError) throw dbError;

    // 2. Notify Admin
    try {
      await supabase.from('notifications').insert({
        title: 'New Program Match Lead',
        message: `New interest from ${email} via Start Today form.`,
        target_role: 'cms_admin',
        type: 'success'
      } as any);
    } catch (notifErr) {
      console.warn('Silent failure on admin notification:', notifErr);
    }

    // 3. Send Welcome Email
    await sendMatchWelcome({ email });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error submitting match lead:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
