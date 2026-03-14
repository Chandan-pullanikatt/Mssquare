"use client";

import { Container } from "@/components/ui/Container";
import { WebServicesNavbar } from "@/components/layout/WebServicesNavbar";
import { motion } from "framer-motion";
import { 
  Code2, 
  Layout, 
  Rocket, 
  Lightbulb, 
  ArrowRight,
  Send,
  Globe,
  Zap,
  Users,
  Search,
  PenTool,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function WebServices() {
  return (
    <div className="w-full bg-white font-sans">
      <WebServicesNavbar />
      <div className="pt-[70px]">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-white">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-[#7C3AED] font-bold text-xs uppercase tracking-wider"
              >
                <Rocket size={14} />
                SOFTWARE DEVELOPMENT STUDIO
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight"
              >
                Build Your Product <br /> With <span className="text-[#7C3AED]">MSSquare</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-500 font-medium max-w-[550px] mx-auto lg:mx-0"
              >
                We help startups and businesses design, build, and launch digital products that people love. From ideation to deployment.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  href="/auth"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-8 py-4 rounded-xl text-[1rem] font-bold shadow-lg shadow-[#7C3AED]/20 hover:-translate-y-1 transition-all duration-300"
                >
                  Start Your Project
                  <ArrowRight size={18} />
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 rounded-xl border border-gray-200 text-gray-800 font-bold hover:bg-gray-50 transition-all">
                  View Case Studies
                </button>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 w-full max-w-2xl"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#7C3AED] to-purple-600 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
                  <img 
                    src="/assets/hero-dashboard.png" 
                    className="w-full h-auto object-cover" 
                    alt="Dashboard Showcase" 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* What We Build Section */}
      <section className="py-12 md:py-20 bg-gray-100">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">What We Build</h2>
              <p className="text-gray-500 font-medium leading-relaxed">
                Comprehensive digital solutions tailored for growth and scalability using modern technology stacks.
              </p>
            </div>
            <Link href="#" className="flex items-center gap-2 text-[#7C3AED] font-bold hover:underline mb-1">
              Explore all services
              <ArrowRight size={18} className="-rotate-45" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Startup MVP Development",
                desc: "Fast-track your idea to market with a lean, functional, and scalable MVP.",
                icon: Zap,
                bg: "bg-violet-50",
                iconColor: "text-violet-600"
              },
              {
                title: "Business Websites",
                desc: "High-converting websites that represent your brand and drive actual business results.",
                icon: Globe,
                bg: "bg-violet-50/50",
                iconColor: "text-violet-600"
              },
              {
                title: "Custom Web Apps",
                desc: "Powerful internal tools and SaaS applications built for speed and reliability.",
                icon: Code2,
                bg: "bg-violet-50/30",
                iconColor: "text-violet-600"
              },
              {
                title: "Product Consulting",
                desc: "Strategic guidance on architecture, UX design, and scaling your tech infrastructure.",
                icon: Users,
                bg: "bg-violet-50/20",
                iconColor: "text-violet-600"
              }
            ].map((service, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-10 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 h-full flex flex-col">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${service.bg} group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <service.icon size={24} className={service.iconColor} />
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed flex-grow">{service.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Our Development Process Section */}
      <section id="development-process" className="py-12 md:py-20 bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-gray-900">Our Development Process</h2>
            <p className="text-gray-500 font-medium leading-relaxed">
              A streamlined workflow designed for transparency and quality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-[1.75rem] left-[5%] right-[5%] h-[1px] bg-gray-200 -z-0"></div>
            {[
              { title: "Discovery", desc: "Requirements gathering and user research.", icon: Search },
              { title: "Planning", desc: "Architecture and UI/UX design prototype.", icon: PenTool },
              { title: "Development", desc: "Agile sprints with regular testing and updates.", icon: Code2 },
              { title: "Launch", desc: "QA, deployment, and performance monitoring.", icon: CheckCircle2 }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm text-[#7C3AED] hover:shadow-md transition-shadow">
                  <step.icon size={22} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-gray-900">{step.title}</h4>
                  <p className="text-gray-400 text-xs font-medium leading-relaxed max-w-[160px] mx-auto">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Product Showcase Section */}
      <section id="case-study" className="py-12 md:py-20 bg-white">
        <Container>
          <div className="relative rounded-[3rem] bg-[#7C3AED] overflow-hidden p-8 md:p-14 shadow-2xl shadow-[#7C3AED]/20">
            <div className="absolute top-0 right-0 w-2/3 h-full opacity-20 bg-gradient-to-l from-white/20 to-transparent"></div>
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <span className="text-white/80 font-bold text-xs uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full">CASE STUDY</span>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-white">Our Home Tuition</h2>
                </div>
                <p className="text-white/80 text-lg font-medium leading-relaxed max-w-xl">
                  A complete ecosystem for online tutoring. We built a real-time classroom platform connecting thousands of students with expert tutors.
                </p>
                <Link
                  href="https://our-home-tuition.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#7C3AED] px-6 py-3 rounded-xl font-bold hover:bg-white/90 transition-all hover:-translate-y-1"
                >
                  Visit Product
                  <ArrowRight size={18} />
                </Link>
                <div className="flex gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 min-w-[140px] border border-white/5">
                    <p className="text-white/60 text-xs font-bold mb-1 uppercase tracking-wider">Students</p>
                    <p className="text-white text-3xl font-extrabold">50k+</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 min-w-[140px] border border-white/5">
                    <p className="text-white/60 text-xs font-bold mb-1 uppercase tracking-wider">Growth</p>
                    <p className="text-white text-3xl font-extrabold">200%</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-xl">
                <div className="relative transform lg:rotate-3 shadow-2xl rounded-2xl overflow-hidden ring-8 ring-white/10 transition-transform hover:rotate-0 duration-500">
                   <img 
                    src="/assets/product-home-tuition.png" 
                    className="w-full h-auto" 
                    alt="Our Home Tuition Showcase" 
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-12 md:py-20 bg-gray-100 overflow-hidden">
        <Container>
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-extrabold text-gray-900">Technologies We Use</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[
              { name: "React", color: "text-blue-500", dot: "bg-blue-500" },
              { name: "Next.js", color: "text-gray-900", dot: "bg-gray-900" },
              { name: "Tailwind CSS", color: "text-cyan-500", dot: "bg-cyan-500" },
              { name: "Node.js", color: "text-green-500", dot: "bg-green-500" },
              { name: "Python", color: "text-yellow-600", dot: "bg-yellow-600" },
              { name: "TypeScript", color: "text-blue-600", dot: "bg-blue-600" }
            ].map((tech, i) => (
              <div key={i} className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-2 h-2 rounded-full ${tech.dot}`}></div>
                <span className={`font-bold text-sm ${tech.color}`}>{tech.name}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Form Section */}
      <section id="request-form" className="py-12 md:py-20 bg-white">
        <Container>
          <div className="flex flex-col lg:flex-row bg-[#fafafc] border border-gray-100 rounded-[3rem] shadow-2xl overflow-hidden min-h-[600px]">
            <div className="flex-[1.2] p-8 md:p-14">
              <div className="max-w-xl space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-extrabold text-gray-900">Start Your Project</h2>
                  <p className="text-gray-400 font-medium">Tell us about your idea and let&apos;s bring it to life together.</p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">Full Name</label>
                      <input type="text" placeholder="John Doe" className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">Email Address</label>
                      <input type="email" placeholder="john@example.com" className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">Company Name</label>
                      <input type="text" placeholder="Your Startup" className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">Project Type</label>
                      <div className="relative">
                        <select className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none appearance-none transition-all">
                          <option>Startup MVP</option>
                          <option>Business Website</option>
                          <option>Custom Web App</option>
                          <option>Consulting</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                          <ArrowRight size={14} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">Message</label>
                    <textarea rows={3} placeholder="Tell us more about your vision..." className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none resize-none transition-all"></textarea>
                  </div>

                  <button className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-5 rounded-xl font-extrabold tracking-wide shadow-xl shadow-[#7C3AED]/20 transition-all hover:-translate-y-1 active:scale-[0.98]">
                    Send Inquiry
                  </button>
                </form>
              </div>
            </div>
            <div className="hidden lg:block flex-1 relative bg-gray-900 overflow-hidden">
                <img 
                  src="/assets/developer-workspace.png" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60" 
                  alt="Developer Workspace" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10">
                   <div className="bg-white/95 backdrop-blur-md rounded-[2rem] p-8 space-y-5 shadow-2xl border border-white/20">
                      <p className="text-gray-900 font-extrabold text-lg leading-relaxed italic">
                        &quot;MSSquare didn&apos;t just write code; they partnered with us to define our product vision.&quot;
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-extrabold text-[10px]">
                          CEO
                        </div>
                        <div>
                          <p className="text-gray-900 font-extrabold text-sm">Alex Rivera</p>
                          <p className="text-gray-500 text-[10px] font-bold">Founder, CloudScale</p>
                        </div>
                      </div>
                   </div>
                </div>
            </div>
          </div>
        </Container>
      </section>
      </div>
    </div>
  );
}
