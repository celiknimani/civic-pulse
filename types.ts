
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
