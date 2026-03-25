"use client";

import { useState } from "react";
import { X, Send, AlertCircle, CheckCircle2 } from "lucide-react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: string;
  requestId?: string;
  projectId?: string;
  initialSubject?: string;
}

export function EnquiryModal({ isOpen, onClose, onSuccess, userId, requestId, projectId, initialSubject }: EnquiryModalProps) {
  const [subject, setSubject] = useState(initialSubject || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/business/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          requestId,
          projectId,
          subject,
          message
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to submit enquiry");

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setSubject("");
        setMessage("");
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-gray-900 italic">Submit Enquiry</h2>
            <p className="text-sm text-gray-500 font-medium">Have a doubt? Our team is here to help.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center space-y-4 animate-in slide-in-from-bottom-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 italic">Query Submitted!</h3>
            <p className="text-gray-500 text-sm">We've received your doubt and will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is your doubt about?"
                  className="w-full mt-1.5 bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none transition-all placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more about your doubt..."
                  rows={4}
                  className="w-full mt-1.5 bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#8b5cf6]/20 outline-none transition-all placeholder:text-gray-300 resize-none"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8b5cf6] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-[#8b5cf6]/20 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  Send Query
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
