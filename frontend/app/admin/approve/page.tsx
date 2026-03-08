'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const API = 'https://api.skillio.live';

interface School {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  city: string;
  neighborhood?: string;
  website?: string;
  verified: boolean;
  status: string;
  created_at?: string;
}

export default function AdminApprovePage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState<'pending' | 'approved' | 'all'>('pending');

  useEffect(() => {
    if (!isAdmin) { router.push('/'); return; }
    loadSchools();
  }, [isAdmin]);

  const loadSchools = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/admin/schools`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      // Newest first
      data.sort((a: School, b: School) => (b.created_at || '').localeCompare(a.created_at || ''));
      setSchools(data);
    } catch (e: any) {
      console.error('Load error:', e);
      setMsg('Грешка при зареждане');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/admin/schools/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'approved' }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'APPROVED', verified: true } : s));
      setMsg('✅ Одобрена!');
      setTimeout(() => setMsg(''), 2000);
    } catch (e: any) {
      setMsg('❌ Грешка: ' + e.message);
    }
  };

  const reject = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/admin/schools/${id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (!res.ok) throw new Error(`${res.status}`);
      setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'REJECTED', verified: false } : s));
      setMsg('❌ Отхвърлена');
      setTimeout(() => setMsg(''), 2000);
    } catch (e: any) {
      setMsg('❌ Грешка: ' + e.message);
    }
  };

  const filtered = schools.filter(s => {
    if (tab === 'pending') return s.status === 'PENDING';
    if (tab === 'approved') return s.status === 'APPROVED';
    return true;
  });

  const statusLabel = (s: string) => {
    if (s === 'APPROVED') return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Одобрена</span>;
    if (s === 'REJECTED') return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">❌ Отхвърлена</span>;
    return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⏳ Чака</span>;
  };

  const pendingCount = schools.filter(s => s.status === 'PENDING').length;
  const approvedCount = schools.filter(s => s.status === 'APPROVED').length;

  if (loading) return <div className="min-h-screen flex items-center justify-center">Зареждане...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📋 Управление на организации</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 border'}`}>
            ⏳ Чакащи ({pendingCount})
          </button>
          <button onClick={() => setTab('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'approved' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}>
            ✅ Одобрени ({approvedCount})
          </button>
          <button onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'all' ? 'bg-gray-700 text-white' : 'bg-white text-gray-700 border'}`}>
            Всички ({schools.length})
          </button>
        </div>

        {msg && <div className="mb-4 p-3 bg-blue-50 rounded text-sm">{msg}</div>}

        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            {tab === 'pending' ? 'Няма чакащи организации' : 'Няма организации'}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{s.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {statusLabel(s.status)}
                      <span className="text-xs text-gray-400">
                        {s.created_at ? new Date(s.created_at).toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                </div>
                {s.description && <p className="text-gray-600 text-sm mb-2">{s.description}</p>}
                <div className="text-sm text-gray-500 space-y-0.5 mb-3">
                  <div>📍 {s.city}{s.neighborhood ? `, ${s.neighborhood}` : ''}</div>
                  {s.phone && <div>📞 {s.phone}</div>}
                  {s.email && <div>✉️ {s.email}</div>}
                  {s.website && <div>🔗 <a href={s.website} target="_blank" className="text-blue-600 hover:underline">{s.website}</a></div>}
                </div>
                {s.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button onClick={() => approve(s.id)}
                      className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm">
                      ✅ Одобри
                    </button>
                    <button onClick={() => reject(s.id)}
                      className="px-5 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold text-sm">
                      ❌ Отхвърли
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
