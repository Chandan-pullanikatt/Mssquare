"use client";

import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I attend live classes?",
    answer: "You'll receive your class link on your registered email. Classes are held via Zoom or our LMS platform, and all sessions are recorded for replay."
  },
  {
    question: "What if I don't receive the class link?",
    answer: "Check your spam folder first. If it's not there, contact us at support@mssquaretechnologies.com or call +91 94929 82929."
  },
  {
    question: "How do I access the LMS portal?",
    answer: "You'll get access to the LMS portal in the first week of your starting month. Account creation instructions will be emailed to you by the MSsquare team."
  },
  {
    question: "How do I submit my projects?",
    answer: "You'll receive a project submission email with a direct link. Click the submit button and upload your project as a PDF or Google Drive link."
  },
  {
    question: "Do you offer a refund policy?",
    answer: "Yes. Please refer to our Refund Policy page on the website for full details and conditions. (Links to mssquaretechnologies.com/home/refund_policy)"
  },
  {
    question: "Can my startup hire MSsquare for a project?",
    answer: "Absolutely. Our Tech Consultancy arm works with early-stage startups and SMEs. Reach out via the form below or call us directly and we'll schedule a free discovery call."
  }
];

export function FAQ() {
  const revealRef = useReveal();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="bg-white pt-[60px] pb-[120px] px-[5%] relative border-b border-gray-100" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="rev inline-flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.12em] uppercase text-[#7C3AED] mb-4 justify-center">
            <span className="w-5 h-[1px] bg-[#7C3AED]"></span>
            FAQ
          </div>
          <h2 className="rev text-[clamp(2.2rem,4vw,3.2rem)] font-extrabold tracking-[-0.03em] leading-[1.1] font-heading text-gray-900">
            Common Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={`rev rev-d${index % 5 + 1} overflow-hidden transition-all duration-300 bg-gray-50 rounded-2xl ${isOpen ? 'ring-2 ring-violet-100' : ''}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                >
                  <span className={`text-[1.1rem] font-bold tracking-[-0.01em] font-heading transition-colors ${isOpen ? 'text-[#7C3AED]' : 'text-gray-900'} group-hover:text-[#7C3AED]`}>
                    {faq.question}
                  </span>
                  <div className={`transition-transform duration-300 ml-4 ${isOpen ? 'rotate-180 text-[#7C3AED]' : 'text-gray-400'}`}>
                    <ChevronDown size={22} />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 pb-6 px-6" : "grid-rows-[0fr] opacity-0 px-6"
                    }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-gray-500 text-[1rem] leading-[1.7] font-medium pr-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
