import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Default to general US news if no query parameters are provided
  const category = searchParams.get('category') || 'general';
  const country = searchParams.get('country') || 'us';
  const page = searchParams.get('page') || '1';
  const query = searchParams.get('q') || '';
  
  // Pulls your key from .env.local automatically
  const API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  try {
    let url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&page=${page}&apiKey=${API_KEY}`;
    if (query) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&page=${page}&apiKey=${API_KEY}`;
    }
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch from NewsAPI');
    }
    
    const data = await res.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
