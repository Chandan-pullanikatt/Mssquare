import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

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

    // 2. Update Database (student_enrollments)
    const supabase = await createClient();
    const { error } = await (supabase as any)
      .from('student_enrollments')
      .insert({
        student_id,
        course_id,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        payment_status: 'success',
        amount: amount
      });

    if (error) {
      console.error('Database enrollment error:', error);
      return NextResponse.json({ error: 'Failed to record enrollment' }, { status: 500 });
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
