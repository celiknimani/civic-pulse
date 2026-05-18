import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import DashboardStats from './components/DashboardStats';
import PromiseCard from './components/PromiseCard';

// Routes below the home page are lazy-loaded so the initial bundle stays small.
const Methodology = lazy(() => import('./components/Methodology'));
const PromiseDetail = lazy(() => import('./components/PromiseDetail').then((m) => ({ default: m.PromiseDetail })));
const DeputiesDirectory = lazy(() => import('./components/DeputiesDirectory'));
const DeputyProfile = lazy(() => import('./components/DeputyProfile'));
const QeveriaOrgChart = lazy(() => import('./components/QeveriaOrgChart'));
const QeveriaMinisterDetail = lazy(() => import('./components/QeveriaMinisterDetail'));
const StaticContentPage = lazy(() => import('./components/StaticContentPage'));

const RouteFallback: React.FC = () => (
  <div className="py-20 text-center text-sm font-semibold text-[#7e8795]">Loading…</div>
);

// Admin editor — available in dev (writes to disk) or in production when
// VITE_ADMIN_MODE=github-pr (commits via the GitHub REST API). Both modes share
// the same UI; production builds with VITE_ADMIN_MODE unset tree-shake the entire
// admin chunk.
const ADMIN_ENABLED = import.meta.env.DEV || import.meta.env.VITE_ADMIN_MODE === 'github-pr';
const AdminDashboard = ADMIN_ENABLED
  ? lazy(() => import('./components/admin/AdminDashboard'))
  : null;
import { CATEGORIES_WITH_ALL as CATEGORIES } from '@country/categories';
import { alignDeputyTopicsToPlatformCategories, parseDeputyDataset, rankDeputiesByActivity, SEED_DEPUTY_DATASET } from '@country/deputies';
import { getDateTimestamp, getLatestPromiseUpdateTimestamp as getPromiseLatestUpdateTimestamp } from '@core/promiseDates';
import { useMonthNames, useT, type Translator } from '@core/i18n';
import { usePromises } from '@core/usePromises';
import { DeputyDataset, DeputyProfile as DeputyProfileModel, PartyPromise, PromiseDeputySignal, PromiseStatus, PromiseUpdate } from '@core/types';

const getLatestPromiseUpdateTimestamp = (promises: PartyPromise[]): number =>
  promises.reduce((latestPromiseTimestamp, promise) => {
    return Math.max(latestPromiseTimestamp, getPromiseLatestUpdateTimestamp(promise));
  }, 0);

const formatMonthYear = (timestamp: number, months: readonly string[]): string => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '';
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
};

const buildStatusLabels = (t: Translator): Record<PromiseStatus, string> => ({
  Completed: t('status.completed'),
  'In Progress': t('status.inProgress'),
  Delayed: t('status.delayed'),
  Pending: t('status.pending'),
});

const getTopDeputiesForPromiseCategory = (
  promiseCategory: string,
  rankedDeputies: DeputyProfileModel[]
): PromiseDeputySignal[] =>
  rankedDeputies
    .filter((deputy) => deputy.activity.speechCount > 0)
    .map((deputy) => {
      const alignedTopics = alignDeputyTopicsToPlatformCategories(deputy.topics);
      const matchedTopic = alignedTopics.find((topic) => topic.topicId === promiseCategory || topic.label === promiseCategory);

      return {
        deputyId: deputy.id,
        deputyName: deputy.name,
        party: deputy.party,
        speechCount: deputy.activity.speechCount,
        wordCount: deputy.activity.wordCount,
        sessionCount: deputy.activity.sessionCount,
        topicMentions: matchedTopic?.mentions || 0,
        topicScore: matchedTopic?.score || 0,
      };
    })
    .filter((signal) => signal.topicMentions > 0)
    .sort((a, b) => {
      if (b.topicMentions !== a.topicMentions) return b.topicMentions - a.topicMentions;
      if (b.speechCount !== a.speechCount) return b.speechCount - a.speechCount;
      if (b.wordCount !== a.wordCount) return b.wordCount - a.wordCount;
      if (b.sessionCount !== a.sessionCount) return b.sessionCount - a.sessionCount;
      return a.deputyName.localeCompare(b.deputyName, 'sq-AL');
    })
    .slice(0, 3);

