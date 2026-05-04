import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { text, type } = await request.json();
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!API_KEY) return NextResponse.json({ error: 'Missing API Key' }, { status: 500 });

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });


    let prompt = '';
    if (type === 'summarize') {
      prompt = `Summarize this news article in exactly 2 short sentences: "${text}"`;
    } else if (type === 'sentiment') {
      prompt = `Analyze the sentiment of this text and reply with exactly one word (Positive, Negative, or Neutral): "${text}"`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ result: response.text() });

    } catch (error) {
    console.error("Gemini Error:", error); // <-- Add this to see the exact error
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }

}
