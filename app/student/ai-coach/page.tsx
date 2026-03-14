"use client";

import { useState } from "react";
import {
    Plus,
    Search,
    MoreVertical,
    Paperclip,
    Mic,
    Send,
    Sparkles,
    Zap,
    MessageSquare
} from "lucide-react";

const recentTopics = [
    { title: "Machine Learning Basics", time: "2 hours ago" },
    { title: "Calculus III Integration", time: "Yesterday" },
    { title: "History Essay Outline", time: "Oct 24, 2023" },
    { title: "Python Loops Recap", time: "Oct 22, 2023" }
];

const messages = [
    {
        role: "assistant",
        name: "MSSquare AI",
        content: "Hello Alex! I'm your MSSquare AI Assistant. I can help you with course summaries, problem solving, or scheduling your study sessions. What's on your mind today?",
        time: "TODAY"
    },
    {
        role: "user",
        name: "You",
        content: "Can you explain the difference between supervised and unsupervised learning in Machine Learning? I have a quiz tomorrow.",
        time: "TODAY"
    },
    {
        role: "assistant",
        name: "MSSquare AI",
        content: `Certainly! Think of it like this:

• **Supervised Learning:** It's like learning with a teacher. You have input data and the correct answers (labels). The goal is to learn the mapping from inputs to outputs.

• **Unsupervised Learning:** It's like exploring on your own. You have data but no labels. The goal is to find hidden patterns or structures within the data.

Would you like some specific examples for each?`,
        time: "TODAY"
    }
];

export default function AICoachPage() {
    const [input, setInput] = useState("");

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">

            {/* Left Navigation (Internal to Chat) */}
            <div className="w-64 border-r border-gray-100 flex flex-col hidden md:flex">
                <div className="p-6">
                    <button className="w-full bg-[#8b5cf6] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#8b5cf6]/20 hover:bg-[#7c3aed] transition-colors">
                        <Plus size={20} />
                        New Chat
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {[
                        { name: "Home", icon: MessageSquare, active: false },
                        { name: "AI Chat", icon: Zap, active: true },
                        { name: "Resources", icon: Sparkles, active: false },
                        { name: "Schedule", icon: MessageSquare, active: false },
                        { name: "Settings", icon: MessageSquare, active: false }
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all ${item.active
                                    ? "bg-[#f5f3ff] text-[#8b5cf6]"
                                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="text-[15px]">{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-6 mt-auto border-t border-gray-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fed7aa] overflow-hidden text-orange-800 font-bold flex items-center justify-center text-xs">
                        <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=fed7aa`} alt="Alex" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-900 truncate">Alex Johnson</div>
                        <div className="text-[11px] font-medium text-gray-400 truncate">alex.j@mssquare.edu</div>
                    </div>
                </div>
            </div>

            {/* Center Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#fafafc]">

                {/* Chat Header */}
                <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center text-white">
                            <Zap size={16} fill="white" />
                        </div>
                        <h2 className="font-bold text-gray-900">AI Assistant</h2>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-gray-600 transition-colors"><Search size={20} /></button>
                        <button className="hover:text-gray-600 transition-colors"><MoreVertical size={20} /></button>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <div className="flex justify-center">
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">Today</span>
                    </div>

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-[#f5f3ff] text-[#8b5cf6]' : 'overflow-hidden border border-gray-200 shadow-sm'
                                }`}>
                                {msg.role === 'assistant' ? (
                                    <Zap size={18} fill="#8b5cf6" />
                                ) : (
                                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=Alex&backgroundColor=fed7aa`} alt="Alex" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                <div className="text-[11px] font-bold text-gray-400 mb-1 px-1">
                                    {msg.name}
                                </div>
                                <div className={`p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${msg.role === 'assistant'
                                        ? 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                        : 'bg-[#8b5cf6] text-white rounded-tr-none text-left'
                                    }`}>
                                    {msg.content.split('\n').map((line, j) => (
                                        <p key={j} className={line.trim() === '' ? 'h-2' : ''}>
                                            {line.startsWith('•') ? <span className="block pl-2">{line}</span> : line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <div className="p-6 pt-0">
                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                                <Paperclip size={20} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-24 text-sm focus:ring-4 focus:ring-[#8b5cf6]/10 outline-none placeholder:text-gray-300 font-medium text-gray-700 shadow-xl shadow-black/[0.02] transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                                <Mic size={20} />
                            </button>
                            <button className="w-10 h-10 bg-[#8b5cf6] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20 hover:scale-105 transition-transform active:scale-95">
                                <Send size={18} className="ml-0.5" />
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest">MSSquare AI can make mistakes. Consider checking important information</p>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l border-gray-100 bg-white p-8 space-y-10 hidden lg:block">
                <div>
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-8">Recent Topics</h3>
                    <div className="space-y-8">
                        {recentTopics.map((topic, i) => (
                            <div key={i} className="group cursor-pointer">
                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#8b5cf6] transition-colors mb-2 leading-tight">{topic.title}</h4>
                                <p className="text-[11px] font-medium text-gray-400">{topic.time}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#f5f3ff] rounded-3xl p-6 border border-purple-100/50 mt-auto">
                    <div className="flex items-center gap-2 text-[#8b5cf6] font-bold text-[10px] uppercase tracking-wider mb-3">
                        <Plus size={14} className="fill-[#8b5cf6]" />
                        Pro Tip
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                        Upload your class syllabus to get a personalized study plan for the whole semester.
                    </p>
                </div>
            </div>

        </div>
    );
}
