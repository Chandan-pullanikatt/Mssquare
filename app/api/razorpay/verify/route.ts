import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/service';

export async function POST(req: Request) {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret) {
      console.error('Razorpay key secret is missing in environment variables');
      return NextResponse.json(
        { error: 'Razorpay configuration is missing on the server.' },
        { status: 500 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      course_id,
      student_id,
      amount
    } = await req.json();

    // 1. Verify Payment Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    // 2. Update Database (student_enrollments and profiles) using Admin Client to bypass RLS
    const supabaseAdmin = createAdminClient();
    
    // Perform both updates in the same route
    const [enrollmentResult, profileResult] = await Promise.all([
      (supabaseAdmin as any)
        .from('student_enrollments')
        .insert({
          student_id,
          course_id,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          payment_status: 'success',
          amount: amount
        }),
      (supabaseAdmin as any)
        .from('profiles')
        .update({ role: 'student' })
        .eq('id', student_id)
    ]);

    if (enrollmentResult.error) {
      console.error('Database enrollment error:', enrollmentResult.error);
      return NextResponse.json({ 
        error: 'Failed to record enrollment: ' + (enrollmentResult.error.message || 'Unknown error') 
      }, { status: 500 });
    }

    if (profileResult.error) {
      console.warn('Profile role update error (non-blocking):', profileResult.error);
      // We don't fail the whole request if only the role update fails, 
      // but it's good to know.
    }

    return NextResponse.json({ success: true, message: 'Payment verified and enrollment recorded' });
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
