import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './shared/api/client';
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

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative bg-background text-foreground">
      <nav className="bg-card border-b border-border p-4 flex gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground font-medium transition-opacity duration-300 ease-out active:scale-95">Notes</Link>
        <Link to="/board" className="text-muted-foreground hover:text-foreground font-medium transition-opacity duration-300 ease-out active:scale-95">Board</Link>
        <Link to="/ideas" className="text-muted-foreground hover:text-foreground font-medium transition-opacity duration-300 ease-out active:scale-95">Ideas</Link>
        <Link to="/templates" className="text-muted-foreground hover:text-foreground font-medium transition-opacity duration-300 ease-out active:scale-95">Templates</Link>
        <Link to="/wallpaper" className="text-muted-foreground hover:text-foreground font-medium transition-opacity duration-300 ease-out active:scale-95">Wallpaper</Link>
      </nav>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <HealthCheck />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster theme="dark" position="bottom-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/templates" element={<div>Templates Page Placeholder</div>} />
          <Route path="/wallpaper" element={<div>Wallpaper Page Placeholder</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
