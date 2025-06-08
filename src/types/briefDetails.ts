// src/types/briefDetails.ts
export interface BriefTask {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Complete' | 'Blocked';
  assignee: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  description?: string;
}

export interface BriefProcess {
  id: string;
  title: string;
  description: string;
  tags: string[];
  progress: number;
  status: 'Draft' | 'In Progress' | 'Review' | 'Complete' | 'Archived';
  tasks: BriefTask[];
  relatedBriefs: Brief[];
  createdAt: string;
  lastUpdated: string;
  clientName: string;
  projectType: string;
}

export interface Brief {
  id: string;
  clientName: string;
  projectType: string;
  progress: number;
  status: 'Draft' | 'In Progress' | 'Review' | 'Complete' | 'Archived';
  lastUpdated: string;
  tags?: string[];
  description?: string;
  createdAt: string;
}