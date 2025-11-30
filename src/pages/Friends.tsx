import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { FriendsList } from '@/components/friends/FriendsList';
import { Skeleton } from '@/components/ui/skeleton';
import { LeftSidebar } from '@/components/feed/LeftSidebar';
import { HonorBoard } from '@/components/feed/HonorBoard';

const Friends = () => {
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }
      
      setCurrentUserId(session.user.id);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setCurrentUserId(session.user.id);
        setLoading(false);
      } else {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
        <main className="container max-w-4xl py-8">
          <Skeleton className="h-96 w-full" />
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
              <div className="glass-card-light p-6 rounded-2xl">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">Friends</h1>
                <FriendsList userId={currentUserId} />
              </div>
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

export default Friends;
