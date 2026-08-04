export interface Template {
  name: string;
  updatedAt: string;
}

export interface TemplateContent {
  name: string;
  content: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface UpdateTemplatePayload {
  content: string;
}
