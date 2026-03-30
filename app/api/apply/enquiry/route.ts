import { createAdminClient } from '@/lib/supabase/service';
import { NextResponse } from 'next/server';
import { sendEnquiryConfirmation } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, companyName, projectType, message } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const supabase = createAdminClient();

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

    if (dbError) {
      console.error('Supabase Database Insert Error (Enquiry):', dbError);
      return NextResponse.json({ error: `Database insert failed: ${dbError.message}` }, { status: 500 });
    }

    // 2. Send Confirmation Email
    try {
      await sendEnquiryConfirmation({ email, name: fullName });
    } catch (emailErr: any) {
      console.error('Non-blocking: Failed to send enquiry confirmation:', emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in enquiry application:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
