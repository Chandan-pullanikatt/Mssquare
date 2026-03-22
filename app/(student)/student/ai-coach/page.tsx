"use client";

import { useState, useEffect, useRef } from "react";
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

import { useAuth } from "@/components/providers/AuthProvider";
import { getAIResponse } from "@/lib/ai";

type Message = {
    role: "assistant" | "user";
    name: string;
    content: string;
    time: string;
};

export default function AICoachPage() {
    const { user } = useAuth();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            name: "MSSquare AI",
            content: `Hello ${user?.user_metadata?.name || 'there'}! I'm your MSSquare AI Coach. I can help you with course summaries, complex problem solving, or just planning your study sessions. What would you like to learn today?`,
            time: "TODAY"
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        const userPrompt = input.trim();
        if (!userPrompt || isLoading) return;
        
        if (userPrompt.length > 2000) {
            alert("Message is too long. Please keep it under 2000 characters.");
            return;
        }

        const newUserMsg: Message = {
            role: "user",
            name: user?.user_metadata?.name || "You",
            content: userPrompt,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, newUserMsg]);
        setInput("");
        setIsLoading(true);

        try {
            // Prepare history for Gemini (skip the initial assistant greeting)
            const firstUserIndex = messages.findIndex(m => m.role === 'user');
            const history = (firstUserIndex === -1 ? [] : messages.slice(firstUserIndex))
                .slice(-10)
                .map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }));

            const aiResponse = await getAIResponse(userPrompt, history);
            
            const newAiMsg: Message = {
                role: "assistant",
                name: "MSSquare AI",
                content: aiResponse,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            
            setMessages(prev => [...prev, newAiMsg]);
        } catch (error: any) {
            console.error("AI Chat Error:", error);
            let errorMessage = "I'm sorry, I hit a snag while thinking. Please make sure your Gemini API key is correctly configured in the environment.";
            
            // Check for 429 error
            if (error?.status === 429 || error?.message?.includes("429") || error?.response?.status === 429) {
                errorMessage = "AI assistant is temporarily unavailable, please try again shortly";
            }
            
            const errorMsg: Message = {
                role: "assistant",
                name: "MSSquare AI",
                content: errorMessage,
                time: "JUST NOW"
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
            
            <div className="flex-1 flex flex-col min-w-0 bg-[#fafafc]">
                {/* Chat Header */}
                <header className="h-20 border-b border-gray-100 bg-white/80 backdrop-blur-md px-10 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-purple rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-purple/20">
                            <Zap size={20} fill="white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900 font-heading text-lg tracking-tight">AI Study Coach</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Now</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <button className="p-2.5 text-gray-400 hover:text-primary-purple hover:bg-primary-purple/5 rounded-xl transition-all"><Search size={22} /></button>
                        <button className="p-2.5 text-gray-400 hover:text-primary-purple hover:bg-primary-purple/5 rounded-xl transition-all"><MoreVertical size={22} /></button>
                    </div>
                </header>

                {/* Messages Area */}
                <div ref={scrollRef} className="p-10 space-y-10">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                                msg.role === 'assistant' 
                                ? 'bg-white text-primary-purple border border-gray-100' 
                                : 'bg-primary-purple text-white shadow-primary-purple/20'
                            }`}>
                                {msg.role === 'assistant' ? (
                                    <Sparkles size={18} className="fill-primary-purple" />
                                ) : (
                                    <span className="font-black text-xs">{msg.name.charAt(0)}</span>
                                )}
                            </div>
                            <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                <div className="text-[10px] font-black text-gray-400 mb-2 px-1 uppercase tracking-widest opacity-60">
                                    {msg.name} • {msg.time}
                                </div>
                                <div className={`p-6 rounded-[2rem] text-[0.95rem] leading-relaxed shadow-sm ${
                                    msg.role === 'assistant'
                                    ? 'bg-white text-gray-700 border border-gray-50 rounded-tl-none font-medium'
                                    : 'bg-primary-purple text-white rounded-tr-none text-left font-semibold'
                                }`}>
                                    {msg.content.split('\n').map((line, j) => (
                                        <p key={j} className={line.trim() === '' ? 'h-3' : 'mb-1 last:mb-0'}>
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex gap-5">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-white border border-gray-100 text-primary-purple shadow-sm">
                                <Zap size={18} fill="currentColor" className="animate-pulse" />
                            </div>
                            <div className="max-w-[75%]">
                                <div className="text-[10px] font-black text-gray-400 mb-2 px-1 uppercase tracking-widest opacity-60">AI Coach Thinking</div>
                                <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-gray-50 shadow-sm">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-primary-purple/30 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-primary-purple/30 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-primary-purple/30 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-10 pt-0">
                    <div className="max-w-4xl mx-auto relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <button className="p-2.5 text-gray-300 hover:text-primary-purple transition-colors rounded-xl hover:bg-primary-purple/5">
                                <Plus size={22} />
                            </button>
                        </div>
                        <input
                            type="text"
                            value={input}
                            disabled={isLoading}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isLoading ? "Generating response..." : "Ask your MSSquare AI Coach anything..."}
                            className="w-full bg-white border border-gray-100 rounded-[1.75rem] py-6 pl-16 pr-28 text-[0.95rem] focus:ring-8 focus:ring-primary-purple/5 focus:border-primary-purple outline-none placeholder:text-gray-300 font-semibold text-gray-700 shadow-2xl shadow-black/[0.02] transition-all disabled:opacity-50"
                        />
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <button className="p-2.5 text-gray-300 hover:text-primary-purple transition-colors rounded-xl hover:bg-primary-purple/5">
                                <Mic size={22} />
                            </button>
                            <button 
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="w-12 h-12 bg-primary-purple text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary-purple/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 disabled:shadow-none"
                            >
                                <Send size={20} className="ml-1" />
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[9px] text-gray-400 mt-5 font-black uppercase tracking-[0.2em] opacity-50">
                        Powered by Google Gemini • Context Aware Learning
                    </p>
                </div>
            </div>
        </div>
    );
}
