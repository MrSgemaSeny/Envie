import React from 'react';
import { Link } from 'react-router-dom';
import { useNotes } from '../../entities/note/api';
import { useTasks } from '../../entities/task/api';
import { useGetIdeas } from '../../entities/idea/api';

export const DashboardPage: React.FC = () => {
  const { data: notes, isLoading: isNotesLoading } = useNotes();
  const { data: tasks, isLoading: isTasksLoading } = useTasks();
  const { data: ideas, isLoading: isIdeasLoading } = useGetIdeas();

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
          <span className="text-2xl font-semibold text-foreground">
            {isNotesLoading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : notes?.length || 0}
          </span>
        </div>
        {/* Stat Card 2 */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">Active Tasks</span>
          <span className="text-2xl font-semibold text-foreground">
            {isTasksLoading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : tasks?.length || 0}
          </span>
        </div>
        {/* Stat Card 3 */}
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">Ideas Generated</span>
          <span className="text-2xl font-semibold text-foreground">
            {isIdeasLoading ? <div className="h-8 w-16 bg-muted animate-pulse rounded" /> : ideas?.length || 0}
          </span>
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
