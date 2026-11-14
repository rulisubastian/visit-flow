import { useState, useEffect, useCallback } from 'react';
import api from './api';
import { AlertCircle } from 'lucide-react';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import SummaryCards from './components/SummaryCards';
import FilterBar from './components/FilterBar';
import ActivityTable from './components/ActivityTable';
import AddActivityModal from './components/AddActivityModal';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('visitflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState({ total: 0, visited: 0, notVisited: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    segment: '',
    status: '',
    from: '',
    to: '',
  });

  useEffect(() => {
    const handleForceLogout = () => setUser(null);
    window.addEventListener('auth-logout', handleForceLogout);
    return () => window.removeEventListener('auth-logout', handleForceLogout);
  }, []);

  const fetchActivities = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.search.trim()) params.search = filters.search.trim();
      if (filters.segment) params.segment = filters.segment;
      if (filters.status) params.status = filters.status;
      if (filters.from) params.from = filters.from;
      if (filters.to) params.to = filters.to;

      const res = await api.get('/activities', { params });
      setActivities(res.data.data);
      setSummary(res.data.summary);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data rencana kunjungan.');
    } finally {
      setLoading(false);
    }
  }, [user, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchActivities();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchActivities]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // Abaikan error network saat logout
    } finally {
      localStorage.removeItem('visitflow_token');
      localStorage.removeItem('visitflow_user');
      setUser(null);
    }
  };

  const handleToggleStatus = async (activity) => {
    const newStatus = activity.status === 'VISITED' ? 'NOT_VISITED' : 'VISITED';
    setUpdatingId(activity.id);
    try {
      await api.patch(`/activities/${activity.id}`, { status: newStatus });
      await fetchActivities();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui status kunjungan.');
    } finally {
      setUpdatingId(null);
    }
  };

  const resetFilters = () => {
    setFilters({ search: '', segment: '', status: '', from: '', to: '' });
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.segment || filters.status || filters.from || filters.to
  );

  if (!user) {
    return <LoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800">
      <Navbar user={user} onOpenModal={() => setShowModal(true)} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <SummaryCards summary={summary} />

        <FilterBar
          filters={filters}
          onChangeFilter={setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <ActivityTable
          activities={activities}
          loading={loading}
          updatingId={updatingId}
          hasActiveFilters={hasActiveFilters}
          onToggleStatus={handleToggleStatus}
          onResetFilters={resetFilters}
        />
      </main>

      <AddActivityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchActivities}
      />
    </div>
  );
}
