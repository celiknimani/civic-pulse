import React, { useEffect, useState, type ReactNode } from 'react';
import { ADMIN_MODE, setStoredCountry, setStoredToken } from './persistence';

interface AuthGateProps {
  children: ReactNode;
}

const TOKEN_KEY = 'civic-pulse:gh-pat';
const COUNTRY_KEY = 'civic-pulse:gh-country';

const readStored = (key: string): string => {
  if (typeof sessionStorage === 'undefined') return '';
  return sessionStorage.getItem(key) || '';
};

const verifyToken = async (token: string): Promise<{ login: string }> => {
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!res.ok) throw new Error(`Token rejected: HTTP ${res.status}`);
  const data = await res.json();
  return { login: data.login };
};

const AuthGate: React.FC<AuthGateProps> = ({ children }) => {
  const [token, setToken] = useState<string>(() => readStored(TOKEN_KEY));
  const [country, setCountry] = useState<string>(() => readStored(COUNTRY_KEY) || 'example');
  const [user, setUser] = useState<{ login: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (ADMIN_MODE !== 'github-pr' || !token) return;
    verifyToken(token).then(setUser).catch((err) => setError(err.message));
  }, [token]);

  if (ADMIN_MODE !== 'github-pr') {
    return <>{children}</>;
  }

  const insecureWarning =
    typeof location !== 'undefined' && location.protocol === 'http:' && location.hostname !== 'localhost' ? (
      <p className="mb-3 rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
        You are on an insecure (http://) connection. Do not paste a GitHub token here.
      </p>
    ) : null;

  if (!user) {
    return (
      <main className="relative z-10 mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#d8ccb5] bg-[#fbf7ef] p-6 shadow-[0_18px_38px_-30px_rgba(16,41,73,0.8)]">
          <h1 className="text-2xl font-black text-[#1f3148]">Sign in to GitHub</h1>
          <p className="mt-2 text-sm font-semibold text-[#5c6778]">
            The admin editor commits to your repository via a GitHub fine-grained personal access token. Token is stored in
            sessionStorage only — it disappears when you close the tab.
          </p>

          {insecureWarning}

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#8a7345]">Required PAT scopes</p>
          <ul className="mt-1 list-disc pl-5 text-xs font-semibold text-[#5c6778]">
            <li>Repository access: only this repo</li>
            <li>Contents: read &amp; write</li>
            <li>Pull requests: read &amp; write</li>
          </ul>

          <form
            className="mt-4 space-y-3"
            onSubmit={async (event) => {
              event.preventDefault();
              setPending(true);
              setError(null);
              try {
                const verified = await verifyToken(token);
                setStoredToken(token);
                setStoredCountry(country);
                setUser(verified);
              } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
              } finally {
                setPending(false);
              }
            }}
          >
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">Country code</span>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value.trim().toLowerCase())}
                placeholder="example"
                className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 text-sm font-semibold text-[#1f3148] outline-none focus:border-[#9b7537]"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">GitHub PAT</span>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="github_pat_..."
                autoComplete="off"
                className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 font-mono text-xs text-[#1f3148] outline-none focus:border-[#9b7537]"
              />
            </label>
            <button
              type="submit"
              disabled={!token || pending}
              className="w-full rounded-full border border-[#0e2744] bg-[#102949] px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#f4ddab] disabled:opacity-50"
            >
              {pending ? 'Verifying…' : 'Sign in'}
            </button>
            {error ? <p className="text-xs font-semibold text-rose-700">{error}</p> : null}
          </form>
        </div>
      </main>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-2 text-xs font-semibold text-[#5c6778]">
        <span>
          Signed in as <code className="rounded bg-amber-100 px-1">{user.login}</code>
        </span>
        <button
          type="button"
          onClick={() => {
            setStoredToken(null);
            setToken('');
            setUser(null);
          }}
          className="rounded-full border border-[#d8ccb5] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#5c6778]"
        >
          Sign out
        </button>
      </div>
      {children}
    </>
  );
};

export default AuthGate;
