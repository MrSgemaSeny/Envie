import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import { Task, Subtask } from './types';

// Helper to safely extract data whether it's wrapped in ApiResponse or not (using unknown to avoid 'any')
const extractData = <T>(resData: unknown): T => {
  if (resData && typeof resData === 'object' && 'data' in resData && !Array.isArray(resData) && !('id' in resData)) {
    return (resData as { data: T }).data;
  }
  return resData as T;
};

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await apiClient.get('/tasks');
      return extractData<Task[]>(response.data);
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { title: string; description: string }) => {
      const response = await apiClient.post('/tasks', payload);
      return extractData<Task>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { title: string; description: string } }) => {
      const response = await apiClient.put(`/tasks/${id}`, payload);
      return extractData<Task>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/tasks/${id}`);
      return extractData<void>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useCreateSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, payload }: { taskId: string; payload: { title: string } }) => {
      const response = await apiClient.post(`/tasks/${taskId}/subtasks`, payload);
      return extractData<Subtask>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useUpdateSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { title: string; done: boolean } }) => {
      const response = await apiClient.put(`/subtasks/${id}`, payload);
      return extractData<Subtask>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/subtasks/${id}`);
      return extractData<void>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};
