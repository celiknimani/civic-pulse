import { DeputyActivityEntry, DeputyDataset, DeputyProfile, DeputyTopicMetric } from './types';
import { DEPUTY_TOPIC_TAXONOMY, PLATFORM_CATEGORIES } from './categories';

const PARTY_SEQUENCE = ['LVV', 'PDK', 'LDK', 'AAK', 'NISMA', 'LISTA SERBE', 'Të Pavarur'];

export const TOPIC_AXIS = DEPUTY_TOPIC_TAXONOMY.map((topic) => ({ id: topic.topicId, label: topic.label }));

const normalizeTopicKey = (value: string): string =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const platformCategoryIdByNormalizedKey = new Map(
  PLATFORM_CATEGORIES.flatMap((category) => [
    [normalizeTopicKey(category.id), category.id],
    [normalizeTopicKey(category.label), category.id],
  ])
);

const topicAliasByNormalizedKey = new Map<string, string>([
  ['integrimi evropian', 'Politika e Jashtme'],
  ['mireqenia sociale', 'Mirëqenia'],
  ['inovacioni dhe teknologjia', 'Inovacioni'],
]);

const resolvePlatformCategoryId = (topic: DeputyTopicMetric): string | null => {
  const keys = [topic.topicId, topic.label].map((value) => normalizeTopicKey(value));

  for (const key of keys) {
    const direct = platformCategoryIdByNormalizedKey.get(key);
    if (direct) return direct;

    const alias = topicAliasByNormalizedKey.get(key);
    if (alias) return alias;
  }

  return null;
};

export const alignDeputyTopicsToPlatformCategories = (topics: DeputyTopicMetric[]): DeputyTopicMetric[] => {
  const mentionsByCategory = new Map(PLATFORM_CATEGORIES.map((category) => [category.id, 0]));

  topics.forEach((topic) => {
    const categoryId = resolvePlatformCategoryId(topic);
    if (!categoryId) return;
    const current = mentionsByCategory.get(categoryId) || 0;
    mentionsByCategory.set(categoryId, current + Math.max(0, topic.mentions));
  });

  const totalMentions = Array.from(mentionsByCategory.values()).reduce((sum, mentions) => sum + mentions, 0);

  return PLATFORM_CATEGORIES.map((category) => {
    const mentions = mentionsByCategory.get(category.id) || 0;
    return {
      topicId: category.id,
      label: category.label,
      mentions,
      score: totalMentions > 0 ? Number(((mentions / totalMentions) * 100).toFixed(2)) : 0,
    };
  });
};

const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
};

const buildTopicMetrics = (seed: number): DeputyTopicMetric[] => {
  const mentions = TOPIC_AXIS.map((topic, index) => {
    const weight = 3 + Math.floor(seededRandom(seed + index * 13) * 26);
    return {
      topicId: topic.id,
      label: topic.label,
      mentions: weight,
    };
  });

  const totalMentions = mentions.reduce((sum, topic) => sum + topic.mentions, 0);

  return mentions.map((topic) => ({
    ...topic,
    score: totalMentions > 0 ? Number(((topic.mentions / totalMentions) * 100).toFixed(2)) : 0,
  }));
};

const buildSeedDeputy = (index: number): DeputyProfile => {
  const seed = index + 1;
  const topics = buildTopicMetrics(seed);
  const emphasis = seededRandom(seed * 7);
  const speechCount = 20 + Math.floor(seededRandom(seed * 3) * 230);
  const sessionCount = 6 + Math.floor(seededRandom(seed * 5) * 34);
  const averageSpeechLength = 95 + Math.floor(emphasis * 430);
  const wordCount = speechCount * averageSpeechLength;

  return {
    id: `deputeti-${String(seed).padStart(3, '0')}`,
    name: `Deputeti ${String(seed).padStart(3, '0')}`,
    party: PARTY_SEQUENCE[index % PARTY_SEQUENCE.length],
    profileUrl: 'https://www.kuvendikosoves.org/shq/deputetet/',
    activity: {
      speechCount,
      wordCount,
      sessionCount,
    },
    topics,
    activityHistory: [],
  };
};

export const SEED_DEPUTY_DATASET: DeputyDataset = {
  generatedAt: '2026-02-18T00:00:00.000Z',
  source: 'seed',
  deputies: Array.from({ length: 120 }, (_, index) => buildSeedDeputy(index)),
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

export const getDeputyPrimaryTopic = (topics: DeputyTopicMetric[]): DeputyTopicMetric | null => {
  const alignedTopics = alignDeputyTopicsToPlatformCategories(topics);
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
      typeof (topic as DeputyTopicMetric).mentions === 'number'
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
      typeof (entry as DeputyActivityEntry).excerpt === 'string'
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
    (typeof (deputy as DeputyProfile).activityHistory === 'undefined' ||
      isDeputyActivityEntryArray((deputy as DeputyProfile).activityHistory))
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