const buildTopDeputiesByPromiseId = (
  promises: PartyPromise[],
  rankedDeputies: DeputyProfileModel[],
): Map<string, PromiseDeputySignal[]> =>
  new Map(
    promises.map((promise) => [promise.id, getTopDeputiesForPromiseCategory(promise.category, rankedDeputies)])
  );

interface HomeProps {
  lastUpdatedLabel: string;
  promises: PartyPromise[];
}

const Home: React.FC<HomeProps> = ({ lastUpdatedLabel, promises }) => {
  const t = useT();
  const months = useMonthNames();
  const statusLabels = useMemo(() => buildStatusLabels(t), [t]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PromiseStatus | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(15);
  const totalPromises = promises.length;
  const completedCount = useMemo(() => promises.filter((promise) => promise.status === 'Completed').length, [promises]);
  const delayedCount = useMemo(() => promises.filter((promise) => promise.status === 'Delayed').length, [promises]);
  const averageProgress = useMemo(
    () => (totalPromises ? Math.round(promises.reduce((sum, promise) => sum + promise.progress, 0) / totalPromises) : 0),
    [promises, totalPromises]
  );

  const filteredPromises = useMemo(() => {
    return promises.filter((promise) => {
      const matchesCategory = selectedCategory === 'all' || promise.category === selectedCategory;
      const matchesSearch =
        promise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promise.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || promise.status === statusFilter;

      return matchesCategory && matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const latestA = getPromiseLatestUpdateTimestamp(a);
      const latestB = getPromiseLatestUpdateTimestamp(b);
      return latestB - latestA;
    });
  }, [promises, selectedCategory, searchTerm, statusFilter]);

  const displayedPromises = useMemo(() => filteredPromises.slice(0, visibleCount), [filteredPromises, visibleCount]);
  const selectedCategoryLabel = useMemo(
    () => CATEGORIES.find((category) => category.id === selectedCategory)?.label || t('filter.allCategories'),
    [selectedCategory, t]
  );
  const activeFilterCount = [selectedCategory !== 'all', statusFilter !== 'All', !!searchTerm.trim()].filter(Boolean).length;
  const clearFilters = (): void => {
    setSelectedCategory('all');
    setStatusFilter('All');
    setSearchTerm('');
  };
  useEffect(() => {
    setVisibleCount(15);
  }, [selectedCategory, searchTerm, statusFilter]);

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <section className="relative mb-10 overflow-hidden border-b border-[#d9ccb4] pb-10 md:pb-14">
        <div className="relative">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center border border-[#cdbf9f] bg-[#f5efdf] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6f5c36]">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-600" />
                {t('home.hero.lastUpdated', { date: lastUpdatedLabel })}
              </div>
              <div className="inline-flex items-center border border-[#cbd7e5] bg-[#edf4fb] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#17365e]">
                <i className="fa-solid fa-shield-halved mr-2" />
                {t('home.hero.sourcedMonitoring')}
              </div>
            </div>

            <h1 className="max-w-4xl text-5xl sm:text-6xl md:text-7xl font-black leading-[0.9] tracking-tight text-[#102949]">
              {t('home.hero.title.line1')}
              <span className="block text-[#b0822e]">{t('home.hero.title.line2')}</span>
            </h1>

            <p className="max-w-3xl text-lg md:text-xl leading-relaxed font-medium text-[#42536a]">
              {t('home.hero.subtitle')}
            </p>

            <div className="grid max-w-4xl gap-3 sm:grid-cols-3">
              {[
                { label: t('stats.activePromises'), value: totalPromises, icon: 'fa-layer-group' },
                { label: t('stats.avgProgress'), value: `${averageProgress}%`, icon: 'fa-chart-line' },
                { label: t('stats.alarms'), value: delayedCount, icon: 'fa-triangle-exclamation' },
              ].map((item) => (
                <div key={item.label} className="border border-[#d6cab4] bg-[#fbf7ee]/85 px-4 py-4">
                  <div className="mb-3 flex items-center justify-between text-[#6f5828]">
                    <span className="text-[10px] font-black uppercase tracking-[0.17em]">{item.label}</span>
                    <i className={`fa-solid ${item.icon} text-xs`} />
                  </div>
                  <p className="text-3xl font-black leading-none text-[#102949]">{item.value}</p>
                </div>
              ))}
            </div>

          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => document.getElementById('promise-workbench')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 rounded-full bg-[#102949] px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#f4ddab] shadow-[0_16px_34px_-24px_rgba(16,41,73,1)] transition-all hover:-translate-y-0.5 hover:bg-[#17365e]"
            >
              {t('home.hero.cta.explore')}
              <i className="fa-solid fa-arrow-down-long" />
            </button>
            <Link href="/methodology">
              <a className="inline-flex items-center gap-3 rounded-full border border-[#cdbb96] bg-[#f8ebcf] px-5 py-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#735a2e] transition-all hover:-translate-y-0.5 hover:bg-[#f2dfba]">
                {t('home.hero.cta.methodology')}
                <i className="fa-solid fa-file-lines" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <DashboardStats promises={promises} />

      <section
        id="promise-workbench"
        className="relative mt-8 mb-12 overflow-hidden rounded-[1.4rem] border border-[#d6cab4] bg-gradient-to-b from-[#f8f4ea] to-[#f2ecdf] p-5 md:p-7"
      >
        <div className="relative flex flex-col gap-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#6f5828]">{t('filter.center')}</p>
              <h2 className="mt-1 text-2xl font-black text-[#102949]">{t('filter.headline')}</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em]">
              <span className="rounded-full border border-[#d5c8b0] bg-[#fffaf2] px-3 py-2 text-[#66758b]">
                {t('home.filter.countLabel', { count: filteredPromises.length, total: totalPromises })}
              </span>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full border border-[#c9b795] bg-[#f8ebcf] px-3 py-2 text-[#735a2e] transition-colors hover:bg-[#f2dfba]"
                >
                  {t('home.filter.clearFilters')}
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group shrink-0 rounded-full border px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.16em] transition-all duration-300 ${selectedCategory === cat.id
                    ? 'border-[#0e2744] bg-[#102949] text-[#f4ddab] shadow-[0_12px_25px_-16px_rgba(16,41,73,1)]'
                    : 'border-[#d8ccb5] bg-[#f9f6ef] text-[#5c6778] hover:border-[#bfa77c] hover:text-[#8f6e33]'
                  }`}
              >
                <i className={`fa-solid ${cat.icon} mr-2 transition-transform duration-300 group-hover:scale-110`} />
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_auto] items-center">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[#8a919c] text-sm" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('home.filter.searchPlaceholder')}
                className="h-14 w-full rounded-2xl border border-[#d7cbb4] bg-[#fcf8ef] pl-11 pr-10 text-sm font-semibold text-[#2f3c4d] placeholder:text-[#9aa1ab] outline-none transition-all focus:border-[#8d6b34] focus:ring-2 focus:ring-[#dcc89f]/45"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#ece5d8] hover:bg-[#dfd4bf] text-[#5d5446] text-xs transition-colors"
                  aria-label={t('home.filter.clearSearchAria')}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>

            <div className="inline-flex h-14 items-center gap-2 rounded-full border border-[#d5c8b0] bg-[#f6f1e6] p-1.5 pr-3">
              <span className="pl-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#6f5828]">{t('filter.statusLabel')}</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PromiseStatus | 'All')}
                aria-label={t('filter.statusLabel')}
                className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#29394f] outline-none"
              >
                <option value="All">{t('filter.statusOption.all')}</option>
                <option value="Completed">{t('filter.statusOption.completed')}</option>
                <option value="In Progress">{t('filter.statusOption.inProgress')}</option>
                <option value="Delayed">{t('filter.statusOption.delayed')}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[#ddd1ba] pt-4 text-[10px] font-black uppercase tracking-[0.16em] text-[#7b8798]">
            <span className="text-[#6f5828]">{t('filter.activeView')}</span>
            <span className="rounded-full border border-[#d8ccb5] bg-white/75 px-3 py-1.5">{selectedCategoryLabel}</span>
            <span className="rounded-full border border-[#d8ccb5] bg-white/75 px-3 py-1.5">
              {statusFilter === 'All' ? t('status.all') : statusLabels[statusFilter]}
            </span>
            {searchTerm.trim() && (
              <span className="rounded-full border border-[#d8ccb5] bg-white/75 px-3 py-1.5">
                {t('home.filter.searchChip', { term: searchTerm.trim() })}
              </span>
            )}
          </div>
        </div>
      </section>

      {filteredPromises.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedPromises.map((promise) => (
              <PromiseCard key={promise.id} promise={promise} />
            ))}
          </div>

          {visibleCount < filteredPromises.length && (
            <div className="mt-14 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 15)}
                className="group inline-flex items-center gap-3 rounded-full border border-[#bea878] bg-[#f7ecd5] px-8 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#6f5728] transition-all hover:-translate-y-1 hover:bg-[#f2e1bc]"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#9c7840] text-white">
                  <i className="fa-solid fa-plus text-[10px]" />
                </span>
                {t('home.showMore')}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#cebea0] bg-[#fcf8ee] py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0e6d2] text-[#a0895f]">
            <i className="fa-solid fa-search text-2xl" />
          </div>
          <h3 className="text-lg font-black text-[#1f3148]">{t('filter.empty.title')}</h3>
          <p className="text-[#5f6c7d]">{t('filter.empty.body')}</p>
        </div>
      )}
    </main>
  );
};

const App: React.FC = () => {
  const t = useT();
  const months = useMonthNames();
  const { promises } = usePromises();
  const [location, setLocation] = useLocation();
  const [deputyDataset, setDeputyDataset] = useState<DeputyDataset>(SEED_DEPUTY_DATASET);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadDeputyDataset = async () => {
      try {
        const response = await fetch('/data/deputies-analytics.json', { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        const parsed = parseDeputyDataset(payload);
        if (active && parsed) {
          setDeputyDataset(parsed);
        }
      } catch (error) {
        console.warn('Deputy dataset fallback to seed data:', error);
      }
    };

    loadDeputyDataset();

    return () => {
      active = false;
    };
  }, []);

  const rankedDeputies = useMemo(() => rankDeputiesByActivity(deputyDataset.deputies), [deputyDataset.deputies]);
  const latestPromiseUpdateTimestamp = useMemo(() => getLatestPromiseUpdateTimestamp(promises), [promises]);
  const deputyDatasetTimestamp = useMemo(() => getDateTimestamp(deputyDataset.generatedAt), [deputyDataset.generatedAt]);
  const lastUpdatedTimestamp = useMemo(() => {
    const latestKnownTimestamp = Math.max(latestPromiseUpdateTimestamp, deputyDatasetTimestamp);
    return latestKnownTimestamp > 0 ? latestKnownTimestamp : Date.now();
  }, [latestPromiseUpdateTimestamp, deputyDatasetTimestamp]);
  const lastUpdatedLabel = useMemo(
    () => formatMonthYear(lastUpdatedTimestamp, months),
    [lastUpdatedTimestamp, months]
  );
  const topDeputiesByPromiseId = useMemo(
    () => buildTopDeputiesByPromiseId(promises, rankedDeputies),
    [promises, rankedDeputies]
  );

  const isActiveRoute = (path: string): boolean =>
    path === '/' ? location === '/' : location === path || location.startsWith(`${path}/`);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location]);

  const navigationItems: Array<{ label: string; path: string; isActive: boolean }> = [
    { label: t('nav.home'), path: '/', isActive: isActiveRoute('/') },
    { label: t('nav.methodology'), path: '/methodology', isActive: isActiveRoute('/methodology') },
    { label: t('nav.deputies'), path: '/deputetet', isActive: isActiveRoute('/deputetet') || isActiveRoute('/deputet') },
    { label: t('nav.government'), path: '/qeveria', isActive: isActiveRoute('/qeveria') },
  ];

  const footerItems: Array<{ label: string; path: string }> = [
    { label: t('nav.methodology'), path: '/methodology' },
    { label: t('nav.privacy'), path: '/privacy' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const navigateTo = (path: string): void => {
    setLocation(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f4efe4] text-[#1f2f43] selection:bg-[#f2d7a1]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
          .font-body-luxury { font-family: "Manrope", sans-serif; }
          .premium-bg {
            background-image:
              radial-gradient(circle at 10% 10%, rgba(16, 41, 73, 0.18), transparent 45%),
              radial-gradient(circle at 88% 18%, rgba(164, 126, 56, 0.25), transparent 43%),
              radial-gradient(circle at 50% 88%, rgba(16, 41, 73, 0.12), transparent 48%);
          }
        `}
      </style>

      <div className="premium-bg pointer-events-none fixed inset-0 z-0" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30 mix-blend-multiply" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22 viewBox=%220 0 240 240%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22240%22 height=%22240%22 filter=%22url(%23n)%22 opacity=%220.16%22/%3E%3C/svg%3E")' }} />

      <header className="sticky top-0 z-50 border-b border-[#d7ccb7] bg-[#f9f5eb]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between font-body-luxury">
          <button className="flex items-center gap-3 text-left" onClick={() => setLocation('/')}>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#102949] text-[#f3deaf] shadow-[0_12px_28px_-18px_rgba(16,41,73,1)]">
              <i className="fa-solid fa-landmark-flag text-lg" />
            </span>
            <span>
              <span className="block text-xl font-extrabold tracking-tight text-[#102949]">{t('header.brandLogoText')}</span>
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7d6b47] leading-none">
                {t('header.brandTagline')}
              </span>
            </span>
          </button>

          <button
            type="button"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d3c6ad] bg-[#fcf7ee] text-[#163458]"
            aria-label={isMobileMenuOpen ? t('header.mobileMenuCloseAria') : t('header.mobileMenuOpenAria')}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-main-menu"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-base`} />
          </button>

          <nav className="hidden md:flex items-center gap-6 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#5f6e84]">
            {navigationItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`transition-colors hover:text-[#102949] ${item.isActive ? 'text-[#102949]' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.path);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          id="mobile-main-menu"
          className={`md:hidden overflow-hidden border-t border-[#dfd2bb] bg-[#f7f1e4] transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-[360px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 py-3 font-body-luxury">
            <div className="flex flex-col gap-1">
              {navigationItems.map((item) => (
                <a
                  key={`mobile-${item.path}`}
                  href={item.path}
                  className={`rounded-xl px-3 py-3 text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${
                    item.isActive
                      ? 'bg-[#102949] text-[#f1d79f]'
                      : 'text-[#2b3f59] hover:bg-[#ece1cc]'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo(item.path);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <div className="relative z-10 font-body-luxury">
        <Suspense fallback={<RouteFallback />}>
        <Switch>
          <Route path="/">
            <Home lastUpdatedLabel={lastUpdatedLabel} promises={promises} />
          </Route>
          <Route path="/deputetet">
            <DeputiesDirectory dataset={deputyDataset} />
          </Route>
          <Route path="/deputet/:id">
            {(params) => {
              const deputyIndex = rankedDeputies.findIndex((deputy) => deputy.id === params.id);
              const deputy = deputyIndex >= 0 ? rankedDeputies[deputyIndex] : null;

              if (!deputy) {
                return <div className="py-20 text-center font-bold text-[#7e8795]">{t('app.notFoundDeputy')}</div>;
              }

              return (
                <DeputyProfile
                  deputy={deputy}
                  rank={deputyIndex + 1}
                  totalDeputies={rankedDeputies.length}
                  datasetSource={deputyDataset.source}
                  generatedAt={deputyDataset.generatedAt}
                />
              );
            }}
          </Route>
          <Route path="/qeveria/:id">
            {(params) => <QeveriaMinisterDetail ministryId={params.id} promises={promises} />}
          </Route>
          <Route path="/qeveria">
            <QeveriaOrgChart promises={promises} />
          </Route>
          <Route path="/methodology">
            <Methodology onBack={() => setLocation('/')} />
          </Route>
          <Route path="/contact">
            <StaticContentPage slug="contact" />
          </Route>
          <Route path="/privacy">
            <StaticContentPage slug="privacy" />
          </Route>
          <Route path="/promise/:id">
            {(params) => {
              const promise = promises.find((p) => p.id === params.id);
              if (!promise) return <div className="py-20 text-center">{t('app.notFoundPromise')}</div>;
              return <PromiseDetail promise={promise} topDeputies={topDeputiesByPromiseId.get(promise.id) || []} />;
            }}
          </Route>
          {AdminDashboard ? (
            <Route path="/admin">
              <Suspense fallback={<div className="py-20 text-center font-bold text-[#7e8795]">Loading admin…</div>}>
                <AdminDashboard />
              </Suspense>
            </Route>
          ) : null}
          <Route>
            <div className="py-20 text-center font-bold text-[#7e8795]">{t('app.notFoundPage')}</div>
          </Route>
        </Switch>
        </Suspense>
      </div>

      <footer className="relative z-10 mt-16 border-t border-[#d5ccb9] bg-[#f8f4eb] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center font-body-luxury">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#7f6d49]">{t('footer.tagline')}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {footerItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className="rounded-full border border-[#d1c4ac] bg-[#fcf7ee] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#6d5c3a] transition-colors hover:border-[#b99b67] hover:text-[#102949]"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(item.path);
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-[#5f6e83]">
            {t('footer.body')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
