
export enum PartyID {
  LVV = 'LVV',
  PDK = 'PDK',
  LDK = 'LDK',
  AAK = 'AAK',
  LISTA_GUXO = 'LISTA_GUXO',
  NISMA = 'NISMA'
}

export interface PartyInfo {
  id: PartyID;
  name: string;
  leader: string;
  color: string;
  logo: string;
  description: string;
}

export interface ComparisonPoint {
  category: string;
  values: Record<string, string>; // PartyID -> Value
}

export interface ScoreData {
  partyId: PartyID;
  growthAndWages: number;
  infrastructureAndEnergy: number;
  socialAndFamily: number;
  securityAndNATO: number;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  scores?: ScoreData[];
  groundingLinks?: Array<{ title: string; uri: string }>;
  comparisonPoints?: ComparisonPoint[];
}


export interface ElectionAnalysisResult {
  analysis: string;
  scores: ScoreData[];
  comparisonPoints: ComparisonPoint[];
  groundingLinks?: Array<{ title: string; uri: string }>;
  detectedCategory: string; // New field for analytics
}

export type PromiseStatus = 'Completed' | 'In Progress' | 'Delayed' | 'Pending';

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

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
