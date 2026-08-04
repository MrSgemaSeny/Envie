import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
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
