import React, { useState, useEffect } from 'react';
import api from '../api';
import { AlertCircle, Loader2, X } from 'lucide-react';

export default function AddActivityModal({ isOpen, onClose, onSuccess }) {
  const [entities, setEntities] = useState([]);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [form, setForm] = useState({
    segment: 'B2G',
    entityId: '',
    visitDate: '',
    salesName: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const loadEntities = async () => {
      setLoadingEntities(true);
      try {
        const res = await api.get('/entities', {
          params: { segment: form.segment },
        });
        setEntities(res.data);
        setForm((prev) => ({
          ...prev,
          entityId: res.data.length > 0 ? res.data[0].id : '',
        }));
      } catch {
        setEntities([]);
      } finally {
        setLoadingEntities(false);
      }
    };
    loadEntities();
  }, [isOpen, form.segment]);

  if (!isOpen) return null;

  const handleClose = () => {
    setFormErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const clientErrors = {};
    if (!form.entityId) clientErrors.entityId = ['Silakan pilih entitas tujuan.'];
    if (!form.segment) clientErrors.segment = ['Silakan pilih segmen.'];
    if (!form.visitDate) clientErrors.visitDate = ['Tanggal kunjungan wajib diisi.'];
    if (!form.salesName.trim()) clientErrors.salesName = ['Nama Sales wajib diisi.'];

    if (Object.keys(clientErrors).length > 0) {
      setFormErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/activities', form);
      setForm({ segment: 'B2G', entityId: '', visitDate: '', salesName: '' });
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 422 && err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      } else {
        setFormErrors({ general: [err.response?.data?.message || 'Gagal menyimpan data.'] });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Tambah Rencana Kunjungan</h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {formErrors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formErrors.general[0]}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Segmen */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Segmen *</label>
            {React.createElement(
              'select',
              {
                value: form.segment,
                onChange: (e) => setForm({ ...form, segment: e.target.value }),
                className: inputClass,
              },
              React.createElement('option', { value: 'B2G' }, 'B2G (Business to Government)'),
              React.createElement('option', { value: 'B2B' }, 'B2B (Business to Business)')
            )}
            {formErrors.segment && (
              <p className="text-xs text-red-600 mt-1">{formErrors.segment[0]}</p>
            )}
          </div>

          {/* Input Entitas */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Entitas Tujuan *
            </label>
            {loadingEntities ? (
              <div className="text-xs text-slate-500 py-2 flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Memuat daftar entitas...</span>
              </div>
            ) : (
              React.createElement(
                'select',
                {
                  value: form.entityId,
                  onChange: (e) => setForm({ ...form, entityId: e.target.value }),
                  className: inputClass,
                },
                React.createElement('option', { value: '' }, '-- Pilih Entitas --'),
                entities.map((ent) =>
                  React.createElement('option', { key: ent.id, value: ent.id }, ent.displayLabel)
                )
              )
            )}
            {formErrors.entityId && (
              <p className="text-xs text-red-600 mt-1">{formErrors.entityId[0]}</p>
            )}
          </div>

          {/* Input Nama Sales */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Sales *</label>
            <input
              type="text"
              placeholder="Masukkan nama sales bertugas"
              value={form.salesName}
              onChange={(e) => setForm({ ...form, salesName: e.target.value })}
              className={inputClass}
            />
            {formErrors.salesName && (
              <p className="text-xs text-red-600 mt-1">{formErrors.salesName[0]}</p>
            )}
          </div>

          {/* Input Tanggal Kunjungan */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tanggal Kunjungan *
            </label>
            <input
              type="date"
              value={form.visitDate}
              onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
              className={inputClass}
            />
            {formErrors.visitDate && (
              <p className="text-xs text-red-600 mt-1">{formErrors.visitDate[0]}</p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5 transition cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{submitting ? 'Menyimpan...' : 'Simpan Rencana'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
