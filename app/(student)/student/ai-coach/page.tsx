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

import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useRef } from "react";

import { getGeminiResponse } from "@/lib/gemini";

export default function AICoachPage() {
    const { user } = useAuth();
    const [input, setInput] = useState("");
    const [messagesState, setMessages] = useState(messages);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messagesState]);

    const handleSend = async () => {
        const userPrompt = input.trim();
        if (userPrompt.length > 2000) {
            alert("Message is too long. Please keep it under 2000 characters.");
            return;
        }
        const newUserMsg = {
            role: "user",
            name: user?.user_metadata?.full_name || "You",
            content: userPrompt,
            time: "JUST NOW"
        };
        
        setMessages(prev => [...prev, newUserMsg]);
        setInput("");
        setIsLoading(true);

        try {
            // Convert messagesState to Gemini history format if needed
            // For now, simple prompt
            const aiResponse = await getGeminiResponse(userPrompt);
            
            const newAiMsg = {
                role: "assistant",
                name: "MSSquare AI",
                content: aiResponse,
                time: "JUST NOW"
            };
            
            setMessages(prev => [...prev, newAiMsg]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative">

            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#fafafc]">

                {/* Chat Header */}
                <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center text-white">
                            <Zap size={16} fill="white" />
                        </div>
                        <h2 className="font-bold text-gray-900 font-heading">AI Assistant</h2>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-gray-600 transition-colors"><Search size={20} /></button>
                        <button className="hover:text-gray-600 transition-colors"><MoreVertical size={20} /></button>
                    </div>
                </header>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="flex justify-center mb-4">
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">Chat History</span>
                    </div>

                    {messagesState.map((msg, i) => (
                        <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-[#f5f3ff] text-[#8b5cf6]' : 'overflow-hidden border border-gray-200 shadow-sm'
                                }`}>
                                {msg.role === 'assistant' ? (
                                    <Zap size={18} fill="#8b5cf6" />
                                ) : (
                                    <img src={user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.email || 'Alex'}&backgroundColor=fed7aa`} alt="User" className="w-full h-full object-cover" />
                                )}
                            </div>
                            <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                <div className="text-[11px] font-bold text-gray-400 mb-2 px-1">
                                    {msg.role === 'user' ? (user?.user_metadata?.full_name || "You") : msg.name}
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
                    
                    {isLoading && (
                        <div className="flex gap-4">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#f5f3ff] text-[#8b5cf6]">
                                <Zap size={18} fill="#8b5cf6" className="animate-pulse" />
                            </div>
                            <div className="max-w-[80%]">
                                <div className="text-[11px] font-bold text-gray-400 mb-2 px-1">MSSquare AI</div>
                                <div className="bg-white p-5 rounded-[1.5rem] rounded-tl-none border border-gray-100 shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input */}
                <div className="p-8 pt-0">
                    <div className="max-w-4xl mx-auto relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                                <Paperclip size={20} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={input}
                            disabled={isLoading}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isLoading ? "AI is thinking..." : "Type your message here..."}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-24 text-sm focus:ring-4 focus:ring-[#8b5cf6]/10 outline-none placeholder:text-gray-300 font-medium text-gray-700 shadow-xl shadow-black/[0.02] transition-all disabled:opacity-50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                                <Mic size={20} />
                            </button>
                            <button 
                                onClick={handleSend}
                                disabled={isLoading}
                                className="w-10 h-10 bg-[#8b5cf6] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#8b5cf6]/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                            >
                                <Send size={18} className="ml-0.5" />
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest leading-loose">MSSquare AI can make mistakes. Consider checking important information</p>
                </div>
            </div>

        </div>
    );
}
