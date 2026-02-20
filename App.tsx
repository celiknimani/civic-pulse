import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import DashboardStats from './components/DashboardStats';
import Methodology from './components/Methodology';
import { PromiseDetail } from './components/PromiseDetail';
import PromiseCard from './components/PromiseCard';
import DeputiesDirectory from './components/DeputiesDirectory';
import DeputyProfile from './components/DeputyProfile';
import QeveriaOrgChart from './components/QeveriaOrgChart';
import QeveriaMinisterDetail from './components/QeveriaMinisterDetail';
import { CATEGORIES, LVV_PROMISES } from './data';
import { alignDeputyTopicsToPlatformCategories, parseDeputyDataset, rankDeputiesByActivity, SEED_DEPUTY_DATASET } from './deputiesData';
import { DeputyDataset, DeputyProfile as DeputyProfileModel, PromiseDeputySignal, PromiseStatus } from './types';

const getTimestamp = (value: string): number => {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const getLatestPromiseUpdateTimestamp = (): number =>
  LVV_PROMISES.reduce((latestPromiseTimestamp, promise) => {
    if (!promise.updates?.length) return latestPromiseTimestamp;

    const latestPromiseUpdateTimestamp = promise.updates.reduce((latestUpdateTimestamp, update) => {
      const timestamp = getTimestamp(update.date);
      return Math.max(latestUpdateTimestamp, timestamp);
    }, 0);

    return Math.max(latestPromiseTimestamp, latestPromiseUpdateTimestamp);
  }, 0);

const formatMonthYearSq = (timestamp: number): string => {
  const value = new Intl.DateTimeFormat('sq-AL', { month: 'long', year: 'numeric' }).format(timestamp);
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : '';
};

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

const buildTopDeputiesByPromiseId = (rankedDeputies: DeputyProfileModel[]): Map<string, PromiseDeputySignal[]> =>
  new Map(
    LVV_PROMISES.map((promise) => [promise.id, getTopDeputiesForPromiseCategory(promise.category, rankedDeputies)])
  );

interface HomeProps {
  lastUpdatedLabel: string;
}

const Home: React.FC<HomeProps> = ({ lastUpdatedLabel }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PromiseStatus | 'All'>('All');
  const [visibleCount, setVisibleCount] = useState(15);

  const filteredPromises = useMemo(() => {
    const getLatestUpdateTimestamp = (promise: (typeof LVV_PROMISES)[number]) => {
      if (!promise.updates?.length) return 0;

      return promise.updates.reduce((latest, update) => {
        const timestamp = Date.parse(update.date);
        if (Number.isNaN(timestamp)) return latest;
        return Math.max(latest, timestamp);
      }, 0);
    };

    return LVV_PROMISES.filter((promise) => {
      const matchesCategory = selectedCategory === 'all' || promise.category === selectedCategory;
      const matchesSearch =
        promise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promise.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || promise.status === statusFilter;

      return matchesCategory && matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const latestA = getLatestUpdateTimestamp(a);
      const latestB = getLatestUpdateTimestamp(b);
      return latestB - latestA;
    });
  }, [selectedCategory, searchTerm, statusFilter]);

  const displayedPromises = useMemo(() => filteredPromises.slice(0, visibleCount), [filteredPromises, visibleCount]);

  useEffect(() => {
    setVisibleCount(15);
  }, [selectedCategory, searchTerm, statusFilter]);

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <section className="relative overflow-hidden border-b border-[#d9ccb4] pb-12 md:pb-16 mb-10">
        <div className="pointer-events-none absolute inset-0 opacity-55">
          <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-[#163255]/10 blur-3xl" />
          <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-[#b88a3a]/15 blur-3xl" />
        </div>

        <div className="relative max-w-5xl space-y-8">
          <div className="inline-flex items-center border border-[#cdbf9f] bg-[#f5efdf] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6f5c36]">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-600" />
            {`P\u00ebrdit\u00ebsimi i fundit: ${lastUpdatedLabel}`}
          </div>

          <h2
            className="text-5xl sm:text-6xl md:text-7xl font-black leading-[0.9] text-[#102949]"
            style={{ fontFamily: '"Bodoni Moda", serif' }}
          >
            {'Transparenc\u00eb p\u00ebr'}
            <span className="block text-[#b0822e]">{'\u00c7do Zotim Publik'}</span>
          </h2>

          <p className="max-w-3xl text-lg md:text-xl leading-relaxed font-medium text-[#42536a]">
            {'Monitorim i pavarur me intelegjence artificiale i premtimeve t\u00eb L\u00ebvizjes Vet\u00ebvendosje: \u00e7far\u00eb \u00ebsht\u00eb premtuar, \u00e7far\u00eb ka avancuar dhe ku progresi mbetet i ndalur.'}
          </p>

          <div className="pt-4 grid grid-cols-1 gap-6 text-[#1f3148]">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#8a7345]">Mandati: 2026-2030</p>
            </div>
          </div>
        </div>
      </section>

      <DashboardStats promises={LVV_PROMISES} />

      <section className="relative mt-8 mb-12 overflow-hidden rounded-[2rem] border border-[#d6cab4] bg-gradient-to-b from-[#f8f4ea] to-[#f2ecdf] p-6 md:p-8 shadow-[0_24px_55px_-40px_rgba(10,30,58,0.85)]">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-20 right-12 h-56 w-56 rounded-full bg-[#1d3f67]/10 blur-3xl" />
          <div className="absolute -bottom-24 left-16 h-48 w-48 rounded-full bg-[#b0833b]/15 blur-3xl" />
        </div>

        <div className="relative flex flex-col gap-7">
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group rounded-full border px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.16em] transition-all duration-300 ${
                  selectedCategory === cat.id
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
                placeholder="Kerko sipas titullit ose pershkrimit..."
                className="h-14 w-full rounded-2xl border border-[#d7cbb4] bg-[#fcf8ef] pl-11 pr-10 text-sm font-semibold text-[#2f3c4d] placeholder:text-[#9aa1ab] outline-none transition-all focus:border-[#8d6b34] focus:ring-2 focus:ring-[#dcc89f]/45"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#ece5d8] hover:bg-[#dfd4bf] text-[#5d5446] text-xs transition-colors"
                  aria-label="Pastro kerkimin"
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>

            <div className="inline-flex h-14 items-center gap-2 rounded-full border border-[#d5c8b0] bg-[#f6f1e6] p-1.5 pr-3">
              <span className="pl-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#8c7852]">Statusi</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PromiseStatus | 'All')}
                className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#29394f] outline-none"
              >
                <option value="All">Te gjitha</option>
                <option value="Completed">Te Perfunduara</option>
                <option value="In Progress">Ne Proces</option>
                <option value="Delayed">Te Vonuara</option>
              </select>
            </div>
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
                Shiko me shume
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#cebea0] bg-[#fcf8ee] py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0e6d2] text-[#a0895f]">
            <i className="fa-solid fa-search text-2xl" />
          </div>
          <h3 className="text-lg font-black text-[#1f3148]">Nuk u gjeten zotime</h3>
          <p className="text-[#5f6c7d]">Provo te ndryshosh kriteret e kerkimit.</p>
        </div>
      )}
    </main>
  );
};

