"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2 } from "lucide-react";
import { leadsApi } from "@/lib/api/leads";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await leadsApi.submitLead({
        name: formData.name,
        email: formData.email,
        company: "Direct Contact Form",
        message: `[Subject: ${formData.subject}] ${formData.message}`,
        source: "Contact Page"
      });
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      console.error("Contact submission error:", err);
      setError("Failed to send your message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Get in <span className="text-purple-600">Touch</span>
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Have questions about our courses or services? We're here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email Us</h3>
                <p className="text-gray-500">support@mssquare.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Call Us</h3>
                <p className="text-gray-500">+91 9492982929</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Our Office</h3>
                <p className="text-gray-500">📍 Hyderabad, India 🇮🇳</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
            {isSuccess ? (
              <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-500 mb-8">Thank you for reaching out. We'll get back to you shortly.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="text-purple-600 font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-200" 
                      placeholder="yourname" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                    <input 
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-200" 
                      placeholder="name@gmail.com" 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Subject</label>
                  <input 
                    required
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-200" 
                    placeholder="How can we help?" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Message</label>
                  <textarea 
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4} 
                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-200" 
                    placeholder="Tell us more about your inquiry..." 
                  />
                </div>
                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <MessageSquare size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-20 text-center">
          <Link href="/" className="text-purple-600 font-bold hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
