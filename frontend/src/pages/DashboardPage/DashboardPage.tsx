import React from 'react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center animate-in fade-in zoom-in duration-300 ease-out">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Welcome to Envie
      </h1>
      <p className="text-lg text-muted-foreground max-w-md">
        Your personal knowledge base and task management system. Start capturing ideas, managing tasks, and building your second brain.
      </p>
      <div className="flex gap-4 mt-4">
        <Link 
          to="/notes" 
          className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity duration-300 ease-out active:scale-95 shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-hover)]"
        >
          Go to Notes
        </Link>
        <Link 
          to="/board" 
          className="px-6 py-3 bg-input text-foreground font-medium rounded-xl border border-border hover:bg-muted transition-colors duration-300 ease-out active:scale-95"
        >
          View Board
        </Link>
      </div>
    </div>
  );
};
