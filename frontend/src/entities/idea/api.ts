import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import { Idea, CreateIdeaPayload, UpdateIdeaPayload, ApiResponse } from './types';
import { toast } from 'sonner';

export const ideaKeys = {
  all: ['ideas'] as const,
  lists: () => [...ideaKeys.all, 'list'] as const,
  detail: (id: string) => [...ideaKeys.all, 'detail', id] as const,
};

export function useGetIdeas() {
  return useQuery({
    queryKey: ideaKeys.lists(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Idea[]>>('/ideas');
      return response.data.data;
    },
  });
}

export function useCreateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateIdeaPayload) => {
      const response = await apiClient.post<ApiResponse<Idea>>('/ideas', payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      toast.success('Idea created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create idea: ${error.message}`);
    },
  });
}

export function useUpdateIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateIdeaPayload }) => {
      const response = await apiClient.put<ApiResponse<Idea>>(`/ideas/${id}`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      toast.success('Idea updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update idea: ${error.message}`);
    },
  });
}

export function useDeleteIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete<ApiResponse<void>>(`/ideas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      toast.success('Idea deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete idea: ${error.message}`);
    },
  });
}

export function useGenerateArchitectureIdea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post<ApiResponse<Idea>>(`/ideas/${id}/generate-architecture`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ideaKeys.lists() });
      toast.success('Architecture generated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to generate architecture: ${error.message}`);
    },
  });
}
