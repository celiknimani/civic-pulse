import type { PartyPromise, PromiseStatus, PromiseUpdate } from './types';
import { compareDatedEntriesNewestFirst, getDateTimestamp, getLatestPromiseUpdate } from './promiseDates';

export interface MinistryConfig {
  id: string;
  portfolio: string;
  minister: string;
  tookOfficeDate: string;
  officialWebsiteUrl?: string;
  accent: string;
  focusCategories: PartyPromise['category'][];
  promiseIds: string[];
}

export interface MinistryPromiseScore {
  promise: PartyPromise;
  score: number;
  lastUpdateDate?: string;
}

export interface MinistryAnalytics {
  config: MinistryConfig;
  linkedPromises: PartyPromise[];
  promiseScores: MinistryPromiseScore[];
  score: number;
  avgProgress: number;
  activeCount: number;
  completedCount: number;
  statusBreakdown: Record<PromiseStatus, number>;
  topCategories: Array<{ category: string; count: number }>;
  recentUpdates: Array<(PromiseUpdate & { promiseId: string; promiseTitle: string })>;
}

const getStatusWeight = (status: PromiseStatus): number => {
  switch (status) {
    case 'Completed':
      return 20;
    case 'In Progress':
      return 12;
    case 'Delayed':
      return 5;
    default:
      return 0;
  }
};

const getFreshnessBonus = (date?: string): number => {
  if (!date) return 0;
  const timestamp = getDateTimestamp(date);
  if (!timestamp) return 0;
  const now = Date.now();
  const days = Math.floor((now - timestamp) / (1000 * 60 * 60 * 24));
  if (days <= 30) return 10;
  if (days <= 180) return 7;
  if (days <= 365) return 4;
  return 1;
};

const getLatestUpdateDate = (promise: PartyPromise): string | undefined =>
  getLatestPromiseUpdate(promise)?.date;

export const getPromisePerformanceScore = (promise: PartyPromise): number => {
  const progress = Math.max(0, Math.min(100, promise.progress || 0));
  const progressComponent = progress * 0.7;
  const statusComponent = getStatusWeight(promise.status);
  const freshnessComponent = getFreshnessBonus(getLatestUpdateDate(promise));
  return Math.min(100, Math.round(progressComponent + statusComponent + freshnessComponent));
};

const buildMinistryAnalytics = (config: MinistryConfig, promisesById: Map<string, PartyPromise>): MinistryAnalytics => {
  const linkedPromises = config.promiseIds
    .map((id) => promisesById.get(id))
    .filter((promise): promise is PartyPromise => Boolean(promise));

  const promiseScores: MinistryPromiseScore[] = linkedPromises
    .map((promise) => ({
      promise,
      score: getPromisePerformanceScore(promise),
      lastUpdateDate: getLatestUpdateDate(promise),
    }))
    .sort((a, b) => b.score - a.score);

  const statusBreakdown: Record<PromiseStatus, number> = {
    Completed: 0,
    'In Progress': 0,
    Delayed: 0,
    Pending: 0,
  };

  linkedPromises.forEach((promise) => {
    statusBreakdown[promise.status] += 1;
  });

  const categoryCount = new Map<string, number>();
  linkedPromises.forEach((promise) => {
    categoryCount.set(promise.category, (categoryCount.get(promise.category) || 0) + 1);
  });

  const topCategories = Array.from(categoryCount.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const updates = linkedPromises.flatMap((promise) =>
    (promise.updates || []).map((update) => ({
      ...update,
      promiseId: promise.id,
      promiseTitle: promise.title,
    })),
  );

  updates.sort(compareDatedEntriesNewestFirst);

  const sumScores = promiseScores.reduce((sum, entry) => sum + entry.score, 0);
  const sumProgress = linkedPromises.reduce((sum, promise) => sum + promise.progress, 0);
  const completedCount = linkedPromises.filter((promise) => promise.status === 'Completed').length;
  const activeCount = linkedPromises.filter((promise) => promise.status === 'In Progress' || promise.progress > 0).length;

  return {
    config,
    linkedPromises,
    promiseScores,
    score: linkedPromises.length ? Math.round(sumScores / linkedPromises.length) : 0,
    avgProgress: linkedPromises.length ? Math.round(sumProgress / linkedPromises.length) : 0,
    activeCount,
    completedCount,
    statusBreakdown,
    topCategories,
    recentUpdates: updates.slice(0, 8),
  };
};

export const buildAllMinistryAnalyticsFor = (
  ministries: MinistryConfig[],
  promises: PartyPromise[],
): MinistryAnalytics[] => {
  const promisesById = new Map(promises.map((promise) => [promise.id, promise]));
  return ministries.map((config) => buildMinistryAnalytics(config, promisesById));
};

export const buildPrimeMinisterScore = (promises: PartyPromise[]): number => {
  if (!promises.length) return 0;
  const total = promises.reduce((sum, promise) => sum + getPromisePerformanceScore(promise), 0);
  return Math.round(total / promises.length);
};

export const scoreTone = (score: number): string => {
  if (score >= 70) return 'text-emerald-700';
  if (score >= 45) return 'text-[#102949]';
  if (score >= 25) return 'text-[#8a571f]';
  return 'text-slate-700';
};
