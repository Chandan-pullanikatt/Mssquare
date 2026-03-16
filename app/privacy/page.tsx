"use client";

import Link from "next/link";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
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
                        Privacy Policy
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
                        At MSSquare, accessible from mssquaretechnologies.com, one of our main priorities is the privacy of our visitors and platform users. This Privacy Policy document contains types of information that is collected and recorded by MSSquare and how we use it.
                    </p>
                    <p>
                        If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>
                        We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey, fill out a form, or participate in our courses and consultancy services. The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                    </p>
                    <ul>
                        <li><strong>Account Data:</strong> Name, email address, phone number, and password.</li>
                        <li><strong>Billing Data:</strong> Transaction details, credit card numbers, and billing addresses utilized for our EdTech and Business platforms.</li>
                        <li><strong>Interaction Data:</strong> Chat logs, forum posts, submitted projects, and general course activity.</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect in various ways, including to:
                    </p>
                    <ul>
                        <li>Provide, operate, and maintain our educational and consulting platforms.</li>
                        <li>Improve, personalize, and expand our services by analyzing usage statistics.</li>
                        <li>Process transactions and send related information, including confirmations and invoices.</li>
                        <li>Communicate with you directly, for customer service, updates, and promotional content.</li>
                        <li>Find and prevent fraud to ensure a secure environment for all users.</li>
                    </ul>

                    <h2>3. Data Security</h2>
                    <p>
                        MSSquare implements a variety of state-of-the-art security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. We utilize regular Malware Scanning, SSL encryption for sensitive data flows, and restrict data access solely to authorized personnel.
                    </p>

                    <h2>4. Cookies and Web Beacons</h2>
                    <p>
                        Like any other website, MSSquare uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
                    </p>

                    <h2>5. Third-Party Privacy Policies</h2>
                    <p>
                        MSSquare's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
                    </p>

                    <h2>6. GDPR Data Protection Rights</h2>
                    <p>
                        We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                    </p>
                    <ul>
                        <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                        <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
                        <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                    </ul>

                    <h2>7. Contact Us</h2>
                    <p>
                        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <strong>operations@mssquaretechnologies.com</strong>.
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
