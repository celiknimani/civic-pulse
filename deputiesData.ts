import { DeputyDataset, DeputyProfile, DeputyTopicMetric } from './types';

const PARTY_SEQUENCE = ['LVV', 'PDK', 'LDK', 'AAK', 'NISMA', 'LISTA SERBE', 'Të Pavarur'];

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
    isDeputyMetricArray(deputy.topics)
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

