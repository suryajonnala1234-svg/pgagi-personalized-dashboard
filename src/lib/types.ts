export interface Article {
  url: string;
  title: string;
  description: string;
  urlToImage: string;
  source: { name: string };
  content?: string;
}

export interface SocialPost {
  id: string;
  type: string;
  author?: string;
  title?: string;
  avatar: string;
  avatarColor: string;
  content: string;
  likes: number;
  comments: number;
  timestamp: string;
  tag: string;
}
