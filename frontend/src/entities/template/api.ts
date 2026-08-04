import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import { Template, TemplateContent, UpdateTemplatePayload, ApiResponse } from './types';
import { toast } from 'sonner';

export const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  detail: (name: string) => [...templateKeys.all, 'detail', name] as const,
};

export function useGetTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Template[]>>('/templates');
      return response.data.data;
    },
  });
}

export function useGetTemplate(name: string | null) {
  return useQuery({
    queryKey: templateKeys.detail(name || ''),
    queryFn: async () => {
      if (!name) return null;
      const response = await apiClient.get<ApiResponse<TemplateContent>>(`/templates/${name}`);
      return response.data.data;
    },
    enabled: !!name,
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, payload }: { name: string; payload: UpdateTemplatePayload }) => {
      const response = await apiClient.put<ApiResponse<TemplateContent>>(`/templates/${name}`, payload);
      return response.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(data.name) });
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      toast.success('Template updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update template: ${error.message}`);
    },
  });
}
