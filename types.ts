
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

export interface DeputyActivityEntry {
  id: string;
  date: string;
  sessionId: string;
  source: string;
  sourceUrl?: string;
  reference: string;
  excerpt: string;
}

export interface PromiseDeputySignal {
  deputyId: string;
  deputyName: string;
  party: string;
  speechCount: number;
  wordCount: number;
  sessionCount: number;
  topicMentions: number;
  topicScore: number;
}

export interface DeputyProfile {
  id: string;
  name: string;
  party: string;
  profileUrl?: string;
  activity: DeputyActivityMetrics;
  topics: DeputyTopicMetric[];
  activityHistory: DeputyActivityEntry[];
}

export interface DeputyDataset {
  generatedAt: string;
  source: 'seed' | 'transcripts';
  deputies: DeputyProfile[];
}
