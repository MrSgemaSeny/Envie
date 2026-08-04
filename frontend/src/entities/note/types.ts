export interface MediaDto {
  id: string;
  filePath: string;
  originalName: string;
  mediaType: string;
}

export interface NoteDto {
  id: string;
  content: string;
  createdAt: string;
  pinned: boolean;
  tags: string[];
  media: MediaDto[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface CreateNotePayload {
  content: string;
  tags: string;
  files: File[];
}
