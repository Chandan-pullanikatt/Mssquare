"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  HelpCircle,
  LayoutGrid,
  Lock,
  ShieldCheck,
  ChevronRight,
  User,
  ScanLine,
  Building
} from "lucide-react";

export default function CheckoutPage() {
  const [activeTab, setActiveTab] = useState("card");

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col items-center">

      {/* Top Header */}
      <header className="w-full bg-white border-b border-gray-100 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center text-white shadow-md shadow-[#8b5cf6]/20">
            <LayoutGrid size={16} />
          </div>
          <span className="font-extrabold text-lg text-gray-900 tracking-tight">MSSquare</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-[13px] font-bold text-gray-500">
          <Link href="#" className="hover:text-gray-900 transition-colors">Courses</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">My Learning</Link>
          <Link href="#" className="hover:text-gray-900 transition-colors">Support</Link>
        </div>
        <div className="w-10 h-10 rounded-full bg-orange-100 flex flex-col items-center justify-end overflow-hidden border border-orange-200 cursor-pointer">
          <div className="w-4 h-4 rounded-full bg-orange-200 mt-1"></div>
          <div className="w-7 h-5 bg-orange-200 rounded-t-xl mt-0.5"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-5xl px-6 py-10 flex-1">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-bold text-gray-400 mb-6 tracking-wide">
          <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <ChevronRight size={14} className="stroke-[3]" />
          <span className="text-[#8b5cf6]">Checkout</span>
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold font-heading text-gray-900 tracking-tight mb-2">
            Secure Checkout
          </h1>
          <p className="text-[15px] text-gray-500 font-medium">
            Review your order and complete the payment to start learning
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left Column - Order Summary */}
          <div className="w-full lg:w-[420px] space-y-6">

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6]">
                  <CreditCard size={16} className="stroke-[2.5]" />
                </div>
                <h2 className="text-xl font-bold font-heading text-gray-900">Order Summary</h2>
              </div>

              {/* Product Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center shrink-0 border border-teal-200 relative overflow-hidden">
                  <div className="text-[6px] font-bold text-teal-800 text-center uppercase tracking-widest opacity-40">
                    Full Stack<br />Web Dev
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#8b5cf6] uppercase tracking-widest mb-1">Professional Certificate</div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">Full Stack Web Dev</h3>
                  <p className="text-xs font-semibold text-gray-500">24 Modules • Lifetime Access</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-500">Base Price</span>
                  <span className="text-gray-900">$499.00</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-500">GST (18%)</span>
                  <span className="text-gray-900">$89.82</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-gray-500">Platform Fee</span>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">Free</span>
                </div>
              </div>

              <hr className="border-gray-100 mb-6" />

              {/* Total */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-400 mb-1">Total Amount</div>
                  <div className="text-3xl font-extrabold text-gray-900 tracking-tight">$588.82</div>
                </div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  USD
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6] shrink-0">
                  <ShieldCheck size={16} className="fill-[#8b5cf6] text-white" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-gray-900 leading-tight">Secure SSL</div>
                  <div className="text-[10px] font-medium text-gray-400">256-bit Encryption</div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ff] flex items-center justify-center text-[#8b5cf6] shrink-0">
                  <CheckCircle2 size={16} className="fill-[#8b5cf6] text-white" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-gray-900 leading-tight">Refund Policy</div>
                  <div className="text-[10px] font-medium text-gray-400">7-Day Guarantee</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Payment Details */}
          <div className="flex-1 space-y-6">

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">

              {/* Payment Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setActiveTab("card")}
                  className={`flex-1 py-5 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${activeTab === 'card' ? 'text-[#8b5cf6] border-b-2 border-[#8b5cf6]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <CreditCard size={18} />
                  Card
                </button>
                <button
                  onClick={() => setActiveTab("upi")}
                  className={`flex-1 py-5 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${activeTab === 'upi' ? 'text-[#8b5cf6] border-b-2 border-[#8b5cf6]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <ScanLine size={18} />
                  UPI
                </button>
                <button
                  onClick={() => setActiveTab("netbanking")}
                  className={`flex-1 py-5 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${activeTab === 'netbanking' ? 'text-[#8b5cf6] border-b-2 border-[#8b5cf6]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Building size={18} />
                  Net Banking
                </button>
              </div>

              <div className="p-6 lg:p-8 space-y-6">

                {activeTab === "card" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6] transition-colors"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-700 ml-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl pl-10 pr-20 py-3 text-[15px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6] transition-colors"
                        />
                        <CreditCard size={18} className="absolute left-3.5 top-3.5 text-gray-400" />
                        <div className="absolute right-3 top-3.5 flex gap-1">
                          <div className="w-8 h-5 bg-gray-200 rounded"></div>
                          <div className="w-8 h-5 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-700 ml-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM / YY"
                          className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6] transition-colors"
                        />
                      </div>
                      <div className="space-y-2 relative">
                        <label className="text-xs font-bold text-gray-700 ml-1">CVV</label>
                        <div className="relative">
                          <input
                            type="password"
                            placeholder="•••"
                            className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#8b5cf6] transition-colors"
                          />
                          <HelpCircle size={16} className="absolute right-3.5 top-3.5 text-gray-300 fill-gray-300 text-white cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2">
                      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-[#8b5cf6] focus:ring-[#8b5cf6]" />
                      <p className="text-xs font-medium text-gray-500 leading-relaxed">
                        Save card for future payments. Your information is encrypted and never stored in plain text.
                      </p>
                    </div>

                    <button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold transition-all shadow-lg shadow-[#8b5cf6]/20 mt-4">
                      <Lock size={16} />
                      Pay $588.82 Now
                    </button>

                    <p className="text-center text-[10px] font-bold text-gray-400 flex items-center justify-center gap-1.5 mt-4">
                      <ShieldCheck size={12} />
                      All transactions are secured by 256-bit SSL encryption.
                    </p>
                  </>
                )}

                {activeTab !== "card" && (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-sm font-bold text-gray-400">Payment method integration goes here.</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 flex items-center justify-center gap-3 py-6 border-t border-gray-100">
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Fast UPI Checkout */}
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-gray-100 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="w-4 h-4 bg-gray-400 shrink-0"></div>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900">Fast UPI Checkout</h4>
                  <p className="text-[11px] font-medium text-gray-400">Scan QR to pay instantly</p>
                </div>
              </div>
              <button className="text-[13px] font-bold text-[#8b5cf6] hover:underline">
                Switch to UPI
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100 mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
            <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[8px]">C</div>
            {new Date().getFullYear()} MSSquare Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-6 text-[11px] font-bold text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
