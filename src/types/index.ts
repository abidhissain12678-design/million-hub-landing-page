export interface Task {
  id?: string;
  title: string;
  reward: string;
  description: string;
  imageUrl?: string;
  ctaText: string;
  ctaLink: string;
  youtubeUrl: string;
  ads: {
    top?: string;
    middle?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}