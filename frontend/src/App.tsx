import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from './shared/api/client';

function HealthCheck() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => apiClient.get('/actuator/health').then(res => res.data)
  });

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow bg-white text-sm border border-gray-200">
      <h3 className="font-bold text-gray-700 mb-1">Backend Status</h3>
      {isLoading && <span className="text-gray-500">Checking...</span>}
      {error && <span className="text-red-500 font-medium">Error: {error.message}</span>}
      {data && (
        <span className={data.status === 'UP' ? 'text-green-500 font-medium' : 'text-yellow-500 font-medium'}>
          {data.status || 'UNKNOWN'}
        </span>
      )}
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <nav className="bg-white shadow-sm p-4 flex gap-4 border-b">
        <Link to="/" className="text-primary font-bold hover:underline">Notes</Link>
        <Link to="/board" className="text-primary font-bold hover:underline">Board</Link>
        <Link to="/ideas" className="text-primary font-bold hover:underline">Ideas</Link>
        <Link to="/templates" className="text-primary font-bold hover:underline">Templates</Link>
        <Link to="/wallpaper" className="text-primary font-bold hover:underline">Wallpaper</Link>
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
      <Layout>
        <Routes>
          <Route path="/" element={<div>Notes Page Placeholder</div>} />
          <Route path="/board" element={<div>Board Page Placeholder</div>} />
          <Route path="/ideas" element={<div>Ideas Page Placeholder</div>} />
          <Route path="/templates" element={<div>Templates Page Placeholder</div>} />
          <Route path="/wallpaper" element={<div>Wallpaper Page Placeholder</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
