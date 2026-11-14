// import React from 'react';
import { Search, FilterX } from 'lucide-react';

export default function FilterBar({ filters, onChangeFilter, onReset, hasActiveFilters }) {
  const updateField = (field, value) => {
    onChangeFilter((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Input Pencarian */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari nama entitas atau nama sales..."
            value={filters.search}
            onChange={(e) => updateField('search', e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
          />
        </div>

        {/* Filter Segmen */}
        <div className="md:col-span-2">
          <select
            value={filters.segment}
            onChange={(e) => updateField('segment', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
          >
            <option value="">Semua Segmen</option>
            <option value="B2G">Segmen B2G</option>
            <option value="B2B">Segmen B2B</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="md:col-span-3">
          <select
            value={filters.status}
            onChange={(e) => updateField('status', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition"
          >
            <option value="">Semua Status</option>
            <option value="NOT_VISITED">NOT_VISITED</option>
            <option value="VISITED">VISITED</option>
          </select>
        </div>

        {/* Tombol Reset */}
        <div className="md:col-span-2">
          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className="w-full px-3 py-2 text-sm font-medium border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white rounded-xl flex items-center justify-center gap-1.5 text-slate-600 transition cursor-pointer"
          >
            <FilterX className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Filter Rentang Tanggal */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Rentang Tanggal:
        </span>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.from}
            onChange={(e) => updateField('from', e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-600"
          />
          <span className="text-slate-400 text-xs font-medium">s/d</span>
          <input
            type="date"
            value={filters.to}
            onChange={(e) => updateField('to', e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
