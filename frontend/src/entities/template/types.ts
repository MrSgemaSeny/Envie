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

export interface GraphNode {
  id: string;        // "EPIC_BOARD.md"
  name: string;      // "EPIC_BOARD"
  group: string;     // "EPIC"
  updatedAt: string;
  val: number;
  color?: string;
  x?: number;
  y?: number;
}

export interface GraphLink {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
