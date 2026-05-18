import governmentData from './government.json' with { type: 'json' };
import type { PartyPromise } from '@core/types';
import {
  buildAllMinistryAnalyticsFor,
  buildPrimeMinisterScore,
  getPromisePerformanceScore,
  scoreTone,
  type MinistryAnalytics,
  type MinistryConfig,
  type MinistryPromiseScore,
} from '@core/governmentAnalytics';

export type { MinistryConfig, MinistryAnalytics, MinistryPromiseScore };

export const PRIME_MINISTER = governmentData.primeMinister;
export const MINISTRIES = governmentData.ministries as MinistryConfig[];

export const buildAllMinistryAnalytics = (promises: PartyPromise[]): MinistryAnalytics[] =>
  buildAllMinistryAnalyticsFor(MINISTRIES, promises);

export { buildPrimeMinisterScore, getPromisePerformanceScore, scoreTone };
