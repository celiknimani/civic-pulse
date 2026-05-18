import React, { useMemo, useState } from 'react';
import { diff, summarize, type DiffEntry } from './diff';

interface DiffPreviewProps {
  label: string;
  before: unknown;
  after: unknown;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  disabled?: boolean;
}

const DiffPreview: React.FC<DiffPreviewProps> = ({ label, before, after, onConfirm, onCancel, disabled }) => {
  const entries: DiffEntry[] = useMemo(() => diff(before, after), [before, after]);
  const summary = useMemo(() => summarize(entries), [entries]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setPending(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPending(false);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border border-[#d8ccb5] bg-[#fbf7ef] px-4 py-3 text-xs font-semibold text-[#6e7a90]">
        No changes to {label}.
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-[#d8ccb5] bg-[#fbf7ef] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#1f3148]">
          {label} · {entries.length} change{entries.length === 1 ? '' : 's'}
        </h3>
        <div className="flex items-center gap-2">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-[#d8ccb5] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#5c6778]"
              disabled={pending}
            >
              Cancel
            </button>
          ) : null}
          <button
            type="button"
            onClick={confirm}
            className="rounded-full border border-[#0e2744] bg-[#102949] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#f4ddab] disabled:opacity-50"
            disabled={pending || disabled}
          >
            {pending ? 'Saving…' : 'Save to disk'}
          </button>
        </div>
      </div>
      <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-lg bg-[#fdfaf2] p-3 font-mono text-[11px] leading-relaxed text-[#3f4f64]">
{summary}
      </pre>
      {error ? <p className="text-xs font-semibold text-rose-700">{error}</p> : null}
    </div>
  );
};

export default DiffPreview;
