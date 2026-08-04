import React from 'react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back. Here is an overview of your second brain.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat Card 1 */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">Total Notes</span>
          <span className="text-2xl font-semibold text-foreground">124</span>
        </div>
        {/* Stat Card 2 */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">Active Tasks</span>
          <span className="text-2xl font-semibold text-foreground">12</span>
        </div>
        {/* Stat Card 3 */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">Ideas Generated</span>
          <span className="text-2xl font-semibold text-foreground">48</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Link 
          to="/notes" 
          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors duration-200 ease-out active:scale-[0.98]"
        >
          Capture Note
        </Link>
        <Link 
          to="/board" 
          className="inline-flex items-center justify-center px-4 py-2 bg-transparent border border-border text-foreground text-sm font-medium rounded-md hover:bg-muted transition-colors duration-200 ease-out active:scale-[0.98]"
        >
          View Board
        </Link>
      </div>
    </div>
  );
};
