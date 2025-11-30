import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetamaskHeader } from '@/components/wallet/MetamaskHeader';
import { MetamaskAssetsTab } from '@/components/wallet/MetamaskAssetsTab';
import { ReceiveTab } from '@/components/wallet/ReceiveTab';
import { SendTab } from '@/components/wallet/SendTab';
import { HistoryTab } from '@/components/wallet/HistoryTab';
import { LeftSidebar } from '@/components/feed/LeftSidebar';
import { HonorBoard } from '@/components/feed/HonorBoard';

const Wallet = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assets');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <img 
                  src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" 
                  alt="MetaMask" 
                  className="w-8 h-8"
                />
                Web3 Wallet
              </h1>
            </div>
            
            <div className="space-y-4">
              <div className="glass-card-light p-6 rounded-2xl">
                <MetamaskHeader 
                  onSendClick={() => setActiveTab('send')}
                />
              
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
                  <TabsContent value="assets">
                    <MetamaskAssetsTab />
                  </TabsContent>
                  
                  <TabsContent value="receive">
                    <ReceiveTab />
                  </TabsContent>
                  
                  <TabsContent value="send">
                    <SendTab />
                  </TabsContent>
                  
                  <TabsContent value="history">
                    <HistoryTab />
                  </TabsContent>
                </Tabs>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2 pt-4">
                  <button 
                    onClick={() => setActiveTab('receive')}
                    className="p-3 rounded-lg border bg-white border-gold hover:bg-primary/5 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">📥</div>
                    <p className="text-xs font-medium">Nhận</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('send')}
                    className="p-3 rounded-lg border bg-white border-gold hover:bg-primary/5 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">📤</div>
                    <p className="text-xs font-medium">Gửi</p>
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className="p-3 rounded-lg border bg-white border-gold hover:bg-primary/5 transition-colors text-center"
                  >
                    <div className="text-2xl mb-1">📜</div>
                    <p className="text-xs font-medium">Lịch sử</p>
                  </button>
                </div>
              </div>
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

export default Wallet;
