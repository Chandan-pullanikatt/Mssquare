"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck,
  CreditCard,
  Loader2,
  ArrowLeft,
  Info,
  BadgeCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { coursesApi } from "@/lib/api/courses";
import { Course } from "@/types/database";
import { supabase } from "@/lib/supabase/client";

// Declare Razorpay on window for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CoursePaymentPage() {
  const params = useParams() as { courseId: string };
  const courseId = params?.courseId;
  const router = useRouter();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!courseId) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        const courseData = await coursesApi.getCourseById(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error("Error loading payment page:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!course || !user) return;
    
    setProcessing(true);
    
    try {
      // 1. Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setProcessing(false);
        return;
      }

      // 1.5. Validate minimum amount for Razorpay (1 INR = 100 paise)
      if (course.price < 1) {
        alert("The price of this course is too low for online payment. Please contact support or select a different course.");
        setLoading(false);
        return;
      }

      // 2. Create order on backend
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: course.price,
          currency: "INR",
          receipt: `rcpt_${courseId.slice(-8)}_${user.id.slice(-8)}`,
        }),
      });

      const contentType = orderRes.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await orderRes.text();
        console.error("API returned non-JSON response:", text);
        throw new Error("Server returned an invalid response (not JSON). This usually happens if there is a server-side error or missing configuration.");
      }

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      // 3. Launch Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MSSquare",
        description: `Enrollment for ${course.title}`,
        // image: "/logo.png", // Removed to prevent CORS errors on localhost
        order_id: orderData.id,
        handler: async function (response: any) {
          // Verification logic
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                course_id: courseId,
                student_id: user.id,
                amount: course.price,
              }),
            });

            const contentType = verifyRes.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              throw new Error("Server returned an invalid verification response.");
            }

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              router.push("/student/my-courses?success=true");
            } else {
              throw new Error(verifyData.error);
            }
          } catch (err: any) {
            alert("Verification Failed: " + err.message);
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
          contact: "",
        },
        theme: {
          color: "#8b5cf6",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response: any) {
        setProcessing(false);
        alert("Payment Failed: " + response.error.description);
      });

    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.message || "Something went wrong");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#8b5cf6] animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 mb-6 text-center">We couldn't load the course details. Please try again.</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl bg-[#8b5cf6] text-white font-bold hover:shadow-lg transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const taxes = course.price * 0.18; // 18% GST placeholder
  const totalAmount = course.price + taxes;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12 pt-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 font-bold hover:text-[#8b5cf6] transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Course Detail
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Section: Course Info */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-[2.5rem] p-8 md:p-10 shadow-sm"
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-48 h- 32 relative rounded-2xl overflow-hidden shadow-md shrink-0">
                  {course.thumbnail ? (
                    <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                      <BookOpen size={40} />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#8b5cf6] text-[10px] font-black uppercase tracking-wider">
                    <BadgeCheck size={14} />
                    <span>Selected Program</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                    {course.title}
                  </h1>
                  <p className="text-sm font-medium text-gray-500 line-clamp-2">
                    {course.description}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10 p-6 bg-slate-50/50 rounded-3xl border border-gray-100/50">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Instructor</p>
                  <p className="text-sm font-bold text-gray-900">MSSquare Expert</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Duration</p>
                  <p className="text-sm font-bold text-gray-900">{course.duration || "12 Weeks"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Access</p>
                  <p className="text-sm font-bold text-gray-900">Lifetime</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Certificate</p>
                  <p className="text-sm font-bold text-gray-900">Included</p>
                </div>
              </div>

              <div className="mt-10 space-y-6">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                  <Info size={20} className="text-[#8b5cf6]" />
                  What you'll get
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Full access to all video lectures",
                    "Hands-on projects & assignments",
                    "Industry recognized certification",
                    "Dedicated doubt clearing sessions",
                    "Career guidance & networking",
                    "Downloadable resource materials"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl flex items-start gap-4">
               <ShieldCheck size={24} className="text-blue-500 shrink-0 mt-1" />
               <div>
                 <p className="text-sm font-black text-blue-900 mb-1">Secure Checkout</p>
                 <p className="text-xs font-medium text-blue-700/80 leading-relaxed">
                   Your payment is processed securely via Razorpay. We do not store your credit card information. All transactions are encrypted and protected.
                 </p>
               </div>
            </div>
          </div>

          {/* Right Section: Payment Card */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl p-8 md:p-10 sticky top-10"
            >
              <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-tight">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-bold text-gray-500">Course Price</span>
                  <span className="text-sm font-black text-gray-900">₹{course.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm font-bold text-gray-500">GST (18%)</span>
                  <span className="text-sm font-black text-gray-900">₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-6">
                  <span className="text-lg font-black text-gray-900">Total Amount</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-[#8b5cf6]">₹{totalAmount.toLocaleString()}</span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Inclusive of all taxes</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 space-y-4">
                <button 
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full py-5 rounded-2xl bg-[#8b5cf6] text-white font-black text-sm uppercase tracking-wider hover:bg-[#7c3aed] shadow-xl shadow-[#8b5cf6]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {processing ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      Pay with Razorpay
                      <CreditCard size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <button className="w-full py-5 rounded-2xl border-2 border-slate-100 text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-gray-200 hover:text-gray-600 transition-all flex items-center justify-center gap-2">
                  Have a Promo Code? <ChevronRight size={14} />
                </button>
              </div>

              <div className="mt-10 flex flex-col items-center gap-4 py-6 border-t border-gray-50">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Guaranteed Safe Checkout</p>
                <div className="flex items-center gap-4 opacity-30 grayscale">
                   {/* Placeholder for payment logos */}
                   <div className="w-10 h-6 bg-slate-400 rounded-md" />
                   <div className="w-10 h-6 bg-slate-400 rounded-md" />
                   <div className="w-10 h-6 bg-slate-400 rounded-md" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
