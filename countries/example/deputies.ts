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

const EXAMPLE_TOPIC_ALIASES: Record<string, string> = {};

const alignmentContext: TopicAlignmentContext = {
  categories: PLATFORM_CATEGORIES,
  aliases: EXAMPLE_TOPIC_ALIASES,
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
