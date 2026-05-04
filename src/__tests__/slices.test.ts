import { describe, it, expect } from 'vitest';
import favoritesReducer, { toggleFavorite } from '../lib/features/favoritesSlice';
import { Article } from '../lib/types';

describe('Favorites Slice', () => {
  const initialState = { articles: [] };

  const mockArticle: Article = {
    title: 'Test Article',
    description: 'This is a test',
    url: 'https://example.com',
    urlToImage: 'https://example.com/image.jpg',
    source: { name: 'Test Source' }
  };

  it('should handle initial state', () => {
    expect(favoritesReducer(undefined, { type: 'unknown' })).toEqual({ articles: [] });
  });

  it('should handle toggleFavorite (adding an article)', () => {
    const actual = favoritesReducer(initialState, toggleFavorite(mockArticle));
    expect(actual.articles.length).toEqual(1);
    expect(actual.articles[0].title).toEqual('Test Article');
  });

  it('should handle toggleFavorite (removing an article)', () => {
    // Start with the article already in state
    const stateWithArticle = { articles: [mockArticle] };
    
    // Toggling it again should remove it
    const actual = favoritesReducer(stateWithArticle, toggleFavorite(mockArticle));
    expect(actual.articles.length).toEqual(0);
  });
});
