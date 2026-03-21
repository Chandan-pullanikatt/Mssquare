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

    // 1. Save Lead to Database
    const { error: dbError } = await supabase
      .from('program_match_leads')
      .insert({ email } as any);

    if (dbError) throw dbError;

    // 2. Send Welcome Email
    await sendMatchWelcome({ email });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error submitting match lead:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
