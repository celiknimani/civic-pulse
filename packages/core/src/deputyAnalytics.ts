import type {
  DeputyActivityEntry,
  DeputyDataset,
  DeputyProfile,
  DeputyTopicMetric,
} from './types';
import type { CategoryView } from './categories';

export const normalizeTopicKey = (value: string): string =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export interface TopicAlignmentContext {
  categories: CategoryView[];
  aliases?: Record<string, string>;
}

const buildCategoryIndex = (categories: CategoryView[]): Map<string, string> =>
  new Map(
    categories.flatMap((category) => [
      [normalizeTopicKey(category.id), category.id],
      [normalizeTopicKey(category.label), category.id],
    ]),
  );

const resolveCategoryId = (
  topic: DeputyTopicMetric,
  index: Map<string, string>,
  aliases: Map<string, string>,
): string | null => {
  const keys = [topic.topicId, topic.label].map((value) => normalizeTopicKey(value));
  for (const key of keys) {
    const direct = index.get(key);
    if (direct) return direct;
    const alias = aliases.get(key);
    if (alias) return alias;
  }
  return null;
};

export const alignDeputyTopicsToCategories = (
  topics: DeputyTopicMetric[],
  { categories, aliases = {} }: TopicAlignmentContext,
): DeputyTopicMetric[] => {
  const categoryIndex = buildCategoryIndex(categories);
  const aliasIndex = new Map(Object.entries(aliases).map(([key, value]) => [normalizeTopicKey(key), value]));

  const mentionsByCategory = new Map(categories.map((category) => [category.id, 0]));

  topics.forEach((topic) => {
    const categoryId = resolveCategoryId(topic, categoryIndex, aliasIndex);
    if (!categoryId) return;
    const current = mentionsByCategory.get(categoryId) || 0;
    mentionsByCategory.set(categoryId, current + Math.max(0, topic.mentions));
  });

  const totalMentions = Array.from(mentionsByCategory.values()).reduce((sum, mentions) => sum + mentions, 0);

  return categories.map((category) => {
    const mentions = mentionsByCategory.get(category.id) || 0;
    return {
      topicId: category.id,
      label: category.label,
      mentions,
      score: totalMentions > 0 ? Number(((mentions / totalMentions) * 100).toFixed(2)) : 0,
    };
  });
};

export const rankDeputiesByActivity = (deputies: DeputyProfile[]): DeputyProfile[] =>
  [...deputies].sort((a, b) => {
    if (b.activity.speechCount !== a.activity.speechCount) {
      return b.activity.speechCount - a.activity.speechCount;
    }
    if (b.activity.wordCount !== a.activity.wordCount) {
      return b.activity.wordCount - a.activity.wordCount;
    }
    return b.activity.sessionCount - a.activity.sessionCount;
  });

export const getDeputyPrimaryTopic = (
  topics: DeputyTopicMetric[],
  alignmentContext: TopicAlignmentContext,
): DeputyTopicMetric | null => {
  const alignedTopics = alignDeputyTopicsToCategories(topics, alignmentContext);
  if (!alignedTopics.length) return null;

  const totalMentions = alignedTopics.reduce((sum, topic) => sum + topic.mentions, 0);
  if (totalMentions === 0) return null;

  return alignedTopics.reduce((best, current) => {
    if (current.mentions > best.mentions) return current;
    if (current.mentions === best.mentions && current.score > best.score) return current;
    return best;
  }, alignedTopics[0]);
};

const isDeputyMetricArray = (value: unknown): value is DeputyTopicMetric[] => {
  if (!Array.isArray(value)) return false;
  return value.every(
    (topic) =>
      topic &&
      typeof topic === 'object' &&
      typeof (topic as DeputyTopicMetric).topicId === 'string' &&
      typeof (topic as DeputyTopicMetric).label === 'string' &&
      typeof (topic as DeputyTopicMetric).score === 'number' &&
      typeof (topic as DeputyTopicMetric).mentions === 'number',
  );
};

const isDeputyActivityEntryArray = (value: unknown): value is DeputyActivityEntry[] => {
  if (!Array.isArray(value)) return false;
  return value.every(
    (entry) =>
      entry &&
      typeof entry === 'object' &&
      typeof (entry as DeputyActivityEntry).id === 'string' &&
      typeof (entry as DeputyActivityEntry).date === 'string' &&
      typeof (entry as DeputyActivityEntry).sessionId === 'string' &&
      typeof (entry as DeputyActivityEntry).source === 'string' &&
      (typeof (entry as DeputyActivityEntry).sourceUrl === 'undefined' ||
        typeof (entry as DeputyActivityEntry).sourceUrl === 'string') &&
      typeof (entry as DeputyActivityEntry).reference === 'string' &&
      typeof (entry as DeputyActivityEntry).excerpt === 'string',
  );
};

const isDeputyProfile = (value: unknown): value is DeputyProfile => {
  if (!value || typeof value !== 'object') return false;
  const deputy = value as DeputyProfile;
  return (
    typeof deputy.id === 'string' &&
    typeof deputy.name === 'string' &&
    typeof deputy.party === 'string' &&
    !!deputy.activity &&
    typeof deputy.activity.speechCount === 'number' &&
    typeof deputy.activity.wordCount === 'number' &&
    typeof deputy.activity.sessionCount === 'number' &&
    isDeputyMetricArray(deputy.topics) &&
    (typeof deputy.activityHistory === 'undefined' || isDeputyActivityEntryArray(deputy.activityHistory))
  );
};

export const parseDeputyDataset = (value: unknown): DeputyDataset | null => {
  if (!value || typeof value !== 'object') return null;
  const dataset = value as DeputyDataset;
  if (typeof dataset.generatedAt !== 'string') return null;
  if (dataset.source !== 'seed' && dataset.source !== 'transcripts') return null;
  if (!Array.isArray(dataset.deputies)) return null;
  if (!dataset.deputies.every((deputy) => isDeputyProfile(deputy))) return null;
  return {
    ...dataset,
    deputies: dataset.deputies.map((deputy) => ({
      ...deputy,
      activityHistory: Array.isArray(deputy.activityHistory) ? deputy.activityHistory : [],
    })),
  };
};

export const buildTopicAxisFromCategories = (
  categories: CategoryView[],
): Array<{ id: string; label: string }> => categories.map((category) => ({ id: category.id, label: category.label }));
