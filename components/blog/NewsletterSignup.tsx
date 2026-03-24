"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setEmail("");
    setLoading(false);

    // Reset after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white my-12"
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay Updated with Our Latest Posts
        </h2>
        <p className="text-blue-100 mb-8 text-lg">
          Subscribe to our newsletter and get the latest insights, stories, and updates delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-100 outline-none focus:border-white transition-all"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || submitted}
            className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-75"
          >
            {submitted ? (
              <>
                <Check size={20} />
                Subscribed!
              </>
            ) : loading ? (
              "Subscribing..."
            ) : (
              <>
                Subscribe
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-blue-100 text-sm mt-4">
          No spam, just great content. Unsubscribe anytime.
        </p>
      </div>
    </motion.section>
  );
}
