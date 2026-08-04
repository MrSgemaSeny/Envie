export type IdeaStatus = 'RAW' | 'EXPLORING' | 'ACCEPTED' | 'REJECTED';

export interface Idea {
  id: string;
  title: string;
  summary: string;
  problem: string;
  solution: string;
  audience: string;
  monetization: string;
  status: IdeaStatus;
  aiArchitecture: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIdeaPayload {
  title: string;
  summary: string;
  problem: string;
  solution: string;
  audience: string;
  monetization: string;
  status: IdeaStatus;
}
