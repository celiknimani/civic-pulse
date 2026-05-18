import React, { useEffect, useState, type ReactNode } from 'react';
import { ADMIN_MODE, persistence } from './persistence';

interface CountryInfo {
  country: string;
  countryDir?: string;
  config: {
    code: string;
    name: string;
    nativeName?: string;
    locale: string;
    trackedParty?: { name?: string; code?: string };
  };
}

interface AdminLayoutProps {
  activeTab: string;
  onSwitchTab: (tab: string) => void;
  children: ReactNode;
}

const TABS = [
  { id: 'promises', label: 'Promises' },
  { id: 'government', label: 'Government' },
  { id: 'deputies', label: 'Deputies' },
  { id: 'sources', label: 'Sources' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, onSwitchTab, children }) => {
  const [info, setInfo] = useState<CountryInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    persistence
      .countryInfo()
      .then((data) => setInfo(data as CountryInfo))
      .catch((err) => setError(err.message || String(err)));
  }, []);

  return (
    <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 md:py-14">
      <header className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-700">
              {ADMIN_MODE === 'github-pr' ? 'GitHub PR editor' : 'Dev-only editor'}
            </p>
            <h1 className="mt-1 text-2xl font-black text-[#1f3148]">
              civic-pulse admin {info ? `· ${info.config.name}` : ''}
            </h1>
            <p className="mt-1 text-xs font-semibold text-[#6e7a90]">
              {ADMIN_MODE === 'github-pr'
                ? 'Saves open a pull request against your repo. Nothing lands on main without a review.'
                : (
                  <>
                    Edits write directly to <code className="rounded bg-amber-100 px-1">{info?.countryDir || '…'}</code>.
                    Review your changes with <code>git diff</code> and commit normally.
                  </>
                )}
            </p>
          </div>
          {info ? (
            <span className="rounded-full border border-amber-400 bg-amber-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-amber-800">
              {info.config.code} · {info.config.locale}
            </span>
          ) : null}
        </div>
      </header>

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-300 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-700">
          Admin API error: {error}
        </div>
      ) : null}

      <nav className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSwitchTab(tab.id)}
            className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition-colors ${
              activeTab === tab.id
                ? 'border-[#0e2744] bg-[#102949] text-[#f4ddab]'
                : 'border-[#d8ccb5] bg-[#f9f6ef] text-[#5c6778] hover:border-[#bfa77c]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section>{children}</section>
    </main>
  );
};

export default AdminLayout;
