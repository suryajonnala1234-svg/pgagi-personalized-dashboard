import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'entertainment';

    const apiKey = process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;
    
    if (!apiKey) {
      throw new Error('TMDB API Key is missing. Please add TMDB_API_KEY to your .env.local file.');
    }

    // Search TMDB for movies related to the active category
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(category)}&api_key=${apiKey}&language=en-US&page=1&include_adult=false`
    );
    
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error('No results from TMDB');
    }

    // Map the TMDB data into our standard recommendation format
    // Take the top 5 results
    const formattedPosts = data.results.slice(0, 5).map((item: any) => ({
      id: item.id?.toString() || Math.random().toString(),
      type: 'movie',
      title: item.title,
      author: 'Movie • ' + (item.release_date ? item.release_date.split('-')[0] : 'Unknown Year'),
      avatar: '🎬',
      avatarColor: '#3b82f6',
      content: item.overview || `A highly rated movie about ${category}.`,
      likes: Math.floor(item.popularity * 100) || Math.floor(Math.random() * 50000) + 1000,
      comments: item.vote_count || Math.floor(Math.random() * 5000) + 100,
      timestamp: item.release_date || new Date().toISOString(),
      tag: 'TMDB Pick',
      // TMDB uses a specific image base URL. We use w500 for high quality.
      artwork: item.backdrop_path 
        ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` 
        : item.poster_path 
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}` 
          : undefined,
      // TMDB doesn't provide a direct trailer URL in the basic search response,
      // so we construct a TMDB page link as a fallback for the "Trailer" button.
      previewUrl: `https://www.themoviedb.org/movie/${item.id}`,
      rating: item.vote_average || 0
    }));

    return NextResponse.json({ posts: formattedPosts, total: formattedPosts.length });
  } catch (error: any) {
    console.error("Recommendations API Error:", error.message);
    
    // Fallback to a default mock if the TMDB API fails (e.g., missing API key)
    return NextResponse.json({
      posts: [
        {
          id: 'fallback-1',
          type: 'movie',
          title: 'The Social Network',
          author: 'Drama • 2010',
          avatar: '🎬',
          avatarColor: '#3b82f6',
          content: `(TMDB API Key missing or error: ${error.message}). As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea.`,
          likes: 24500,
          comments: 3102,
          timestamp: new Date().toISOString(),
          tag: 'Movie Rec',
          rating: 7.8
        }
      ]
    }, { status: 200 }); // Still return 200 so UI doesn't crash, just shows fallback
  }
}
