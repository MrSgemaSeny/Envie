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
import { useActiveWallpaper } from './entities/wallpaper/api';
import { Toaster, toast } from 'sonner';
import { useEffect } from 'react';

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
  const { data: activeWallpaper } = useActiveWallpaper();
  
  const bgStyle = activeWallpaper ? {
    backgroundImage: `url(${apiClient.defaults.baseURL}/media/${activeWallpaper.filename})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : {};

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20 relative" style={bgStyle}>
      {activeWallpaper && <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />}
      <aside className="w-56 border-r border-border/50 bg-background/60 backdrop-blur-md flex flex-col p-4 flex-shrink-0 z-10 relative">
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
        </nav>
      </aside>
      <main className="flex-1 overflow-auto w-full z-10 relative">
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

