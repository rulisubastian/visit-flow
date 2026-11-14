// import React from 'react';
import { Plus, LogOut, ClipboardList } from 'lucide-react';

export default function Navbar({ user, onOpenModal, onLogout }) {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/20">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
              Visit Flow
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Selamat datang, <span className="font-medium text-slate-700">{user.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenModal}
            className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rencana</span>
          </button>
          <button
            onClick={onLogout}
            className="border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-600 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition cursor-pointer"
            title="Keluar dari sesi"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
