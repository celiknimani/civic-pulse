import { PartyPromise, PromiseStatus, PromiseUpdate } from '../types';

export interface MinistryConfig {
  id: string;
  portfolio: string;
  minister: string;
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

export const PRIME_MINISTER = {
  role: 'Kryeministër',
  name: 'Albin Kurti',
};

export const MINISTRIES: MinistryConfig[] = [
  {
    id: 'mfa',
    portfolio: 'Ministër i Jashtëm',
    minister: 'Glauk Konjufca',
    focusCategories: ['Politika e Jashtme'],
    promiseIds: ['112', '113', '114', '115', '116', '117', '118'],
    accent: '#234d88',
  },
  {
    id: 'justice',
    portfolio: 'Ministre e Drejtësisë',
    minister: 'Donika Gërvalla',
    focusCategories: ['Drejtësia'],
    promiseIds: ['1', '98', '99', '100', '101'],
    accent: '#7b3f00',
  },
  {
    id: 'finance',
    portfolio: 'Ministër i Financave',
    minister: 'Hekuran Murati',
    focusCategories: ['Ekonomia'],
    promiseIds: ['14', '15', '16', '39'],
    accent: '#1f5f46',
  },
  {
    id: 'work-family',
    portfolio: 'Ministër për Punë, Familje dhe vlerat e luftës çlirimtare',
    minister: 'Andin Hoti',
    focusCategories: ['Mirëqenia', 'Ekonomia'],
    promiseIds: ['3', '32', '33', '34', '35', '40'],
    accent: '#5d4b8a',
  },
  {
    id: 'defense',
    portfolio: 'Ministër i Mbrojtjes',
    minister: 'Ejup Maqedonci',
    focusCategories: ['Siguria'],
    promiseIds: ['2', '8', '9', '10', '104', '107', '108', '109', '110', '111'],
    accent: '#214d6b',
  },
  {
    id: 'interior',
    portfolio: 'Ministër i Punëve të Brendshme',
    minister: 'Xhelal Sveçla',
    focusCategories: ['Siguria'],
    promiseIds: ['102', '103', '105'],
    accent: '#405a7e',
  },
  {
    id: 'digital-public-admin',
    portfolio: 'Ministër i Digjitalizimit dhe Administratës Publike',
    minister: 'Lulzon Jagxhiu',
    focusCategories: ['Inovacioni', 'Diaspora'],
    promiseIds: ['19', '20', '21', '22', '23', '30'],
    accent: '#005a7a',
  },
  {
    id: 'health',
    portfolio: 'Ministër i Shëndetësisë',
    minister: 'Arben Vitia',
    focusCategories: ['Shëndetësia'],
    promiseIds: ['6', '54', '55', '56', '57', '58', '59', '60'],
    accent: '#0f6f65',
  },
  {
    id: 'education',
    portfolio: 'Ministër i Arsimit dhe Shkencës',
    minister: 'Hajrulla Çeku',
    focusCategories: ['Arsimi'],
    promiseIds: ['5', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53'],
    accent: '#5c5d26',
  },
  {
    id: 'culture-tourism',
    portfolio: 'Ministër i Kulturës dhe Turizmit',
    minister: 'Saranda Bogujevci',
    focusCategories: ['Arti', 'Turizmi'],
    promiseIds: ['25', '26', '91', '92', '93', '94', '95', '96', '97'],
    accent: '#7a4f3a',
  },
  {
    id: 'sport-youth',
    portfolio: 'Ministër i Sportit dhe Rinisë',
    minister: 'Blerim Gashani',
    focusCategories: ['Sporti'],
    promiseIds: ['86', '87', '88', '89', '90'],
    accent: '#3d6281',
  },
  {
    id: 'local-government',
    portfolio: 'Ministër Administrimit të Pushtetit Lokal',
    minister: 'Elbert Krasniqi',
    focusCategories: ['Infrastruktura', 'Mirëqenia'],
    promiseIds: ['24', '67', '68', '82'],
    accent: '#5d6654',
  },
  {
    id: 'environment-spatial',
    portfolio: 'Ministre e Mjedisit dhe Planifikimit Hapësinor',
    minister: 'Fitore Pacolli',
    focusCategories: ['Energjia', 'Infrastruktura'],
    promiseIds: ['11', '69', '70', '71', '72', '73', '74', '75'],
    accent: '#3f7358',
  },
  {
    id: 'agriculture',
    portfolio: 'Ministër i Bujqësisë',
    minister: 'Armend Muja',
    focusCategories: ['Ekonomia'],
    promiseIds: ['61', '62', '63', '64', '65', '66'],
    accent: '#6a6d3f',
  },
  {
    id: 'infrastructure',
    portfolio: 'Ministër i Infrastrukturës',
    minister: 'Dimal Basha',
    focusCategories: ['Infrastruktura'],
    promiseIds: ['76', '77', '78', '79', '80', '81', '83', '84'],
    accent: '#205971',
  },
  {
    id: 'trade',
    portfolio: 'Ministre e Tregtisë',
    minister: 'Mimoza Kusari Lila',
    focusCategories: ['Ekonomia'],
    promiseIds: ['17', '18', '28'],
    accent: '#7a5b2f',
  },
  {
    id: 'economy',
    portfolio: 'Ministre e Ekonomisë',
    minister: 'Artane Rizvanolli',
    focusCategories: ['Ekonomia', 'Energjia'],
    promiseIds: ['4', '7', '12', '13', '36', '37', '38', '85', '119'],
    accent: '#1f6463',
  },
  {
    id: 'communities-return',
    portfolio: 'Ministër për Komunitete dhe Kthim',
    minister: 'Nenad Rashiq',
    focusCategories: ['Diaspora'],
    promiseIds: ['31'],
    accent: '#515c6a',
  },
  {
    id: 'regional-development',
    portfolio: 'Ministër për Zhvillim Rajonal',
    minister: 'Rasim Demiri',
    focusCategories: ['Diaspora'],
    promiseIds: ['27', '29'],
    accent: '#4a6e50',
  },
];

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
  const timestamp = Date.parse(date);
  if (Number.isNaN(timestamp)) return 0;

  const now = Date.now();
  const days = Math.floor((now - timestamp) / (1000 * 60 * 60 * 24));
  if (days <= 30) return 10;
  if (days <= 180) return 7;
  if (days <= 365) return 4;
  return 1;
};

const getLatestUpdateDate = (promise: PartyPromise): string | undefined => {
  if (!promise.updates?.length) return undefined;

  const sorted = [...promise.updates].sort((a, b) => {
    const aTs = Date.parse(a.date);
    const bTs = Date.parse(b.date);
    const safeA = Number.isNaN(aTs) ? -1 : aTs;
    const safeB = Number.isNaN(bTs) ? -1 : bTs;
    return safeB - safeA;
  });

  return sorted[0]?.date;
};

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
    }))
  );

  updates.sort((a, b) => {
    const aTs = Date.parse(a.date);
    const bTs = Date.parse(b.date);
    const safeA = Number.isNaN(aTs) ? -1 : aTs;
    const safeB = Number.isNaN(bTs) ? -1 : bTs;
    return safeB - safeA;
  });

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

export const buildAllMinistryAnalytics = (promises: PartyPromise[]): MinistryAnalytics[] => {
  const promisesById = new Map(promises.map((promise) => [promise.id, promise]));
  return MINISTRIES.map((config) => buildMinistryAnalytics(config, promisesById));
};

export const buildPrimeMinisterScore = (promises: PartyPromise[]): number => {
  if (!promises.length) return 0;
  const total = promises.reduce((sum, promise) => sum + getPromisePerformanceScore(promise), 0);
  return Math.round(total / promises.length);
};

export const scoreTone = (score: number): string => {
  if (score >= 70) return 'text-emerald-700';
  if (score >= 45) return 'text-[#0f4d8a]';
  if (score >= 25) return 'text-[#8d6b2f]';
  return 'text-[#8a4b3d]';
};
