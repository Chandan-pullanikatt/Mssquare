"use client";

import { useState } from "react";
import { Briefcase, MapPin, ArrowRight, Zap, Target, Users, UploadCloud, CheckCircle2 } from "lucide-react";

export default function CareerPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const jobs = [
    { id: 1, role: "Senior Frontend Engineer", department: "Engineering", location: "Remote", type: "Full-Time" },
    { id: 2, role: "UI/UX Product Designer", department: "Design", location: "Hybrid / New York", type: "Full-Time" },
    { id: 3, role: "Full-Stack Instructor", department: "Education", location: "Remote", type: "Contract" },
    { id: 4, role: "Developer Advocate", department: "Marketing", location: "Remote", type: "Full-Time" },
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSelectedJob(null);
      }, 5000);
    }, 800);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-[5%] max-w-7xl mx-auto relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-cyan/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-blue/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-20 anim-fup">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-[0.75rem] font-semibold tracking-[0.12em] uppercase px-5 py-2 rounded-full mb-6 text-primary-cyan">
          <span className="w-1.5 h-1.5 bg-primary-cyan rounded-full anim-blink"></span>
          We are hiring
        </div>
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold font-heading tracking-[-0.02em] mb-4 leading-[1.1]">
          Build the <span className="text-gradient">Future</span> of Tech With Us
        </h1>
        <p className="text-gray-400 font-light text-lg mb-8 leading-relaxed">
          Join a team of passionate educators, builders, and innovators dedicated to bridging the gap between learning and building.
        </p>
        <button 
          onClick={() => document.getElementById('openings')?.scrollIntoView({ behavior: 'smooth' })}
          className="hover-btn bg-white text-black px-8 py-3.5 rounded-full text-sm font-bold tracking-wide shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all font-heading"
        >
          View Open Positions
        </button>
      </div>

      {/* Why Work With Us */}
      <div className="mb-24 anim-fup d-02">
        <h2 className="text-3xl font-extrabold font-heading text-center mb-12">Why MSsquare?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "High Impact Work", desc: "Build products that scale and train developers who will shape the future.", color: "text-primary-blue", bg: "bg-primary-blue/10" },
            { icon: Users, title: "Incredible Culture", desc: "A flat hierarchy where best ideas win. No bureaucracy, just pure building.", color: "text-primary-cyan", bg: "bg-primary-cyan/10" },
            { icon: Target, title: "Continuous Growth", desc: "Unlimited access to our courses, mentorship, and a generous learning stipend.", color: "text-primary-green", bg: "bg-primary-green/10" },
          ].map((feature, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 hover-lift hover:border-white/20 transition-all text-center flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.bg}`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
              <p className="text-gray-400 font-light leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Openings Section */}
      <div id="openings" className="pt-10 scroll-mt-20 anim-fup d-035">
        <h2 className="text-3xl font-extrabold font-heading mb-8">Current Openings</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className={`bg-white/[0.03] border rounded-3xl p-6 transition-all duration-300 ${
                selectedJob === job.id 
                  ? "border-primary-cyan shadow-[0_0_30px_rgba(6,182,212,0.1)] scale-[1.02]" 
                  : "border-white/10 hover:border-white/20 hover:bg-white/5 cursor-pointer"
              }`}
              onClick={() => setSelectedJob(job.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h3 className="text-xl font-bold font-heading text-white">{job.role}</h3>
                <span className="bg-white/10 text-xs px-3 py-1 rounded-full font-semibold tracking-wider uppercase w-fit">
                  {job.department}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6 font-light">
                <div className="flex items-center gap-1.5"><MapPin size={16} className="text-primary-cyan"/> {job.location}</div>
                <div className="flex items-center gap-1.5 border-l border-white/10 pl-4"><Briefcase size={16} className="text-primary-blue"/> {job.type}</div>
              </div>
              
              <button 
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedJob === job.id 
                    ? "bg-primary-cyan text-black" 
                    : "bg-white/5 text-white hover:bg-white/10"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedJob(job.id);
                  document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {selectedJob === job.id ? "Applying Now" : "Apply for this role"}
                <ArrowRight size={16} className={selectedJob === job.id ? "translate-x-1" : ""} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Application Form */}
      {selectedJob && (
        <div id="application-form" className="mt-16 bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700 scroll-mt-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-blue/10 blur-[100px] rounded-full pointer-events-none"></div>

          {submitted ? (
            <div className="text-center py-10 relative z-10">
              <div className="w-20 h-20 bg-primary-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary-green" />
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2">Application Received!</h3>
              <p className="text-gray-400 font-light">We'll review your profile and get back to you shortly.</p>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="mb-10">
                <h3 className="text-2xl font-bold font-heading mb-2">
                  Apply for <span className="text-primary-cyan">{jobs.find(j => j.id === selectedJob)?.role}</span>
                </h3>
                <p className="text-gray-400">Fill out the form below and attach your resume.</p>
              </div>

              <form onSubmit={handleApply} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Full Name</label>
                    <input required type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-cyan/50 focus:ring-1 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Email Address</label>
                    <input required type="email" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-cyan/50 focus:ring-1 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Phone Number</label>
                    <input required type="tel" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-cyan/50 focus:ring-1 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">LinkedIn Profile (Optional)</label>
                    <input type="url" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-cyan/50 focus:ring-1 transition-all" placeholder="https://linkedin.com/in/..." />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Portfolio / GitHub (Optional)</label>
                  <input type="url" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-cyan/50 focus:ring-1 transition-all" placeholder="https://github.com/..." />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Cover Letter</label>
                  <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-cyan/50 focus:ring-1 transition-all resize-y" placeholder="Tell us why you're a great fit..."></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Resume / CV</label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center bg-black/20 hover:bg-black/40 transition-colors cursor-pointer group">
                    <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-3 group-hover:text-primary-cyan transition-colors" />
                    <p className="text-sm text-gray-300 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX up to 5MB</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                  <button 
                    type="button" 
                    onClick={() => setSelectedJob(null)}
                    className="px-6 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors text-white text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-8 py-3 rounded-xl font-bold bg-primary-cyan text-black hover:bg-[#08c5e6] shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 text-sm hover-btn"
                  >
                    Submit Application
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
