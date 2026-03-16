"use client";

import Link from "next/link";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-white font-sans flex flex-col items-center">

            {/* Header */}
            <header className="w-full border-b border-gray-100 flex items-center justify-between px-6 py-5 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center text-white shadow-md shadow-[#8b5cf6]/20">
                            <LayoutGrid size={16} />
                        </div>
                        <span className="font-extrabold text-lg text-slate-900 tracking-tight">MSSquare</span>
                    </Link>
                    <div className="hidden sm:block h-6 w-px bg-slate-200"></div>
                    <Link href="/" className="hidden sm:flex text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors items-center gap-1.5">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
                <div className="flex gap-6 text-sm font-semibold text-slate-500">
                    <Link href="#" className="hover:text-slate-900 transition-colors">Support</Link>
                    <Link href="#" className="hover:text-slate-900 transition-colors">Documentation</Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-4xl px-6 py-16 md:py-24 flex-1">

                {/* Title */}
                <div className="mb-16">
                    <div className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-widest mb-3">Legal Documentation</div>
                    <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mb-4">
                        Refund Policy
                    </h1>
                    <p className="text-slate-600 font-medium text-lg">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                {/* Content Formatting */}
                <div className="prose prose-lg prose-slate max-w-none text-slate-900
          prose-headings:font-extrabold prose-headings:font-heading prose-headings:text-slate-900 prose-headings:tracking-tight 
          prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-12
          prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-8
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-[#8b5cf6] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-li:text-slate-700 prose-li:marker:text-[#8b5cf6]
          prose-strong:text-slate-900 prose-strong:font-bold"
                >
                    <p>
                        At MSSquare, we strive to provide the highest quality education and mentorship. We understand that circumstances can change, and we have established this Refund Policy to be as fair as possible to both our students and our operational commitments.
                    </p>

                    <h2>1. Self-Paced Certification Programs</h2>
                    <p>
                        Our self-paced certification programs are eligible for a refund only if a refund request is raised within <strong>1 week</strong> of the purchase date.
                    </p>
                    <blockquote>
                        Please note that the registration charges, which are <strong>20% of the course fee or Rs. 1000/- (whichever is higher)</strong>, are non-refundable at any point in time.
                    </blockquote>

                    <h2>2. Mentorship Programs</h2>
                    <p>
                        Mentorship program certification programs are eligible for a refund only if a refund request is raised within <strong>1 week</strong> of the enrollment date.
                    </p>
                    <blockquote>
                        Please note that the registration charges, which are <strong>20% of the course fee or Rs. 1000/- (whichever is higher)</strong>, are non-refundable at any point in time.
                    </blockquote>

                    <h2>3. Placement Programs</h2>
                    <p>
                        Placement program certification programs are eligible for a refund only if a refund request is raised within <strong>1 week</strong> of the enrollment date.
                    </p>
                    <blockquote>
                        Please note that the registration charges, which are <strong>20% of the course fee or Rs. 1000/- (whichever is higher)</strong>, are non-refundable at any point in time.
                    </blockquote>

                    <h2>4. Refund Processing</h2>
                    <p>
                        Once your refund request is approved, the refund amount will take some time to credit to your original payment method or bank account. We appreciate your patience during this process.
                    </p>

                    <h2>5. Contact for Refunds</h2>
                    <p>
                        To initiate a refund request or for any questions regarding our policy, please contact our support team at <strong>operations@mssquaretechnologies.com</strong>.
                    </p>
                </div>
            </main>

            {/* Footer */}
            <div className="w-full">
                <Footer />
            </div>

        </div>
    );
}
