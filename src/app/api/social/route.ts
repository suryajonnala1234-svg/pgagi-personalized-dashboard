// src/app/api/social/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // We simulate a database or external API call delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockPosts = [
    {
      id: "1",
      platform: "Twitter",
      author: "@TechGuru",
      content: "Just tried out the new React 19 compiler. Mind blown! 🤯 #webdev #reactjs",
      likes: 1205,
    },
    {
      id: "2",
      platform: "Instagram",
      author: "design_inspo",
      content: "Glassmorphism is making a comeback in 2026. What are your thoughts on this UI trend? ✨🎨",
      likes: 843,
    }
  ];

  return NextResponse.json({ posts: mockPosts });
}
