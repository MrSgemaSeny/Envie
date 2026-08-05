export interface Wallpaper {
  id: string;
  filename: string;
  originalName: string;
  isActive: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
