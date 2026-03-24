import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Rate limiting: 10 requests per minute per userId
// Note: This in-memory Map resets on redeployment. 
// For high-traffic production use, replace with Upstash Redis.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function isRateLimited(userId: string): boolean {
    const now = Date.now();
    const limit = 10;
    const windowMs = 60 * 1000;

    const userRate = rateLimitMap.get(userId) || { count: 0, lastReset: now };

    if (now - userRate.lastReset > windowMs) {
        userRate.count = 1;
        userRate.lastReset = now;
        rateLimitMap.set(userId, userRate);
        return false;
    }

    if (userRate.count >= limit) {
        return true;
    }

    userRate.count++;
    rateLimitMap.set(userId, userRate);
    return false;
}

async function getStudentContext(userId: string | null | undefined): Promise<string> {
    if (!userId) return "";

    try {
        const supabase = await createClient();

        // 1. Fetch student name
        const { data: userData } = await (supabase
            .from("users") as any)
            .select("name")
            .eq("id", userId)
            .single();

        const studentName = userData?.name || "Student";

        // 2. Fetch active enrollments with course title and progress
        const { data: enrollments } = await (supabase
            .from("enrollments") as any)
            .select(`
                progress,
                courses (
                    title
                )
            `)
            .eq("user_id", userId); // Use user_id as per Enrollment type

        let enrollmentsContext = "";
        if (enrollments && enrollments.length > 0) {
            enrollmentsContext = "\nActive Enrollments:\n" + enrollments.map((e: any) => 
                `- ${e.courses?.title || 'Unknown Course'}: ${e.progress}% completed`
            ).join("\n");
        }

        // 3. Fetch upcoming assignments
        const { data: assignments } = await supabase
            .from("assignments")
            .select("title, due_date")
            .order("due_date", { ascending: true })
            .limit(5);

        let assignmentsContext = "";
        if (assignments && assignments.length > 0) {
            assignmentsContext = "\nUpcoming Assignments:\n" + assignments.map((a: any) => 
                `- ${a.title} (Due: ${a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No date'})`
            ).join("\n");
        }

        return `Student Name: ${studentName}${enrollmentsContext}${assignmentsContext}`;
    } catch (error) {
        console.error("Error fetching student context:", error);
        return "";
    }
}

const MSSQUARE_KNOWLEDGE = `MSSquare Technologies is an EdTech and software dev company in Chennai. We offer courses in 10 subjects: Artificial Intelligence, Machine Learning, Data Analytics, Cyber Security, Cloud Computing, Web Development, Digital Marketing, Human Resources, AutoCAD, and Car Designing. 
Each subject has 3 program levels: 
- Certification (₹7,999, 12 weeks)
- Mastery (₹4,999, 18 weeks)
- Professional / Placement Guarantee (₹80,000, 24 weeks).
Refund policy: full refund within 7 days if under 20% course completed. Certificates issued at 100% completion. Contact: hello@mssquaretechnologies.com. Sidebar sections: Dashboard, My Courses, Recorded Sessions, Assignments, Projects, Timetable, Certifications, Payments, AI Support.`;

const BEHAVIOUR_RULES = `Instruction: only answer MSSquare-related questions, address the student by first name, use actual enrollment and assignment data when answering personal questions, never invent course names prices or policies. Politely redirect off-topic questions by saying "I'm here specifically for MSSquare questions — for anything else please reach out to hello@mssquaretechnologies.com". Keep answers concise using bullet points for steps.`;

export async function POST(req: NextRequest) {
    try {
        const { message, userId, conversationHistory } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (isRateLimited(userId)) {
            return NextResponse.json(
                { error: "Please wait a moment before sending another message" },
                { status: 429 }
            );
        }

        const studentContext = await getStudentContext(userId);

        const systemPrompt = `${MSSQUARE_KNOWLEDGE}\n\nStudent Context:\n${studentContext}\n\n${BEHAVIOUR_RULES}`;

        // Prepare messages for Groq (last 6 history + current message)
        const history = (conversationHistory || []).slice(-6).map((msg: any) => ({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
        }));

        const messages = [
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message },
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama-3.1-8b-instant",
            temperature: 0.4,
            max_tokens: 512,
        });

        const responseContent = chatCompletion.choices[0]?.message?.content || "I couldn't process that request.";

        return NextResponse.json({ response: responseContent });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        
        // Catch 429 from Groq
        if (error?.status === 429) {
            return NextResponse.json(
                { error: "AI assistant is temporarily unavailable, please try again shortly" },
                { status: 429 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong, please try again." },
            { status: 500 }
        );
    }
}
