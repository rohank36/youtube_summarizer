import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(req: NextRequest, res: NextResponse){
    try{
        const body = await req.json();
        const { transcript } = body;
        if(!transcript){    
            return NextResponse.json({ error: 'No transcript provided', status: 400 });
        }
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const sys_message = "You are an expert summarizer whose only task is to summarize the given transcripts to the best of your ability in one sentence followed by several bullet points. Each bullet point should start with an emoji."
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: sys_message }, { role: "user", content: transcript }],
            model: "gpt-4o",
        });
        const summary = completion.choices[0].message.content;
        if (summary){
            return NextResponse.json({ summary: summary, status: 200 });
        }else{
            return NextResponse.json({ error: "Summary not found in Server", status: 500});
        }
        
    }catch(error){  
        console.error("Server error creating summary:", error);
        return NextResponse.json({ error: 'Server error creating summary', status: 500 });
    }
}
