import React, { useState, useMemo } from 'react';
import { Zotim } from '../searchData';
import { PromiseStatus } from '../types';
import PromiseCard from './PromiseCard';

interface PromiseTrackerProps {
    promises: Zotim[];
    onPromiseClick: (p: Zotim) => void;
}

const normalizeForDedup = (value: string): string =>
    value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const hasDefenseBillionSignal = (value: string): boolean => {
    const normalized = normalizeForDedup(value);
    const hasDefense = /(ushtri|ushtarak|armat|mbrojt|kufir|nato)/.test(normalized);
    const hasOneBillion = /\b(?:mbi\s+)?1\s+miliard/.test(normalized);
    return hasDefense && hasOneBillion;
};

const getPromiseDisplayScore = (promise: Zotim): number => {
    let score = 0;
    const normalizedText = normalizeForDedup(promise.text);
    const normalizedDetail = normalizeForDedup(promise.detail);

    if (/\b(?:mbi\s+)?1\s+miliard/.test(normalizedText)) score += 2;
    if (/\b(?:mbi\s+)?1\s+miliard/.test(normalizedDetail)) score += 1;
    if (!normalizedDetail.startsWith('konteksti')) score += 1;

    return score;
};

const getDedupKey = (promise: Zotim): string => {
    const party = String(promise.partyId);
    const category = normalizeForDedup(promise.category);
    const normalizedText = normalizeForDedup(promise.text);
    const combined = `${promise.text} ${promise.detail}`;

    if (hasDefenseBillionSignal(combined)) {
        return `${party}|${category}|defense-1-billion`;
    }

    return `${party}|${category}|${normalizedText}`;
};

const PromiseTracker: React.FC<PromiseTrackerProps> = ({ promises, onPromiseClick }) => {
    const [filterStatus, setFilterStatus] = useState<PromiseStatus | 'ALL'>('ALL');
    const [filterCategory, setFilterCategory] = useState<string>('ALL');
    const [search, setSearch] = useState('');

    const categories = useMemo(() => Array.from(new Set(promises.map(p => p.category))), [promises]);

    const [visibleCount, setVisibleCount] = useState(9);

    const filtered = useMemo(() => {
        const matched = promises.filter(p => {
            const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
            const matchCategory = filterCategory === 'ALL' || p.category === filterCategory;
            const matchSearch = p.text.toLowerCase().includes(search.toLowerCase()) ||
                p.detail.toLowerCase().includes(search.toLowerCase());
            return matchStatus && matchCategory && matchSearch;
        });

        const deduped = new Map<string, Zotim>();

        matched.forEach(promise => {
            const key = getDedupKey(promise);
            const existing = deduped.get(key);

            if (!existing || getPromiseDisplayScore(promise) > getPromiseDisplayScore(existing)) {
                deduped.set(key, promise);
            }
        });

        return Array.from(deduped.values());
    }, [promises, filterStatus, filterCategory, search]);

    const visiblePromises = filtered.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 9);
    };

    const stats = {
        total: promises.length,
        completed: promises.filter(p => p.status === PromiseStatus.Completed).length,
        inProgress: promises.filter(p => p.status === PromiseStatus.InProgress).length,
        pending: promises.filter(p => p.status === PromiseStatus.Pending).length,
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-12">

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="text-3xl font-black text-slate-900">{stats.total}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Totali i Zotimeve</div>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                    <div className="text-3xl font-black text-emerald-600">{stats.completed}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Të Realizuara</div>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                    <div className="text-3xl font-black text-blue-600">{stats.inProgress}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-400">Në Proces</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div className="text-3xl font-black text-slate-500">{stats.pending}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Në Pritje</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex-1 w-full relative">
                    <i className="fa-solid fa-search absolute left-4 top-3.5 text-slate-300"></i>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Kërko zotimin..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl font-bold text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-sm text-slate-600 outline-none cursor-pointer hover:bg-slate-100 border-r-8 border-transparent"
                >
                    <option value="ALL">Të gjitha Kategoritë</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as PromiseStatus | 'ALL')}
                    className="px-4 py-3 bg-slate-50 rounded-xl font-bold text-sm text-slate-600 outline-none cursor-pointer hover:bg-slate-100 border-r-8 border-transparent"
                >
                    <option value="ALL">Të gjitha Statuset</option>
                    <option value={PromiseStatus.Pending}>Në Pritje</option>
                    <option value={PromiseStatus.InProgress}>Në Proces</option>
                    <option value={PromiseStatus.Completed}>E Realizuar</option>
                    <option value={PromiseStatus.Delayed}>E Vonuar</option>
                    <option value={PromiseStatus.Broken}>E Shkelur</option>
                </select>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visiblePromises.map((promise, idx) => (
                            <PromiseCard key={idx} promise={promise} onClick={() => onPromiseClick(promise)} />
                        ))}
                    </div>

                    {visibleCount < filtered.length && (
                        <div className="flex justify-center">
                            <button
                                onClick={handleLoadMore}
                                className="group flex flex-col items-center space-y-2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Shiko më shumë zotime</span>
                                <i className="fa-solid fa-chevron-down animate-bounce group-hover:text-red-500 transition-colors"></i>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <i className="fa-solid fa-filter-circle-xmark text-4xl text-slate-300 mb-4"></i>
                    <h3 className="text-lg font-bold text-slate-500">Nuk u gjetën zotime me këto kritere.</h3>
                </div>
            )}

        </div>
    );
};

export default PromiseTracker;
