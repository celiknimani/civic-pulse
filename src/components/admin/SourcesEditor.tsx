import React, { useEffect, useState } from 'react';
import DiffPreview from './DiffPreview';
import { persistence } from './persistence';

const SourcesEditor: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [probe, setProbe] = useState<{ pending: boolean; result?: { title?: string; fetchedAt?: string; cached?: boolean; excerpt?: string }; error?: string }>({ pending: false });

  useEffect(() => {
    persistence
      .load('sources')
      .then((value) => {
        const cast = value as string;
        setOriginal(cast);
        setText(cast);
      })
      .catch((err) => console.error('Failed to load sources.yaml:', err));
  }, []);

  const persist = async () => {
    await persistence.save('sources', text);
    setOriginal(text);
  };

  const testProbe = async (url: string) => {
    if (!url) return;
    setProbe({ pending: true });
    try {
      const data = await persistence.probeSource(url);
      setProbe({ pending: false, result: data });
    } catch (err) {
      setProbe({ pending: false, error: err instanceof Error ? err.message : String(err) });
    }
  };

  if (original === null) {
    return <p className="text-sm font-semibold text-[#6e7a90]">Loading sources.yaml…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#d8ccb5] bg-[#fbf7ef] p-4">
        <h3 className="mb-2 text-sm font-black text-[#1f3148]">sources.yaml</h3>
        <p className="mb-2 text-xs font-semibold text-[#6e7a90]">
          Edit the registry directly. The server validates that the body contains a top-level <code className="rounded bg-amber-100 px-1">sources:</code> key before writing.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={22}
          spellCheck={false}
          className="w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 font-mono text-xs text-[#1f3148] outline-none focus:border-[#9b7537]"
        />
      </div>

      <div className="rounded-2xl border border-[#d8ccb5] bg-[#fbf7ef] p-4">
        <h3 className="mb-2 text-sm font-black text-[#1f3148]">Probe a source URL</h3>
        <p className="mb-2 text-xs font-semibold text-[#6e7a90]">
          Useful when adding a new source — paste a URL and the dev server fetches it through the cached HTML adapter so you can confirm the page is reachable + see the extracted title and a preview.
        </p>
        <ProbeForm onSubmit={testProbe} pending={probe.pending} />
        {probe.result ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            <p>Title: {probe.result.title || '(none)'}</p>
            <p>Fetched at: {probe.result.fetchedAt}</p>
            <p>Cache hit: {probe.result.cached ? 'yes' : 'no'}</p>
            <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded bg-white p-2 font-mono text-[11px] text-emerald-900">{probe.result.excerpt}</pre>
          </div>
        ) : null}
        {probe.error ? (
          <p className="mt-3 text-xs font-semibold text-rose-700">{probe.error}</p>
        ) : null}
      </div>

      <DiffPreview
        label="sources.yaml"
        before={original.split(/\r?\n/)}
        after={text.split(/\r?\n/)}
        onConfirm={persist}
      />
    </div>
  );
};

const ProbeForm: React.FC<{ onSubmit: (url: string) => void; pending: boolean }> = ({ onSubmit, pending }) => {
  const [url, setUrl] = useState('');
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(url.trim());
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.gov/news/..."
        className="flex-1 rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 text-xs font-semibold text-[#1f3148] outline-none"
      />
      <button
        type="submit"
        disabled={pending || !url}
        className="rounded-full border border-[#cdbb96] bg-[#f8ebcf] px-4 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#735a2e] disabled:opacity-50"
      >
        {pending ? 'Fetching…' : 'Probe'}
      </button>
    </form>
  );
};

export default SourcesEditor;
