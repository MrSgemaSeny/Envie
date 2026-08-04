import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import { Idea, CreateIdeaPayload } from './types';

const extractData = <T>(resData: unknown): T => {
  if (resData && typeof resData === 'object' && 'data' in resData && !Array.isArray(resData) && !('id' in resData)) {
    return (resData as { data: T }).data;
  }
  return resData as T;
};

export const useIdeas = () => {
  return useQuery({
    queryKey: ['ideas'],
    queryFn: async () => {
      const response = await apiClient.get('/ideas');
      return extractData<Idea[]>(response.data);
    },
  });
};

export const useCreateIdea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateIdeaPayload) => {
      const response = await apiClient.post('/ideas', payload);
      return extractData<Idea>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

export const useUpdateIdea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: CreateIdeaPayload }) => {
      const response = await apiClient.put(`/ideas/${id}`, payload);
      return extractData<Idea>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

export const useDeleteIdea = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/ideas/${id}`);
      return extractData<void>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};

export const useGenerateArchitecture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/ideas/${id}/generate-architecture`);
      return extractData<Idea>(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
    },
  });
};
