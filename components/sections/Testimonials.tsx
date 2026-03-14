"use client";

import { useReveal } from "@/hooks/useReveal";

export function Testimonials() {
  const revealRef = useReveal();

  const testimonials = [
    {
      stars: "★★★★★",
      text: "\"The real-world projects at MSSquare are what set them apart. I wasn't just learning; I was shipping.\"",
      avatar: "AR",
      name: "Alex Rivera",
      role: "MSSquare Student"
    },
    {
      stars: "★★★★★",
      text: "\"MSSquare delivered our MVP in record time. Their technical depth and product intuition were exactly what we needed.\"",
      avatar: "SC",
      name: "Sarah Chen",
      role: "Startup Founder"
    },
    {
      stars: "★★★★★",
      text: "\"The mentorship here is insane. You're working on code that actually matters from day one.\"",
      avatar: "JS",
      name: "Jordan Smith",
      role: "Product Designer"
    }
  ];

  return (
    <section id="testimonials" className="bg-white py-20 pb-[100px] border-b border-gray-100" ref={revealRef as React.RefObject<HTMLElement>}>
      <div className="px-[5%] max-w-[1100px] mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="rev text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.03em] leading-[1.1] mb-5 font-heading text-gray-900">
            Built by creators, for creators.
          </h2>
          <p className="rev text-gray-500 font-medium text-[1.1rem]">
            Hear from the developers who launched their careers and the businesses that scaled with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className={`rev rev-d${i + 1} flex flex-col bg-[#F5F5F7] border border-gray-100 rounded-[2rem] p-10 hover:shadow-2xl hover:shadow-[#7C3AED]/10 transition-all duration-500 group hover:-translate-y-2`}>
              <div className="text-[#fbbf24] text-[0.85rem] tracking-[0.05em] mb-6">{t.stars}</div>
              <p className="text-[1rem] leading-[1.75] text-gray-600 font-medium italic mb-8">
                {t.text}
              </p>
              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-[50px] h-[50px] rounded-2xl flex items-center justify-center text-[1rem] font-bold font-heading text-white ${i === 0 ? 'bg-[#7C3AED]' : i === 1 ? 'bg-[#9333EA]' : 'bg-[#C026D3]'
                  }`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[1rem] font-extrabold tracking-tight text-gray-900 mb-0.5">{t.name}</div>
                  <div className="text-[0.8rem] text-gray-400 font-bold">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
