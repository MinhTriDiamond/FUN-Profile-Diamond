// src/lib/supabase/comments.ts
import { supabase } from '@/lib/supabase/client';

// Tạo comment mới (có thể có ảnh/video + reply)
export const createComment = async ({
  post_id,
  content,
  parent_comment_id,
  media_url,
  media_type,
}: {
  post_id: string;
  content: string;
  parent_comment_id?: string;
  media_url?: string;
  media_type?: 'image' | 'video';
}) => {
  return supabase
    .from('comments')
    .insert({
      post_id,
      content,
      parent_comment_id: parent_comment_id || null,
      media_url: media_url || null,
      media_type: media_type || null,
    })
    .select()
    .single();
};

// Like comment
export const likeComment = (comment_id: string) =>
  supabase.from('reactions').insert({ comment_id, type: 'comment' });

// Unlike comment
export const unlikeComment = async (comment_id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from('reactions')
    .delete()
    .eq('comment_id', comment_id)
    .eq('user_id', user.id);
};

// Upload ảnh/video cho comment
export const uploadCommentMedia = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36)}.${fileExt}`;
  const { error } = await supabase.storage
    .from('comment-media')
    .upload(fileName, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage
    .from('comment-media')
    .getPublicUrl(fileName);
  return publicUrl;
};

// Lấy danh sách comment (có profile + reactions)
export const getComments = (postId: string) =>
  supabase
    .from('comments')
    .select(`
      *,
      profiles (username, avatar_url),
      comment_reactions (
        *,
        profiles (username, avatar_url)
      )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });