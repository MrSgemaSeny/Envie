import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './shared/api/client';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { FeedPage } from './pages/FeedPage/FeedPage';
import { BoardPage } from './pages/BoardPage/BoardPage';
import { IdeasPage } from './pages/IdeasPage/IdeasPage';
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
      className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ease-out active:scale-95 ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-input hover:text-foreground'
      }`}
    >
      {children}
    </Link>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <aside className="w-64 border-r border-border bg-card flex flex-col p-4 flex-shrink-0">
        <div className="mb-8 px-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">Envie</h2>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <SidebarLink to="/">Dashboard</SidebarLink>
          <SidebarLink to="/notes">Notes</SidebarLink>
          <SidebarLink to="/board">Board</SidebarLink>
          <SidebarLink to="/ideas">Ideas</SidebarLink>
          <SidebarLink to="/templates">Templates</SidebarLink>
          <SidebarLink to="/wallpaper">Wallpaper</SidebarLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <HealthCheck />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/Envie">
      <Toaster theme="dark" position="bottom-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/notes" element={<FeedPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/templates" element={<div>Templates Page Placeholder</div>} />
          <Route path="/wallpaper" element={<div>Wallpaper Page Placeholder</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
