"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, FileText } from "lucide-react";

export default function TermsAndConditionsPage() {
  const lastUpdated = "March 16, 2026";

  return (
    <div className="w-full bg-white relative">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-background">
        {/* Decorative elements similar to Hero.tsx */}
        <div className="absolute inset-0 bg-[#0B0B0F]/90 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary-purple/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-primary-blue/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="container relative z-10 mx-auto px-6 max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-[0.7rem] font-bold tracking-[0.14em] uppercase px-4 py-1.5 rounded-full mb-6">
              <ShieldCheck size={14} className="text-primary-purple" />
              Legal Documentation
            </div>
            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[1.1] tracking-[-0.03em] mb-6 font-heading text-white">
              Terms & <span className="text-primary-purple">Conditions</span>
            </h1>
            <p className="max-w-[640px] text-gray-400 text-[1.1rem] font-medium leading-[1.6]">
              Please read these terms carefully before using our services. By using MSsquare Technologies, you agree to be bound by these terms.
            </p>
            <div className="mt-8 flex items-center gap-2 text-[0.85rem] text-muted font-medium">
              <FileText size={16} />
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-slate max-w-none 
            prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900
            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:pb-4 prose-h2:border-slate-100
            prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
            prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-3
            prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-lg
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8
            prose-li:text-slate-600 prose-li:mb-2 prose-li:text-lg
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-a:text-primary-purple prose-a:font-semibold hover:prose-a:underline"
          >
            <p className="text-xl font-medium text-slate-800 mb-10 leading-relaxed">
              MSsquare Technologies Private Limited ("MSsquare Technologies," "us," "our" or "we") provides this website to you ("User") under the following terms and conditions (this "Agreement" or "Terms of Use"). Our Privacy Policy, which explains how we collect and use information from visitors to our website, is incorporated by reference in these Terms of Use.
            </p>

            <p>
              By using our website (the "Site") or submitting any information to us, you consent to and agree to be bound by these Terms of Use and our Privacy Policy. By using the Site in any manner, including but not limited to visiting or browsing the Site, you agree to be bound by this Agreement, the Privacy Policy, and all other operating rules, policies and procedures that may be published by us from time to time on the Site.
            </p>

            <p>
              This document is published in accordance with the provisions of Rule 3 (1) of the Information Technology (Intermediaries Guidelines) Rules, 2011 that require publishing the rules and regulations, Privacy Policy and Terms of Use for access or usage of the www.mssquaretechnologies.com.
            </p>

            <h2>1. Account Registration</h2>
            <p>
              If you are under the age of 18, please do not sign up for an account. If you are accessing or using our site on behalf of any entity, you represent that you are authorized to accept these Terms of Use on that entity's behalf, and that entity agrees to be responsible to MSsquare Technologies if you violate these Terms of Use.
            </p>
            <p>
              You may access some areas of our site(s) without registering. However, in order to access certain features of the Site or to post content on the Site you must register to create an account ("Account"). You must complete the registration process by providing us with current, complete and accurate information. You will not share your password, let anyone else access your Account, or do anything else that might jeopardize the security of your Account. We have the right to cancel any account at any time if we believe you are not in compliance with any or all of the terms.
            </p>

            <h2>2. Courses & Offered Payment</h2>
            <p>
              Information about courses offered and prices would be provided in the Website. You agree to pay the price for the courses registered as per the pricing schedule indicated in the Site. At the time of a payment, you need to provide accurate information regarding your account, including a valid credit card or debit card or net banking credentials, and you must certify that you are over 18 years of age and legally able to enter into a valid and binding agreement with MSsquare Technologies.
            </p>

            <h2>3. Processing & Account Payment</h2>
            <p>
              MSsquare Technologies may use third party electronic payment processors and/or financial institutions ("EPPs") to process financial transactions. You irrevocably authorize us, as necessary, to instruct such EPPs to handle such transaction and you irrevocably agree that MSsquare Technologies may give such instructions on your behalf in accordance with your requests as submitted on the Site. While availing any of the EPPs available on the Site, We will not be responsible or assume any liability, whatsoever in respect of any loss or damage arising directly or indirectly to you due to:
            </p>
            <ul>
              <li>Lack of authorization for any transactions.</li>
              <li>Any payment issues arising out of the transaction or Decline of such transaction for any reason.</li>
            </ul>
            <p>
              You understand, accept and agree that the payment facility provided us, is neither a banking nor financial service.
            </p>

            <h3>Modification of Pricing And Billing Terms</h3>
            <p>
              We reserve the right at any time to institute new prices, and to change the amount of or the basis for determining any prices or charges with respect to the any courses offered. You agree to pay all charges, including applicable taxes, in accordance with the billing terms in effect at the time the price or charge becomes payable.
            </p>

            <h2>4. Intellectual Property</h2>
            <p>
              MSsquare Technologies expressly reserves all intellectual property rights in all text, programs, products, processes, technology, content, software and other materials, which appear on this Website. The compilation (meaning the collection, arrangement and assembly) of the content on the Website is the exclusive property of MSsquare Technologies. Reproduction in whole or in part of the same is strictly prohibited without the express written permission of MSsquare Technologies.
            </p>
            <p>
              The trademarks, logo and slogans displayed on the Site including the mark MSsquare Technologies, (collectively the "Trademarks") are owned by MSsquare Technologies. Nothing on this Site should be construed as granting any license or right to use the Trademarks without written permission of MSsquare Technologies.
            </p>
            <p>
              MSsquare Technologies grants to the registered users a non-exclusive, non-transferable, revocable right to use the contents on the Site for non-profit, educational and research use only, without the right of sublicense.
            </p>

            <h2>5. Data Protection / Privacy</h2>
            <p>
              We may change this Policy at any time, in particular as needed to comply with the rules and regulations of the various governmental and regulatory organizations, or to comply with applicable laws and regulations. The revised version will be effective at the time we post it on website or inform to the User.
            </p>

            <h2>6. Restricted Actions</h2>
            <p>During the use of the Site, you shall not:</p>
            <ul>
              <li>Attempt to copy, modify, duplicate, imitate, reproduce, create derivative works from, frame, mirror, or download, all or any portion of the Site in any form or media.</li>
              <li>Attempt to decompile, disassemble, reverse engineer or otherwise attempt to discover any source code from, all or any part of the site.</li>
              <li>Sell, resell, redistribute or otherwise commercially exploit any material from this Site except for content specifically and expressly made available for redistribution.</li>
              <li>Access or use all or any part of the Site in order to build or create a product or service which is similar to, or which competes with, the business of MSsquare Technologies.</li>
              <li>Abuse the use of site in any way including for advertising or solicitation to buy or sell any products.</li>
              <li>Create or send any viruses, worms or trojan horses, flood or mail bombs, or engaging in denial of service attacks while using the Site.</li>
            </ul>

            <h2>7. Third Party Content</h2>
            <p>
              The Site may provide links to or frame third-party websites or resources and may link User automatically to sponsors’ or third party’s websites or resources. You acknowledge and agree that MSsquare Technologies is not responsible or liable for: (i) the availability or accuracy of such websites or resources; or (ii) the content, products, or services on or available from such websites or resources.
            </p>

            <h2>8. Notifications</h2>
            <p>
              You agree to MSsquare Technologies sending you notifications and important messages time to time via its websites, mobile applications, and email to provide you a better experience with the services provided by us. You agree to keep your contact information up to date.
            </p>

            <h2>9. Grievance Officer</h2>
            <p>
              In accordance with Information Technology Act 2000 and rules made there under, the contact details of the Grievance Officer are provided below:
            </p>
            <ul>
              <li><strong>Phone:</strong> +91-7981969261</li>
              <li><strong>Email:</strong> support@mssquaretechnologies.com</li>
              <li><strong>Time:</strong> 11:00 AM - 09:00 PM</li>
            </ul>

            <h2>10. No Representations or Warranties</h2>
            <p>
              Your access to the site is at your sole risk. Our services are provided on “AS IS” and “AS AVAILABLE” basis without warranties of any kind, either express or implied. MSsquare Technologies makes no representation as to the completeness or accuracy of the information provided on the Site.
            </p>

            <h2>11. Change or Termination</h2>
            <p>
              We may, without prior notice, change the Site, stop providing the Site, applications or services, or create usage limits for the Site. We may permanently or temporarily terminate or suspend your access to the Site without notice or liability, for any reason or for no reason.
            </p>
            <p>
              If any intern/employee will be terminated due to any condition from company, salary will be processed after 45 working days. If any intern/employee needs to resign, he/she needs to inform one month before; if not, they need to pay one month stipend as compensation.
            </p>

            <h2>12. Limitation of Liability</h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, NEITHER MSsquare Technologies NOR ITS AFFILIATES WILL BE LIABLE UNDER ANY THEORY OF LIABILITY FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES.
            </p>

            <h2>13. Indemnification</h2>
            <p>
              User agrees to indemnify, defend and hold harmless MSsquare Technologies and its Affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, and fees arising from or relating to your use of the Site or violation of these Terms of Use.
            </p>

            <h2>14. Jurisdiction</h2>
            <p>
              The Terms of Use shall be governed by the laws of India, and the courts at Bengaluru, India shall have exclusive jurisdiction with respect to any dispute arising hereunder.
            </p>

            <h2>15. International Use</h2>
            <p>
              The Site is controlled and operated from within India. MSsquare Technologies makes no representation that the Site is appropriate or available in locations outside of India.
            </p>

            <h2>18. Online Internship</h2>
            <p>
              <strong>Scope:</strong> The fees that we charge the students is only for training them via live classes and not internship itself. MSsquare Technologies does not charge any amount for the internship project phase as it is completely complimentary.
            </p>

            <h2>20. Refunds Policy</h2>
            <p>
              This policy governs the refunds process and will address matters arising out of situations that may require processing of refunds.
            </p>
            <ul>
              <li><strong>Self Paced Internship Program:</strong> Non-refundable and non-transferrable under any circumstances.</li>
              <li><strong>Online/Offline/Hybrid Internship Program:</strong> Non-refundable and non-transferrable. Full refunds will be issued only if MSsquare Technologies cancels the complete program.</li>
              <li><strong>Certification Programs:</strong> Refundable only if refund request is raised up to 1 week before the date of commencement and the student has not accessed the LMS. Registration charges (20% or Rs.1000/-) are non-refundable.</li>
            </ul>

            <h2>30. Change of Course</h2>
            <p>
              MSsquare Technologies allows you to change your course to an alternative course only once provided MSsquare Technologies is notified in writing at least 1 week before the commencement. A processing fee of Rs. 500/- needs to be paid.
            </p>

            <h2>32. Reschedule & Cancellation</h2>
            <p>
              If a course doesn’t begin within 10 business days of published commencement date, a student is entitled to either a full refund or can choose to join a different batch.
            </p>
            <p>
              MSsquare Technologies reserves the right to cancel any session due to Instructor unavailability or force majeure events. In case MSsquare Technologies cancels a workshop, 100% refund will be paid.
            </p>
            
            <div className="mt-16 p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Have questions about our terms?</h4>
                <p className="text-slate-600">Our legal team is here to help you understand your rights and responsibilities.</p>
              </div>
              <Link 
                href="mailto:support@mssquaretechnologies.com"
                className="whitespace-nowrap bg-primary-purple text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-purpleDark transition-colors flex items-center gap-2"
              >
                Contact Support
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