const App: React.FC = () => {
  const [location, setLocation] = useLocation();
  const [deputyDataset, setDeputyDataset] = useState<DeputyDataset>(SEED_DEPUTY_DATASET);

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
  const latestPromiseUpdateTimestamp = useMemo(() => getLatestPromiseUpdateTimestamp(), []);
  const deputyDatasetTimestamp = useMemo(() => getTimestamp(deputyDataset.generatedAt), [deputyDataset.generatedAt]);
  const lastUpdatedTimestamp = useMemo(() => {
    const latestKnownTimestamp = Math.max(latestPromiseUpdateTimestamp, deputyDatasetTimestamp);
    return latestKnownTimestamp > 0 ? latestKnownTimestamp : Date.now();
  }, [latestPromiseUpdateTimestamp, deputyDatasetTimestamp]);
  const lastUpdatedLabel = useMemo(
    () => formatMonthYearSq(lastUpdatedTimestamp),
    [lastUpdatedTimestamp]
  );
  const topDeputiesByPromiseId = useMemo(
    () => buildTopDeputiesByPromiseId(rankedDeputies),
    [rankedDeputies]
  );

  const isActiveRoute = (path: string): boolean =>
    path === '/' ? location === '/' : location === path || location.startsWith(`${path}/`);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#f4efe4] text-[#1f2f43] selection:bg-[#f2d7a1]">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,600;6..96,700;6..96,800&family=Manrope:wght@400;500;600;700;800&display=swap');
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
              <span className="block text-xl font-extrabold tracking-tight text-[#102949]">ZOTIMI</span>
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#7d6b47] leading-none">
                Monitorimi i progresit 2026-2030
              </span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#5f6e84]">
            <a
              href="#"
              className={`transition-colors hover:text-[#102949] ${isActiveRoute('/') ? 'text-[#102949]' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setLocation('/');
              }}
            >
              Kreu
            </a>
            <a
              href="/methodology"
              className={`transition-colors hover:text-[#102949] ${isActiveRoute('/methodology') ? 'text-[#102949]' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setLocation('/methodology');
              }}
            >
              Si funksionon
            </a>
            <a
              href="/deputetet"
              className={`transition-colors hover:text-[#102949] ${isActiveRoute('/deputetet') || isActiveRoute('/deputet') ? 'text-[#102949]' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setLocation('/deputetet');
              }}
            >
              Deputetët
            </a>
            <a
              href="/qeveria"
              className={`transition-colors hover:text-[#102949] ${isActiveRoute('/qeveria') ? 'text-[#102949]' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setLocation('/qeveria');
              }}
            >
              Qeveria
            </a>
            <span className="rounded-full border border-[#cdbb96] bg-[#f8ebcf] px-4 py-2 text-[#8b6730]">Legjislatura e Dhjetë</span>
          </nav>
        </div>
      </header>

      <div className="relative z-10 font-body-luxury">
        <Switch>
          <Route path="/">
            <Home lastUpdatedLabel={lastUpdatedLabel} />
          </Route>
          <Route path="/deputetet">
            <DeputiesDirectory dataset={deputyDataset} />
          </Route>
          <Route path="/deputet/:id">
            {(params) => {
              const deputyIndex = rankedDeputies.findIndex((deputy) => deputy.id === params.id);
              const deputy = deputyIndex >= 0 ? rankedDeputies[deputyIndex] : null;

              if (!deputy) {
                return <div className="py-20 text-center font-bold text-[#7e8795]">Deputeti nuk u gjet.</div>;
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
            {(params) => <QeveriaMinisterDetail ministryId={params.id} promises={LVV_PROMISES} />}
          </Route>
          <Route path="/qeveria">
            <QeveriaOrgChart promises={LVV_PROMISES} />
          </Route>
          <Route path="/methodology">
            <Methodology onBack={() => setLocation('/')} />
          </Route>
          <Route path="/promise/:id">
            {(params) => {
              const promise = LVV_PROMISES.find((p) => p.id === params.id);
              if (!promise) return <div className="py-20 text-center">Premtimi nuk u gjet.</div>;
              return <PromiseDetail promise={promise} topDeputies={topDeputiesByPromiseId.get(promise.id) || []} />;
            }}
          </Route>
          <Route>
            <div className="py-20 text-center font-bold text-[#7e8795]">404 - Faqja nuk u gjet</div>
          </Route>
        </Switch>
      </div>

      <footer className="relative z-10 mt-16 border-t border-[#d5ccb9] bg-[#f8f4eb] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center font-body-luxury">
          <p className="mb-4 text-[10px] font-black uppercase tracking-[0.22em] text-[#7f6d49]">Ndertuar per transparence radikale</p>
          <i className="fa-solid fa-envelope cursor-pointer text-[#8b6f3c] transition-colors hover:text-[#102949]" />
          <p className="mx-auto mt-8 max-w-2xl text-xs leading-relaxed text-[#5f6e83]">
            Platforma eshte e pavarur dhe vizualizon progresin qeveritar bazuar ne programin zyrtar te Levizjes Vetevendosje dhe raportimet publike.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
