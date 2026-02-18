import { DeputyDataset, DeputyProfile, DeputySource, DeputyTopicMetric } from './types';

export const TOPIC_AXIS = [
  { id: 'ekonomia', label: 'Ekonomia' },
  { id: 'arsimi', label: 'Arsimi' },
  { id: 'shendetesia', label: 'Shendetesia' },
  { id: 'drejtesia', label: 'Drejtesia' },
  { id: 'infrastruktura', label: 'Infrastruktura' },
  { id: 'siguria', label: 'Siguria' },
  { id: 'integrimi-evropian', label: 'Integrimi Evropian' },
  { id: 'mireqenia-sociale', label: 'Mireqenia Sociale' },
];

export const EMPTY_DEPUTY_DATASET: DeputyDataset = {
  generatedAt: '',
  source: 'transcripts',
  deputies: [],
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

export interface DeputyTopicLeader {
  id: string;
  name: string;
  party: string;
  mentions: number;
  score: number;
}

const normalizeText = (value: string): string =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

export const getTopicLabelById = (topicId: string): string =>
  TOPIC_AXIS.find((topic) => topic.id === topicId)?.label || topicId;

export const getTopicIdForPromiseCategory = (category: string): string | null => {
  const normalized = normalizeText(category);

  if (normalized.includes('sigur')) return 'siguria';
  if (normalized.includes('shendet') || normalized.includes('shend')) return 'shendetesia';
  if (normalized.includes('arsim')) return 'arsimi';
  if (normalized.includes('drejt')) return 'drejtesia';
  if (normalized.includes('infrastruktur') || normalized.includes('energj')) return 'infrastruktura';
  if (normalized.includes('mir') || normalized.includes('social') || normalized.includes('sport') || normalized.includes('arti')) {
    return 'mireqenia-sociale';
  }
  if (
    normalized.includes('politika e jashtme') ||
    normalized.includes('diaspor') ||
    normalized.includes('integrim') ||
    normalized.includes('be')
  ) {
    return 'integrimi-evropian';
  }
  if (normalized.includes('ekonom') || normalized.includes('inovacion') || normalized.includes('teknolog') || normalized.includes('turiz')) {
    return 'ekonomia';
  }

  return null;
};

export const getTopDeputiesForTopic = (
  deputies: DeputyProfile[],
  topicId: string,
  limit = 3
): DeputyTopicLeader[] => {
  const ranking = deputies
    .map((deputy) => {
      const topic = deputy.topics.find((item) => item.topicId === topicId);
      return {
        id: deputy.id,
        name: deputy.name,
        party: deputy.party,
        mentions: topic?.mentions || 0,
        score: topic?.score || 0,
        speechCount: deputy.activity.speechCount,
        wordCount: deputy.activity.wordCount,
      };
    })
    .filter((entry) => entry.mentions > 0)
    .sort((a, b) => {
      if (b.mentions !== a.mentions) return b.mentions - a.mentions;
      if (b.score !== a.score) return b.score - a.score;
      if (b.speechCount !== a.speechCount) return b.speechCount - a.speechCount;
      return b.wordCount - a.wordCount;
    })
    .slice(0, limit)
    .map(({ id, name, party, mentions, score }) => ({ id, name, party, mentions, score }));

  return ranking;
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

const isDeputySourceArray = (value: unknown): value is DeputySource[] => {
  if (value === undefined) return true;
  if (!Array.isArray(value)) return false;

  return value.every(
    (source) =>
      source &&
      typeof source === 'object' &&
      typeof (source as DeputySource).id === 'string' &&
      typeof (source as DeputySource).title === 'string' &&
      typeof (source as DeputySource).url === 'string' &&
      ((source as DeputySource).date === undefined || typeof (source as DeputySource).date === 'string') &&
      ((source as DeputySource).note === undefined || typeof (source as DeputySource).note === 'string')
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
    isDeputySourceArray(deputy.sources)
  );
};

export const parseDeputyDataset = (value: unknown): DeputyDataset | null => {
  if (!value || typeof value !== 'object') return null;
  const dataset = value as DeputyDataset;

  if (typeof dataset.generatedAt !== 'string') return null;
  if (dataset.source !== 'seed' && dataset.source !== 'transcripts') return null;
  if (!Array.isArray(dataset.deputies)) return null;
  if (!dataset.deputies.every((deputy) => isDeputyProfile(deputy))) return null;

  return dataset;
};
