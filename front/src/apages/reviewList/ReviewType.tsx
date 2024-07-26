// types.ts

export interface Review {
  id: number;
  title: string;
  content: string;
  musicalId: number;
  musicalTitle: string;
  musicalImageUrl: string;
  musicalCategory: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  owner: boolean;
  comments: Comment[];
}

interface Comment {
  id: number;
  nickname: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  owner: boolean;
}
