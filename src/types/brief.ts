// src/types/brief.ts
export interface Brief {
  id: string;
  clientName: string;
  projectType: string;
  progress: number; // 0-100
  status: 'Draft' | 'In Progress' | 'Review' | 'Complete' | 'Archived';
  lastUpdated: string;
  tags?: string[];
  description?: string;
  createdAt: string;
}

export interface BriefFilters {
  client: string;
  status: string;
}