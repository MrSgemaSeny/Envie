import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import { Wallpaper, ApiResponse } from './types';

export function useWallpapers() {
  return useQuery({
    queryKey: ['wallpapers'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<Wallpaper[]>>('/wallpapers');
      return res.data.data;
    }
  });
}

export function useActiveWallpapers() {
  return useQuery({
    queryKey: ['wallpapers', 'active'],
    queryFn: async () => {
      try {
        const res = await apiClient.get<ApiResponse<Wallpaper[]>>('/wallpapers/active');
        return res.data.data;
      } catch (err) {
        if (err instanceof Error && 'response' in err) {
          const axiosErr = err as { response?: { status: number } };
          if (axiosErr.response?.status === 404) {
            return [];
          }
        }
        throw err;
      }
    },
    retry: false,
  });
}

export function useUploadWallpaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiClient.post<ApiResponse<Wallpaper>>('/wallpapers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
    }
  });
}

export function useActivateWallpaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.put<ApiResponse<Wallpaper>>(`/wallpapers/${id}/activate`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
    }
  });
}

export function useDeleteWallpaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete<ApiResponse<void>>(`/wallpapers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
    }
  });
}

export function useDeactivateWallpaper() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.put<ApiResponse<void>>('/wallpapers/deactivate');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
    }
  });
}
