// import React from 'react';
import {
  CheckCircle2,
  Clock,
  Loader2,
  Building2,
  Calendar,
  UserCheck,
  MapPin,
} from 'lucide-react';

export default function ActivityTable({
  activities,
  loading,
  updatingId,
  hasActiveFilters,
  onToggleStatus,
  onResetFilters,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-16 flex flex-col items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm font-medium">Memuat daftar rencana kunjungan...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3.5">
          <Building2 className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Tidak ada rencana kunjungan</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Data tidak ditemukan untuk kombinasi pencarian atau filter yang dipilih.
        </p>
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
          >
            Hapus Semua Filter
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-5">Entitas</th>
              <th className="py-3.5 px-4">Segmen</th>
              <th className="py-3.5 px-4">Wilayah</th>
              <th className="py-3.5 px-4">Sales</th>
              <th className="py-3.5 px-4">Tanggal</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {activities.map((item) => {
              const isVisited = item.status === 'VISITED';
              return (
                <tr key={item.id} className="hover:bg-blue-50/30 transition">
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-800">{item.entityName}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.entityType}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        item.segment === 'B2G'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/70'
                          : 'bg-sky-50 text-sky-700 border border-sky-200/70'
                      }`}
                    >
                      {item.segment}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.region}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{item.salesName}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{item.visitDate}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    {isVisited ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        VISITED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        NOT_VISITED
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onToggleStatus(item)}
                      disabled={updatingId === item.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition disabled:opacity-50 cursor-pointer ${
                        isVisited
                          ? 'border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100/70'
                          : 'border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/70'
                      }`}
                    >
                      {updatingId === item.id
                        ? 'Menyimpan...'
                        : isVisited
                        ? 'Tandai NOT_VISITED'
                        : 'Tandai VISITED'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
