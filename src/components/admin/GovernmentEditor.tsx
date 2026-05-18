import React, { useEffect, useState } from 'react';
import DiffPreview from './DiffPreview';
import { persistence } from './persistence';

interface PrimeMinister {
  role: string;
  name: string;
  tookOfficeDate: string;
}

interface Ministry {
  id: string;
  portfolio: string;
  minister: string;
  tookOfficeDate: string;
  officialWebsiteUrl?: string;
  accent: string;
  focusCategories: string[];
  promiseIds: string[];
}

interface GovernmentData {
  primeMinister: PrimeMinister;
  ministries: Ministry[];
}

const GovernmentEditor: React.FC = () => {
  const [original, setOriginal] = useState<GovernmentData | null>(null);
  const [data, setData] = useState<GovernmentData | null>(null);

  useEffect(() => {
    persistence
      .load('government')
      .then((value) => {
        const cast = value as GovernmentData;
        setOriginal(cast);
        setData(cast);
      })
      .catch((err) => console.error('Failed to load government:', err));
  }, []);

  if (!data || !original) {
    return <p className="text-sm font-semibold text-[#6e7a90]">Loading government…</p>;
  }

  const updatePm = (patch: Partial<PrimeMinister>) =>
    setData({ ...data, primeMinister: { ...data.primeMinister, ...patch } });

  const updateMinistry = (index: number, patch: Partial<Ministry>) =>
    setData({
      ...data,
      ministries: data.ministries.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    });

  const persist = async () => {
    await persistence.save('government', data);
    setOriginal(data);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#d8ccb5] bg-[#fbf7ef] p-4">
        <h3 className="mb-3 text-sm font-black text-[#1f3148]">Head of government</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block">
            <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">Role</span>
            <input
              type="text"
              value={data.primeMinister.role}
              onChange={(e) => updatePm({ role: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 text-sm font-semibold text-[#1f3148] outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">Name</span>
            <input
              type="text"
              value={data.primeMinister.name}
              onChange={(e) => updatePm({ name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 text-sm font-semibold text-[#1f3148] outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">Took office</span>
            <input
              type="date"
              value={data.primeMinister.tookOfficeDate}
              onChange={(e) => updatePm({ tookOfficeDate: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-3 py-2 text-sm font-semibold text-[#1f3148] outline-none"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#d8ccb5] bg-[#fbf7ef] p-4">
        <h3 className="mb-3 text-sm font-black text-[#1f3148]">Ministries ({data.ministries.length})</h3>
        <div className="space-y-3">
          {data.ministries.map((ministry, index) => (
            <div key={ministry.id} className="rounded-xl border border-[#e1d7c4] bg-white p-3">
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">#{ministry.id}</p>
              <div className="grid gap-2 md:grid-cols-2">
                <label className="block">
                  <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">Portfolio</span>
                  <input
                    type="text"
                    value={ministry.portfolio}
                    onChange={(e) => updateMinistry(index, { portfolio: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-2 py-1 text-xs font-semibold text-[#1f3148] outline-none"
                  />
                </label>
                <label className="block">
                  <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">Minister</span>
                  <input
                    type="text"
                    value={ministry.minister}
                    onChange={(e) => updateMinistry(index, { minister: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-2 py-1 text-xs font-semibold text-[#1f3148] outline-none"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#8a7345]">
                    Promise IDs (comma-separated)
                  </span>
                  <input
                    type="text"
                    value={ministry.promiseIds.join(', ')}
                    onChange={(e) => updateMinistry(index, {
                      promiseIds: e.target.value
                        .split(',')
                        .map((id) => id.trim())
                        .filter(Boolean),
                    })}
                    className="mt-1 w-full rounded-lg border border-[#d8ccb5] bg-white px-2 py-1 text-xs font-semibold text-[#1f3148] outline-none"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DiffPreview label="government.json" before={original} after={data} onConfirm={persist} />
    </div>
  );
};

export default GovernmentEditor;
