"use server";

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const getAIResponse = async (prompt: string, history: any[] = []) => {
    try {
        const messages: Groq.Chat.ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: "You are an MSSquare Technologies learning assistant. You help students with course content, assignments, and coding questions. Be concise, professional, and helpful."
            },
            ...history.map(msg => ({
                role: (msg.role === 'assistant' || msg.role === 'model') ? 'assistant' as const : 'user' as const,
                content: msg.parts ? msg.parts[0].text : msg.content
            })),
            {
                role: "user",
                content: prompt
            }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.1-8b-instant",
        });

        return completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    } catch (error: any) {
        console.error("Groq AI Error:", error);
        throw error; // Let the caller handle it (e.g., for 429 errors)
    }
};
