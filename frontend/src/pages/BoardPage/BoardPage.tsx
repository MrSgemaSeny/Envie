import React from 'react';
import { useTasks } from '../../entities/task/api';
import { TaskCard } from '../../widgets/TaskCard/TaskCard';
import { CreateTaskForm } from '../../features/createTask/ui/CreateTaskForm';

export const BoardPage: React.FC = () => {
  const { data: tasks = [], isLoading, isError } = useTasks();

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load tasks.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Board</h1>
        <p className="text-muted-foreground mt-1">Manage your tasks and subtasks.</p>
      </div>

      <div className="mb-4 w-full max-w-md">
        <CreateTaskForm />
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {tasks.map((task) => (
          <div key={task.id} className="break-inside-avoid">
            <TaskCard task={task} />
          </div>
        ))}
      </div>
      
      {tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No tasks yet. Create one above!
        </div>
      )}
    </div>
  );
};
