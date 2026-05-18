import React, { useEffect, useMemo, useState } from 'react';
import DiffPreview from './DiffPreview';
import { persistence } from './persistence';
import type { PartyPromise, PromiseStatus, PromiseUpdate } from '@core/types';

const STATUS_OPTIONS: PromiseStatus[] = ['Completed', 'In Progress', 'Delayed', 'Pending'];

const PromiseEditor: React.FC = () => {
  const [originalRows, setOriginalRows] = useState<PartyPromise[] | null>(null);
  const [rows, setRows] = useState<PartyPromise[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [autofill, setAutofill] = useState<{ pending: boolean; error?: string }>({ pending: false });

  useEffect(() => {
    persistence
      .load('promises')
      .then((data) => {
        const rowsLoaded = data as PartyPromise[];
        setOriginalRows(rowsLoaded);
        setRows(rowsLoaded);
        setSelectedId(rowsLoaded[0]?.id ?? null);
      })
      .catch((err) => console.error('Failed to load promises:', err));
  }, []);

  const selected = useMemo(() => rows.find((row) => row.id === selectedId) || null, [rows, selectedId]);

  const updateSelected = (patch: Partial<PartyPromise>) => {
    if (!selected) return;
    setRows((prev) => prev.map((row) => (row.id === selected.id ? { ...row, ...patch } : row)));
  };

  const appendUpdate = () => {
    if (!selected) return;
    const today = new Date().toISOString().slice(0, 10);
    const next: PromiseUpdate = {
      date: today,
      status: selected.status,
      description: '',
      source: '',
      sourceUrl: '',
    };
    updateSelected({ updates: [...(selected.updates || []), next] });
  };

  const editUpdate = (index: number, patch: Partial<PromiseUpdate>) => {
    if (!selected) return;
    const updates = (selected.updates || []).map((entry, i) => (i === index ? { ...entry, ...patch } : entry));
    updateSelected({ updates });
  };

  const removeUpdate = (index: number) => {
    if (!selected) return;
    const updates = (selected.updates || []).filter((_, i) => i !== index);
    updateSelected({ updates });
  };

  const autofillSource = async (index: number) => {
    if (!selected) return;
    const updates = selected.updates || [];
    const target = updates[index];
    if (!target?.sourceUrl) return;
    setAutofill({ pending: true });
    try {
      const data = await persistence.probeSource(target.sourceUrl);
      editUpdate(index, {
        source: target.source || data.title || target.sourceUrl,
        recordedAt: data.fetchedAt,
      });
      setAutofill({ pending: false });
    } catch (err) {
      setAutofill({ pending: false, error: err instanceof Error ? err.message : String(err) });
    }
  };

  const persist = async () => {
    await persistence.save('promises', rows);
    setOriginalRows(rows);
  };

  if (!originalRows) {
    return <p className="text-sm font-semibold text-[#6e7a90]">Loading promises…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-[#d8ccb5] bg-[#fbf7ef] p-3">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">
            {rows.length} promises
          </p>
          <ul className="max-h-[480px] space-y-1 overflow-auto">
            {rows.map((row) => (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(row.id)}
                  className={`block w-full rounded-lg border px-3 py-2 text-left text-xs font-bold transition-colors ${
                    row.id === selectedId
                      ? 'border-[#102949] bg-[#102949] text-[#f4ddab]'
                      : 'border-[#e1d7c4] bg-white text-[#1f3148] hover:border-[#bfa77c]'
                  }`}
                >
                  <span className="block text-[9px] font-black uppercase tracking-[0.14em] text-amber-700">
                    #{row.id} · {row.category}
                  </span>
                  <span className="mt-1 block leading-tight">{row.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {selected ? (
          <section className="space-y-3 rounded-2xl border border-[#d8ccb5] bg-[#fbf7ef] p-4">
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">Title</span>
              <input
                type="text"
                value={selected.title}
                onChange={(e) => updateSelected({ title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 text-sm font-semibold text-[#1f3148] outline-none focus:border-[#9b7537]"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">Description</span>
              <textarea
                value={selected.description}
                onChange={(e) => updateSelected({ description: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 text-sm font-semibold text-[#1f3148] outline-none focus:border-[#9b7537]"
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">Status</span>
                <select
                  value={selected.status}
                  onChange={(e) => updateSelected({ status: e.target.value as PromiseStatus })}
                  className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 text-sm font-bold text-[#1f3148] outline-none focus:border-[#9b7537]"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">
                  Progress: {selected.progress}%
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={selected.progress}
                  onChange={(e) => updateSelected({ progress: Number(e.target.value) })}
                  className="mt-2 w-full"
                />
              </label>
            </div>

            <div className="mt-4 space-y-3 rounded-xl border border-[#e1d7c4] bg-white p-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-[#1f3148]">Dated updates</h4>
                <button
                  type="button"
                  onClick={appendUpdate}
                  className="rounded-full border border-[#0e2744] bg-[#102949] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#f4ddab]"
                >
                  + Add update
                </button>
              </div>
              {(selected.updates || []).map((update, index) => (
                <div key={index} className="space-y-2 rounded-lg border border-[#e1d7c4] bg-[#fbf7ef] p-3">
                  <div className="grid gap-2 md:grid-cols-3">
                    <input
                      type="date"
                      value={update.date || ''}
                      onChange={(e) => editUpdate(index, { date: e.target.value })}
                      className="rounded-lg border border-[#d8ccb5] bg-white px-2 py-1 text-xs font-semibold text-[#1f3148] outline-none"
                    />
                    <select
                      value={update.status}
                      onChange={(e) => editUpdate(index, { status: e.target.value as PromiseStatus })}
                      className="rounded-lg border border-[#d8ccb5] bg-white px-2 py-1 text-xs font-semibold text-[#1f3148] outline-none"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeUpdate(index)}
                      className="rounded-full border border-rose-300 bg-rose-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={update.description}
                    onChange={(e) => editUpdate(index, { description: e.target.value })}
                    rows={2}
                    placeholder="Description"
                    className="w-full rounded-lg border border-[#d8ccb5] bg-white px-2 py-1 text-xs font-semibold text-[#1f3148] outline-none"
                  />
                  <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                    <input
                      type="text"
                      value={update.source || ''}
                      onChange={(e) => editUpdate(index, { source: e.target.value })}
                      placeholder="Source label"
                      className="rounded-lg border border-[#d8ccb5] bg-white px-2 py-1 text-xs font-semibold text-[#1f3148] outline-none"
                    />
                    <input
                      type="url"
                      value={update.sourceUrl || ''}
                      onChange={(e) => editUpdate(index, { sourceUrl: e.target.value })}
                      placeholder="https://"
                      className="rounded-lg border border-[#d8ccb5] bg-white px-2 py-1 text-xs font-semibold text-[#1f3148] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => autofillSource(index)}
                      disabled={autofill.pending || !update.sourceUrl}
                      className="rounded-full border border-[#cdbb96] bg-[#f8ebcf] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#735a2e] disabled:opacity-50"
                    >
                      {autofill.pending ? 'Fetching…' : 'Autofill'}
                    </button>
                  </div>
                </div>
              ))}
              {autofill.error ? <p className="text-xs font-semibold text-rose-700">{autofill.error}</p> : null}
            </div>
          </section>
        ) : (
          <p className="text-sm font-semibold text-[#6e7a90]">Select a promise to edit.</p>
        )}
      </div>

      <DiffPreview label="promises.json" before={originalRows} after={rows} onConfirm={persist} />
    </div>
  );
};

export default PromiseEditor;
