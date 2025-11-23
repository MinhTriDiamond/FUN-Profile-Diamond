// src/types/comment.ts
export type Comment = {
  id: string;
  profile_id: string;
  post_id: string;
  content: string;
  parent_comment_id: string | null;
  created_at: string;
  media_url?: string;
  media_type?: 'image' | 'video' | null;

  // relations
  profiles: {
    username: string;
    avatar_url?: string;
  };
  comment_reactions: CommentReaction[];
  _count?: { comment_reactions: number };
};

export type CommentReaction = {
  id: string;
  user_id: string;
  comment_id: string;
  type: 'comment';
  profiles: { username: string; avatar_url?: string };
};