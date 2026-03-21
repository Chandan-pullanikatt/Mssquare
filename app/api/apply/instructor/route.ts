import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendApplicationConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const resumeFile = formData.get('resume') as File;

    if (!resumeFile) {
      return NextResponse.json({ error: 'Resume is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Upload Resume to Supabase Storage
    const fileExt = resumeFile.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `resumes/instructors/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('applications')
      .upload(filePath, resumeFile);

    if (uploadError) throw uploadError;

    // 2. Save Data to Database
    const { error: dbError } = await supabase
      .from('instructor_applications')
      .insert({
        full_name: fullName,
        email,
        phone,
        resume_url: filePath,
        message,
      } as any);

    if (dbError) throw dbError;

    // 3. Send Confirmation Email
    await sendApplicationConfirmation({ email, name: fullName, type: 'instructor' });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error submitting application:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
