import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEnquiryConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, companyName, projectType, message } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Save Enquiry to Database
    const { error: dbError } = await supabase
      .from('webservice_enquiries')
      .insert({
        full_name: fullName,
        email,
        company_name: companyName,
        project_type: projectType,
        message,
      } as any);

    if (dbError) throw dbError;

    // 2. Send Confirmation Email
    await sendEnquiryConfirmation({ email, name: fullName });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
