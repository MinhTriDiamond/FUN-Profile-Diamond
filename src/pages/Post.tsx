import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { PostCard } from '@/components/feed/PostCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LeftSidebar } from '@/components/feed/LeftSidebar';
import { HonorBoard } from '@/components/feed/HonorBoard';

const Post = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles (username, avatar_url),
          reactions (id, user_id),
          comments (id)
        `)
        .eq('id', postId)
        .single();

      if (error) {
        // Error fetching post - silent fail
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Video Background */}
        <div className="fixed inset-0 -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/space-background.mp4" type="video/mp4" />
          </video>
        </div>

      <Navbar />
      <main className="fixed top-28 left-0 right-0 bottom-0 overflow-hidden">
        <div className="container mx-auto px-4 h-full max-w-4xl">
          <div className="scroll-container h-full pb-6">
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </main>
    </div>
  );
  }

  if (!post) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Video Background */}
        <div className="fixed inset-0 -z-10">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/space-background.mp4" type="video/mp4" />
          </video>
        </div>

        <Navbar />
        <main className="fixed top-28 left-0 right-0 bottom-0 overflow-hidden">
          <div className="container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Post không tồn tại</h2>
              <Button onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay về trang chủ
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/space-background.mp4" type="video/mp4" />
        </video>
      </div>

      <Navbar />
      <main className="fixed top-28 left-0 right-0 bottom-0 overflow-hidden">
        <div className="container mx-auto px-4 h-full max-w-7xl" style={{ minWidth: '1200px' }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left Sidebar - Hidden on mobile */}
            <aside className="hidden lg:block lg:col-span-3 scroll-container pb-6 h-full">
              <LeftSidebar />
            </aside>

            {/* Main Content - Center */}
            <div className="lg:col-span-6 scroll-container pb-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
              <PostCard
                post={post}
                currentUserId={currentUserId}
                onPostDeleted={() => navigate('/')}
              />
            </div>

            {/* Right Sidebar - Hidden on mobile */}
            <aside className="hidden lg:block lg:col-span-3 scroll-container pb-6 h-full">
              <HonorBoard />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Post;
