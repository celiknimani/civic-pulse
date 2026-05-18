import React, { useEffect, useState } from 'react';
import DiffPreview from './DiffPreview';
import { persistence } from './persistence';

const DeputiesEditor: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [text, setText] = useState<string>('');

  useEffect(() => {
    persistence
      .load('deputies')
      .then((value) => {
        const cast = value as string;
        setOriginal(cast);
        setText(cast);
      })
      .catch((err) => console.error('Failed to load deputies.csv:', err));
  }, []);

  const persist = async () => {
    await persistence.save('deputies', text);
    setOriginal(text);
  };

  if (original === null) {
    return <p className="text-sm font-semibold text-[#6e7a90]">Loading deputies.csv…</p>;
  }

  const rowCount = Math.max(0, text.trim().split(/\r?\n/).length - 1);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#d8ccb5] bg-[#fbf7ef] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-black text-[#1f3148]">deputies.csv</h3>
          <span className="rounded-full border border-[#d8ccb5] bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#5c6778]">
            {rowCount} {rowCount === 1 ? 'row' : 'rows'}
          </span>
        </div>
        <p className="mb-2 text-xs font-semibold text-[#6e7a90]">
          First row is the header. At minimum: <code className="rounded bg-amber-100 px-1">name,party</code>. Optional:
          <code className="ml-1 rounded bg-amber-100 px-1">profile_url</code>.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={18}
          spellCheck={false}
          className="w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 font-mono text-xs text-[#1f3148] outline-none focus:border-[#9b7537]"
        />
      </div>

      <DiffPreview
        label="deputies.csv"
        before={original.split(/\r?\n/)}
        after={text.split(/\r?\n/)}
        onConfirm={persist}
      />
    </div>
  );
};

export default DeputiesEditor;
