import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, message, requestId, projectId } = body;

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    const { data, error } = await (supabase.from('business_enquiries') as any)
      .insert({
        user_id: user.id,
        subject,
        message,
        request_id: requestId || null,
        project_id: projectId || null,
        status: 'Open'
      } as any)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = (profile as any)?.role === 'business_admin' || (profile as any)?.role === 'cms_admin';

    let query = (supabase.from('business_enquiries') as any)
      .select('*')
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      query = query.eq('user_id', user.id);
    }

    const { data: enquiries, error } = await query;
    if (error) throw error;

    if (!enquiries || enquiries.length === 0) {
       return NextResponse.json({ data: [] });
    }

    // Manual join for profiles and users
    const userIds = [...new Set(enquiries.map((e: any) => e.user_id))];
    const [profiles, users] = await Promise.all([
      supabase.from('profiles').select('id, email').in('id', userIds),
      supabase.from('users').select('id, name').in('id', userIds)
    ]);

    const enrichedData = enquiries.map((e: any) => {
      const profile = (profiles.data as any[])?.find((p: any) => p.id === e.user_id);
      const userData = (users.data as any[])?.find((u: any) => u.id === e.user_id);
      return {
        ...e,
        profiles: {
          email: profile?.email || '',
          full_name: userData?.name || profile?.email?.split('@')[0] || 'Client'
        }
      };
    });

    return NextResponse.json({ data: enrichedData });
  } catch (error: any) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = (profile as any)?.role === 'business_admin' || (profile as any)?.role === 'cms_admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { id, admin_reply, status } = body;
    console.log('PATCH enquiries: Update data:', { id, admin_reply, status });

    if (!id) {
       return NextResponse.json({ error: 'Enquiry ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (admin_reply !== undefined) {
      updateData.admin_reply = admin_reply;
      updateData.replied_at = new Date().toISOString();
      if (!status) updateData.status = 'In Progress';
    }
    if (status) updateData.status = status;

    const { data: enquiry, error } = await (supabase.from('business_enquiries') as any)
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('PATCH enquiries: Database update error:', error);
      throw error;
    }

    const typedEnquiry = enquiry as any;
    console.log('PATCH enquiries: Database update successful');

    // Fetch profile and user data manually for email notification
    const [profileRes, userRes] = await Promise.all([
      supabase.from('profiles').select('email').eq('id', typedEnquiry.user_id).maybeSingle(),
      supabase.from('users').select('name').eq('id', typedEnquiry.user_id).maybeSingle()
    ]);

    const clientProfile = profileRes.data as any;
    const userData = userRes.data as any;
    console.log('PATCH enquiries: External data fetch:', { hasEmail: !!clientProfile?.email, hasName: !!userData?.name });

    // Send email notification if it's a reply or resolution
    if ((admin_reply || status === 'Closed') && clientProfile?.email) {
      try {
        console.log('PATCH enquiries: Attempting to send email to:', clientProfile.email);
        const { sendEnquiryReply } = await import('@/lib/email');
        await sendEnquiryReply({
          email: clientProfile.email,
          name: userData?.name || clientProfile.email.split('@')[0] || 'Client',
          subject: typedEnquiry.subject,
          isResolved: status === 'Closed'
        });
        console.log('PATCH enquiries: Email sent successfully');
      } catch (emailErr: any) {
        console.error('PATCH enquiries: Email sending failed (NON-FATAL):', emailErr);
        // We don't throw here to ensure the UI still gets the success response for the DB update
      }
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...typedEnquiry,
        profiles: {
          email: clientProfile?.email || '',
          full_name: userData?.name || clientProfile?.email?.split('@')[0] || 'Client'
        }
      } 
    });
  } catch (error: any) {
    console.error('PATCH enquiries: FATAL ERROR:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
