"use client";

import { motion } from "framer-motion";
import { Share2, Twitter, Linkedin, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const currentUrl = typeof window !== "undefined" ? window.location.origin : "";
  const blogUrl = `${currentUrl}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(blogUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:text-blue-600",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      color: "hover:text-gray-600",
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(blogUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all"
        title="Share this post"
      >
        <Share2 size={20} />
      </motion.button>

      {showMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-3 space-y-2 z-50 w-48"
        >
          {shareLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all ${link.color}`}
              >
                <Icon size={18} />
                <span className="font-medium text-gray-700">{link.name}</span>
              </a>
            );
          })}

          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all"
          >
            {copied ? (
              <>
                <Check size={18} className="text-green-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  );
}
