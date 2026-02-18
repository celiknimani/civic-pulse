
export type PromiseStatus = 'Completed' | 'In Progress' | 'Delayed' | 'Pending';

export interface PromiseUpdate {
  date: string;
  status: PromiseStatus;
  description: string;
  source?: string;
  sourceUrl?: string;
}

export interface PartyPromise {
  id: string;
  category: string;
  title: string;
  description: string;
  status: PromiseStatus;
  progress: number; // 0 to 100
  startDate: string;
  dueDate: string;
  updates?: PromiseUpdate[];
}

export interface DeputyTopicMetric {
  topicId: string;
  label: string;
  score: number; // 0 to 100 normalized share
  mentions: number;
}

export interface DeputyActivityMetrics {
  speechCount: number;
  wordCount: number;
  sessionCount: number;
}

export interface DeputyProfile {
  id: string;
  name: string;
  party: string;
  profileUrl?: string;
  activity: DeputyActivityMetrics;
  topics: DeputyTopicMetric[];
}

export interface DeputyDataset {
  generatedAt: string;
  source: 'seed' | 'transcripts';
  deputies: DeputyProfile[];
}
