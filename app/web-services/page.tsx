"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { WebServicesNavbar } from "@/components/layout/WebServicesNavbar";
import { motion } from "framer-motion";
import { websiteApi } from "@/lib/api/website";
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
  CheckCircle2,
  Database,
  Smartphone,
  Server,
  Cloud,
  Github,
  Monitor,
  Terminal,
  PenTool
} from "lucide-react";
import Link from "next/link";

export default function WebServices() {
  const [content, setContent] = useState<any>({
    hero: {
      badge: "SOFTWARE DEVELOPMENT STUDIO",
      title: "Build Your Product With MSSquare",
      subtitle: "We help startups and businesses design, build, and launch digital products that people love. From ideation to deployment.",
    },
    services: [
      { title: "Startup MVP Development", desc: "Fast-track your idea to market with a lean, functional, and scalable MVP.", image: "/assets/services/startup-mvp.png" },
      { title: "Business Websites", desc: "High-converting websites that represent your brand and drive actual business results.", image: "/assets/services/website-dev.png" },
      { title: "Custom Web Apps", desc: "Powerful internal tools and SaaS applications built for speed and reliability.", image: "/assets/services/webapp-dev.png" },
      { title: "Product Consulting", desc: "Strategic guidance on architecture, UX design, and scaling your tech infrastructure.", image: "/assets/services/product-consulting.png" }
    ],
    projects: [
      { title: "Our Home Tuition", headline: "A complete ecosystem for online tutoring.", desc: "Connecting thousands of students with expert tutors in real-time.", image: "/assets/projects/home-tuition-v2.png", link: "https://our-home-tuition.vercel.app/", stats: "50k+ Users" },
      { title: "SwiftShop", headline: "Luxury fashion e-commerce platform.", desc: "A high-performance luxury marketplace with seamless checkout flows.", image: "/assets/projects/cloth-shop.png", link: "#", stats: "Global Reach" },
      { title: "Examineer", headline: "Secure & scalable examination portal.", desc: "A robust testing platform with proctoring for large-scale assessments.", image: "/assets/projects/exam-lms.png", link: "#", stats: "Proctoring Enabled" }
    ],
    techStack: [
      { name: "React / Next.js", color: "text-blue-600" },
      { name: "Tailwind CSS", color: "text-cyan-500" },
      { name: "Node.js", color: "text-green-600" },
      { name: "Python", color: "text-blue-700" },
      { name: "TypeScript", color: "text-blue-500" },
      { name: "PostgreSQL", color: "text-indigo-600" },
      { name: "MongoDB", color: "text-green-500" },
      { name: "AWS / Cloud", color: "text-orange-500" },
      { name: "Mobile (Flutter)", color: "text-cyan-600" },
      { name: "UI/UX Design", color: "text-pink-600" },
      { name: "CI/CD / GitHub", color: "text-gray-900" }
    ]
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    projectType: "Startup MVP",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await websiteApi.getSection("webservices_content");
        if (data?.content_json) {
          setContent(data.content_json);
        }
      } catch (err) {
        console.error("Failed to fetch webservices content", err);
      }
    };
    fetchContent();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/apply/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Submission failed");
      }

      setIsSubmitting(false);
      setShowSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        companyName: "",
        projectType: "Startup MVP",
        message: ""
      });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error: any) {
      console.error("Enquiry Submission Error:", error);
      alert(`Error: ${error.message || "Something went wrong. Please try again."}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white font-sans">
      <WebServicesNavbar />
      <div className="pt-[70px]">
      {/* Hero Section */}
      <section className="pt-8 md:pt-12 pb-12 md:pb-16 bg-white overflow-hidden">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 relative">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 text-[#7C3AED] font-bold text-xs uppercase tracking-wider"
              >
                <Rocket size={14} />
                {content.hero.badge}
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight"
              >
                {content.hero.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-500 font-medium max-w-[550px] mx-auto lg:mx-0"
              >
                {content.hero.subtitle}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  href="/auth?portal=business_client"
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
                <div className="absolute -inset-1 bg-gradient-to-r from-[#7C3AED] to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-200">
                  <img 
                    src="/assets/web-services-hero.png" 
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700" 
                    alt="Software Studio Hero" 
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.services.map((service: any, i: number) => {
              const icons = [Zap, Globe, Code2, Users];
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="group bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2 flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={service.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={service.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                      <Icon size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="font-extrabold text-xl text-gray-900 mb-4 font-heading group-hover:text-violet-600 transition-colors uppercase tracking-tight">{service.title}</h3>
                    <p className="text-gray-500 text-[0.95rem] font-medium leading-relaxed mb-6">{service.desc}</p>

                  </div>
                </div>
              );
            })}
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
                  <h4 className="font-extrabold text-gray-900 text-lg">{step.title}</h4>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[180px] mx-auto">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Project Showcase Section */}
      <section id="case-study" className="py-12 md:py-16 bg-white overflow-hidden">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
             <span className="text-violet-600 font-bold text-xs uppercase tracking-[0.2em]">Featured Selection</span>
             <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-heading">Digital Success Stories</h2>
             <p className="text-gray-500 font-medium">From concept to production-grade platforms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.projects.map((project: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                   <img 
                    src={project.image} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={project.title} 
                  />
                  <div className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm text-[0.65rem] font-bold text-violet-600 uppercase tracking-widest border border-white/50">
                    {project.stats}
                  </div>
                </div>
                <div className="p-10 flex flex-col flex-grow">
                   <span className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">{project.title}</span>
                   <h3 className="text-2xl font-extrabold text-gray-900 mb-4 font-heading group-hover:text-violet-600 transition-colors leading-tight">{project.headline}</h3>
                   <p className="text-gray-500 text-[0.95rem] font-medium leading-relaxed mb-8">{project.desc}</p>
                   <div className="mt-auto">
                      <Link
                        href={project.link}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-violet-600 font-extrabold hover:gap-3 transition-all underline underline-offset-8"
                      >
                        Visit Case Study
                        <ArrowRight size={18} />
                      </Link>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-10 bg-gray-50 overflow-hidden">
        <Container>
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Technologies We Use</h2>
          </div>

          <div className="relative w-full overflow-hidden space-y-4">
            <style>{`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              @keyframes scroll-reverse {
                0% { transform: translateX(-50%); }
                100% { transform: translateX(0); }
              }
              .animate-scroll {
                display: flex;
                width: max-content;
                animation: scroll 25s linear infinite;
              }
              .animate-scroll-reverse {
                display: flex;
                width: max-content;
                animation: scroll-reverse 25s linear infinite;
              }
              .animate-scroll:hover, .animate-scroll-reverse:hover {
                animation-play-state: paused;
              }
            `}</style>
            
            {/* Row 1 */}
            <div className="animate-scroll gap-4 px-2">
              {[...content.techStack.slice(0, 6), ...content.techStack.slice(0, 6)].map((tech: any, i: number) => {
                const icons = [Globe, Zap, Terminal, Code2, Code2, Database];
                const Icon = icons[i % icons.length];
                return (
                  <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group whitespace-nowrap min-w-[200px]">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 group-hover:bg-violet-50 transition-colors`}>
                      <Icon size={18} className={`${tech.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <span className={`font-bold text-[0.95rem] tracking-tight text-gray-800`}>{tech.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Row 2 */}
            <div className="animate-scroll-reverse gap-4 px-2">
              {[...content.techStack.slice(6), ...content.techStack.slice(6)].map((tech: any, i: number) => {
                const icons = [Database, Cloud, Smartphone, Layout, Github];
                const Icon = icons[i % icons.length];
                return (
                  <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group whitespace-nowrap min-w-[200px]">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 group-hover:bg-violet-50 transition-colors`}>
                      <Icon size={18} className={`${tech.color} group-hover:scale-110 transition-transform`} />
                    </div>
                    <span className={`font-bold text-[0.95rem] tracking-tight text-gray-800`}>{tech.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Fades for smooth entry/exit - Reduced opacity/width as requested */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>
          </div>
        </Container>
      </section>

      {/* Form Section */}
      <section id="request-form" className="py-12 md:py-20 bg-white">
        <Container>
          <div className="flex flex-col lg:flex-row bg-[#fafafc] border border-gray-100 rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
            <div className="flex-[1.2] p-8 md:p-14">
              <div className="max-w-xl space-y-10">
                <div className="space-y-4">
                  <h2 className="text-4xl font-extrabold text-gray-900">Start Your Project</h2>
                  <p className="text-gray-400 font-medium">Tell us about your idea and let&apos;s bring it to life together.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">Full Name</label>
                      <input
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">Email Address</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">Company Name</label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your Startup"
                        className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-900 uppercase tracking-widest pl-1">Project Type</label>
                      <div className="relative">
                        <select
                          name="projectType"
                          value={formData.projectType}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none appearance-none transition-all"
                        >
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
                    <textarea
                      rows={3}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your vision..."
                      className="w-full bg-white border border-gray-200 rounded-xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-[#7C3AED]/10 focus:border-[#7C3AED] outline-none resize-none transition-all"
                    ></textarea>
                  </div>

                  <button
                    disabled={isSubmitting}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-5 rounded-xl font-extrabold tracking-wide shadow-xl shadow-[#7C3AED]/20 transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : showSuccess ? (
                      <>
                        <CheckCircle2 size={18} />
                        Enquiry Sent!
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Inquiry
                      </>
                    )}
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
                   <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 space-y-5 shadow-2xl border border-white/20">
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
