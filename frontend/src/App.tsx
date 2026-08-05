import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './shared/api/client';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { FeedPage } from './pages/FeedPage/FeedPage';
import { BoardPage } from './pages/BoardPage/BoardPage';
import { IdeasPage } from './pages/IdeasPage/IdeasPage';
import { TemplatesPage } from './pages/TemplatesPage/TemplatesPage';
import { WallpaperPage } from './pages/WallpaperPage/WallpaperPage';
import { LandingPage } from './pages/LandingPage/LandingPage';
import { ForYouPage } from './pages/ForYouPage/ForYouPage';
import { useActiveWallpapers } from './entities/wallpaper/api';
import { Toaster, toast } from 'sonner';
import { useEffect, useState } from 'react';

function HealthCheck() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.get('/actuator/health').then(res => res.data)
  });

  useEffect(() => {
    if (error) {
      toast.error(`Backend Error: ${error.message}`);
    } else if (data?.status !== 'UP' && !isLoading && data) {
      toast.error(`Backend Status: ${data.status}`);
    }
  }, [error, data, isLoading]);

  return null;
}

function SidebarLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-out active:scale-[0.98] ${
        isActive
          ? 'bg-muted text-foreground'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      }`}
    >
      {children}
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { data: activeWallpapers } = useActiveWallpapers();
  const wallpapersArray = Array.isArray(activeWallpapers) ? activeWallpapers : (activeWallpapers ? [activeWallpapers] : []);
  const activeBackground = wallpapersArray.find((w: any) => !/\.gif$/i.test(w.filename));
  const activeGif = wallpapersArray.find((w: any) => /\.gif$/i.test(w.filename));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const isForYou = location.pathname === '/foryou';
  const [isMouseIdle, setIsMouseIdle] = useState(false);

  useEffect(() => {
    if (!isForYou) {
      setIsMouseIdle(false);
      return;
    }
    
    // Auto-close sidebar on the For You page for maximum immersion
    setIsSidebarOpen(false);
    
    let timeout: ReturnType<typeof setTimeout>;
    const handleMouseMove = () => {
      setIsMouseIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setIsMouseIdle(true), 1300);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    timeout = setTimeout(() => setIsMouseIdle(true), 1300);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isForYou]);

  const isVideo = activeBackground?.filename ? /\.(mp4|webm|mov)$/i.test(activeBackground.filename) : false;
  
  const bgStyle = activeBackground && !isVideo ? {
    backgroundImage: `url(${apiClient.defaults.baseURL}/media/${activeBackground.filename})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  } : {};

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 relative" style={bgStyle}>
      {activeBackground && isVideo && (
        <video
          src={`${apiClient.defaults.baseURL}/media/${activeBackground.filename}`}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          muted
          loop
          autoPlay
          playsInline
        />
      )}
      {activeBackground && <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />}
      
      {/* Collapsible Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 left-4 z-30 p-2 rounded-lg bg-background/60 border border-border/40 backdrop-blur-md hover:bg-muted text-foreground transition-all duration-300 active:scale-95 ${
          isForYou && isMouseIdle ? 'opacity-0 pointer-events-none -translate-x-4' : 'opacity-100 translate-x-0'
        }`}
        aria-label="Toggle Sidebar"
      >
        <div className="w-4 h-4 flex flex-col justify-between py-0.5">
          <span className="w-4 h-0.5 bg-foreground rounded" />
          <span className="w-4 h-0.5 bg-foreground rounded" />
          <span className="w-4 h-0.5 bg-foreground rounded" />
        </div>
      </button>

      <aside className={`transition-all duration-300 ease-in-out ${
        isSidebarOpen && !(isForYou && isMouseIdle) ? 'ml-0' : '-ml-56'
      } w-56 border-r border-border/50 p-4 pt-16 bg-background/60 backdrop-blur-md flex flex-col flex-shrink-0 z-20 relative`}>
        <div className="w-48 flex flex-col h-full flex-shrink-0">
          <div className="mb-6 px-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center">
              <div className="w-3 h-3 bg-background rounded-sm" />
            </div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">Envie</h2>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <SidebarLink to="/dashboard">Dashboard</SidebarLink>
            <SidebarLink to="/notes">Notes</SidebarLink>
            <SidebarLink to="/board">Board</SidebarLink>
            <SidebarLink to="/ideas">Ideas</SidebarLink>
            <SidebarLink to="/templates">Templates</SidebarLink>
            <SidebarLink to="/wallpaper">Wallpaper</SidebarLink>
            <SidebarLink to="/foryou">For you.</SidebarLink>
          </nav>
          
          {/* Active GIF Wallpaper in sidebar 1x1 */}
          {activeGif && (
            <div className="mt-auto pt-4 border-t border-border/10">
              <img
                src={`${apiClient.defaults.baseURL}/media/${activeGif.filename}`}
                alt="active gif"
                className="w-full aspect-square object-cover rounded-xl border border-border/40"
              />
            </div>
          )}
        </div>
      </aside>
      <main className={`flex-1 overflow-auto w-full z-10 relative transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'pl-0' : 'pl-14'
      }`}>
        {children}
      </main>
      <HealthCheck />
    </div>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/notes" element={<FeedPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/ideas" element={<IdeasPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/wallpaper" element={<WallpaperPage />} />
        <Route path="/foryou" element={<ForYouPage />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/Envie">
      <Toaster theme="dark" position="bottom-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

