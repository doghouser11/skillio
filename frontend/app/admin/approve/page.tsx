'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const API = 'https://api.skillio.live';

interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  website: string;
  verified: boolean;
  status: string;
}

export default function AdminApprovePage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

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
      // Show unverified first
      setSchools(data.filter((s: School) => !s.verified));
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
      setSchools(prev => prev.filter(s => s.id !== id));
      setMsg('✅ Одобрена!');
      setTimeout(() => setMsg(''), 2000);
    } catch (e: any) {
      setMsg('❌ Грешка: ' + e.message);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Зареждане...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📋 Одобряване на организации</h1>
        {msg && <div className="mb-4 p-3 bg-blue-50 rounded text-sm">{msg}</div>}

        {schools.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500">
            Няма чакащи организации
          </div>
        ) : (
          <div className="space-y-4">
            {schools.map(s => (
              <div key={s.id} className="bg-white rounded-lg p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{s.name}</h3>
                  <p className="text-gray-600 text-sm">{s.email} · {s.phone} · {s.city}</p>
                  {s.website && <a href={s.website} target="_blank" className="text-blue-600 text-sm hover:underline">{s.website}</a>}
                </div>
                <button
                  onClick={() => approve(s.id)}
                  className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm"
                >
                  ✅ Одобри
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
