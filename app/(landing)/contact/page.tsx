import Link from "next/link";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export default function ContactPage() {
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
                <p className="text-gray-500">+91 62384 81236</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Our Office</h3>
                <p className="text-gray-500">Cyber City, Kochi, Kerala, India</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                  <input className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-200" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                  <input className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-200" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Subject</label>
                <input className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-200" placeholder="How can we help?" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Message</label>
                <textarea rows={4} className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-200" placeholder="Tell us more about your inquiry..." />
              </div>
              <button className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                Send Message
              </button>
            </form>
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
