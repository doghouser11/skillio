'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const API = 'https://api.skillio.live';

const CATEGORY_LABELS: Record<string, string> = {
  'outdoor-sports': '⚽ Спорт на открито',
  'indoor-sports': '🏀 Закрит спорт',
  'languages': '🌍 Езици',
  'science': '🔬 Науки / IT',
  'art': '🎨 Изкуство',
  'music-dance': '🎵 Музика и танци',
  'martial-arts': '🥋 Бойни изкуства',
  'education': '📚 Образование',
};

const CATEGORY_OPTIONS = [
  { value: '', label: 'Без категория' },
  { value: 'outdoor-sports', label: 'Спорт на открито' },
  { value: 'indoor-sports', label: 'Закрит спорт' },
  { value: 'languages', label: 'Езици' },
  { value: 'science', label: 'Науки / IT' },
  { value: 'art', label: 'Изкуство' },
  { value: 'music-dance', label: 'Музика и танци' },
  { value: 'martial-arts', label: 'Бойни изкуства' },
  { value: 'education', label: 'Образование' },
];

interface School {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  city: string;
  neighborhood?: string;
  address?: string;
  website?: string;
  category?: string;
  verified: boolean;
  status: string;
  created_at?: string;
  claimed_by?: string | null;
}

export default function AdminApprovePage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState<'pending' | 'approved' | 'all'>('all');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<School>>({});

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
      setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'approved', verified: true } : s));
      showMsg('✅ Одобрена!');
    } catch (e: any) {
      showMsg('❌ Грешка: ' + e.message);
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
      setSchools(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected', verified: false } : s));
      showMsg('❌ Отхвърлена');
    } catch (e: any) {
      showMsg('❌ Грешка: ' + e.message);
    }
  };

  const deleteSchool = async (id: string, name: string) => {
    if (!window.confirm(`Сигурни ли сте, че искате да изтриете "${name}"?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/schools/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Грешка'); }
      setSchools(prev => prev.filter(s => s.id !== id));
      showMsg('🗑️ Изтрита!');
    } catch (e: any) {
      showMsg('❌ Грешка: ' + e.message);
    }
  };

  const startEdit = (school: School) => {
    setEditingId(school.id);
    setEditForm({
      name: school.name,
      city: school.city,
      description: school.description || '',
      phone: school.phone || '',
      email: school.email || '',
      website: school.website || '',
      category: school.category || '',
      neighborhood: school.neighborhood || '',
      address: school.address || '',
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/schools/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Грешка'); }
      const updated = await res.json();
      setSchools(prev => prev.map(s => s.id === editingId ? { ...s, ...updated } : s));
      setEditingId(null);
      showMsg('✅ Запазено!');
    } catch (e: any) {
      showMsg('❌ Грешка: ' + e.message);
    }
  };

  const showMsg = (text: string) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000);
  };

  const pendingCount = schools.filter(s => s.status.toLowerCase() === 'pending').length;
  const approvedCount = schools.filter(s => s.status.toLowerCase() === 'approved').length;

  const filtered = schools.filter(s => {
    if (tab === 'pending' && s.status.toLowerCase() !== 'pending') return false;
    if (tab === 'approved' && s.status.toLowerCase() !== 'approved') return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || (s.category || '').toLowerCase().includes(q);
    }
    return true;
  });

  const editFields: { key: keyof School; label: string; type?: string }[] = [
    { key: 'name', label: 'Име' },
    { key: 'city', label: 'Град' },
    { key: 'neighborhood', label: 'Квартал' },
    { key: 'address', label: 'Адрес' },
    { key: 'phone', label: 'Телефон' },
    { key: 'email', label: 'Email' },
    { key: 'website', label: 'Уебсайт' },
    { key: 'description', label: 'Описание', type: 'textarea' },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Зареждане...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">📋 Управление на организации</h1>
        <p className="text-gray-500 text-sm mb-6">Общо: {schools.length} организации</p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
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

        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Търси по име, град или категория..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm mb-4 bg-white"
        />

        {msg && <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm font-medium">{msg}</div>}

        <p className="text-xs text-gray-400 mb-4">Показани: {filtered.length}</p>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            {search ? 'Няма резултати' : tab === 'pending' ? 'Няма чакащи организации 🎉' : 'Няма организации'}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(s => (
              <div key={s.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                {editingId === s.id ? (
                  /* Edit form */
                  <div className="space-y-3">
                    {editFields.map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
                        {f.type === 'textarea' ? (
                          <textarea value={(editForm as any)[f.key] || ''} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3} />
                        ) : (
                          <input value={(editForm as any)[f.key] || ''} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Категория</label>
                      <select value={editForm.category || ''} onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveEdit} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold">💾 Запази</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm font-medium">Отказ</button>
                    </div>
                  </div>
                ) : (
                  /* View */
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{s.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {s.status.toLowerCase() === 'approved' && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Одобрена</span>}
                          {s.status.toLowerCase() === 'pending' && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">⏳ Чака</span>}
                          {s.status.toLowerCase() === 'rejected' && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">❌ Отхвърлена</span>}
                          {s.claimed_by && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">🔗 Заявена</span>}
                          {s.category && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{CATEGORY_LABELS[s.category] || s.category}</span>}
                          <span className="text-xs text-gray-400">
                            {s.created_at ? new Date(s.created_at).toLocaleDateString('bg-BG', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    {s.description && <p className="text-gray-600 text-sm mb-2">{s.description}</p>}
                    <div className="text-sm text-gray-500 space-y-0.5 mb-3">
                      <div>📍 {s.city}{s.neighborhood ? `, ${s.neighborhood}` : ''}{s.address ? ` · ${s.address}` : ''}</div>
                      {s.phone && <div>📞 {s.phone}</div>}
                      {s.email && <div>✉️ {s.email}</div>}
                      {s.website && <div>🔗 <a href={s.website} target="_blank" className="text-blue-600 hover:underline">{s.website}</a></div>}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {s.status.toLowerCase() === 'pending' && (
                        <>
                          <button onClick={() => approve(s.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm">
                            ✅ Одобри
                          </button>
                          <button onClick={() => reject(s.id)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold text-sm">
                            ❌ Отхвърли
                          </button>
                        </>
                      )}
                      <button onClick={() => startEdit(s)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium">
                        ✏️ Редактирай
                      </button>
                      <button onClick={() => deleteSchool(s.id, s.name)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium">
                        🗑️ Изтрий
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
