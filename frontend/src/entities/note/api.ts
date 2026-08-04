import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import { NoteDto, CreateNotePayload } from './types';



export const useNotes = () => {
  return useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await apiClient.get('/notes');
      return response.data.data as NoteDto[];
    },
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateNotePayload) => {
      const formData = new FormData();
      formData.append('content', payload.content);
      formData.append('tags', payload.tags);
      if (payload.files && payload.files.length > 0) {
        Array.from(payload.files).forEach((file) => {
          formData.append('files', file);
        });
      }

      const response = await apiClient.post('/notes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useTogglePin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.put(`/notes/${id}/pin`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/notes/${id}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
};
