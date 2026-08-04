import React from 'react';
import { useTasks } from '../../entities/task/api';
import { TaskCard } from '../../widgets/TaskCard/TaskCard';
import { CreateTaskForm } from '../../features/createTask/ui/CreateTaskForm';

export const BoardPage: React.FC = () => {
  const { data: tasks = [], isLoading, isError } = useTasks();

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">Tasks</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your tasks and subtasks.</p>
      </div>

      <div className="mb-4 w-full max-w-md">
        <CreateTaskForm />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-sm font-medium">Loading tasks...</p>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium text-center">
          Failed to load tasks. Please try again.
        </div>
      )}

      {!isLoading && tasks.length > 0 && (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {tasks.map((task) => (
            <div key={task.id} className="break-inside-avoid">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      )}
      
      {!isLoading && !isError && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-card/50 rounded-xl border border-dashed border-border">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-foreground">No tasks yet</h3>
          <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">Create a task to start tracking your work.</p>
        </div>
      )}
    </div>
  );
};
