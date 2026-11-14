// import React from 'react';
import { Building2, CheckCircle2, Clock } from 'lucide-react';

export default function SummaryCards({ summary }) {
  const cards = [
    {
      label: 'Total Rencana',
      value: summary.total,
      icon: Building2,
      accentBorder: 'border-l-4 border-l-slate-700',
      valueColor: 'text-slate-900',
      iconBg: 'bg-slate-100 text-slate-700',
    },
    {
      label: 'Sudah Dikunjungi',
      value: summary.visited,
      icon: CheckCircle2,
      accentBorder: 'border-l-4 border-l-emerald-500',
      valueColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Belum Dikunjungi',
      value: summary.notVisited,
      icon: Clock,
      accentBorder: 'border-l-4 border-l-amber-500',
      valueColor: 'text-amber-600',
      iconBg: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`rounded-xl border border-slate-200/90 ${card.accentBorder} bg-white p-5 shadow-xs flex items-center justify-between transition hover:shadow-sm`}
          >
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.label}
              </p>
              <p className={`text-3xl font-bold mt-1.5 ${card.valueColor}`}>{card.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
