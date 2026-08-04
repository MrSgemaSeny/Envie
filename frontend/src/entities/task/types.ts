export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  done: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  subtasks: Subtask[];
}

export interface ApiResponse<T> {
  data: T;
  // Based on the given contract, we can assume typical structure, or perhaps the response is directly the data?
  // The contract says: returns ApiResponse<Task[]>.
  // I will define it generically.
}
