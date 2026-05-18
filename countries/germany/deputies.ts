import type { DeputyDataset, DeputyTopicMetric } from '@core/types';
import {
  alignDeputyTopicsToCategories,
  buildTopicAxisFromCategories,
  getDeputyPrimaryTopic as getDeputyPrimaryTopicCore,
  rankDeputiesByActivity,
  parseDeputyDataset,
  type TopicAlignmentContext,
} from '@core/deputyAnalytics';
import { PLATFORM_CATEGORIES } from './categories';

// Add country-specific aliases here when historical transcript data uses a label that
// doesn't map cleanly onto your `categories.json` ids.
const GERMANY_TOPIC_ALIASES: Record<string, string> = {};

const alignmentContext: TopicAlignmentContext = {
  categories: PLATFORM_CATEGORIES,
  aliases: GERMANY_TOPIC_ALIASES,
};

export const TOPIC_AXIS = buildTopicAxisFromCategories(PLATFORM_CATEGORIES);

export const alignDeputyTopicsToPlatformCategories = (topics: DeputyTopicMetric[]): DeputyTopicMetric[] =>
  alignDeputyTopicsToCategories(topics, alignmentContext);

export const getDeputyPrimaryTopic = (topics: DeputyTopicMetric[]): DeputyTopicMetric | null =>
  getDeputyPrimaryTopicCore(topics, alignmentContext);

export { rankDeputiesByActivity, parseDeputyDataset };

export const SEED_DEPUTY_DATASET: DeputyDataset = {
  generatedAt: '2025-01-01T00:00:00.000Z',
  source: 'seed',
  deputies: [],
};
