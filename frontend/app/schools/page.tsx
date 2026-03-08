'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live';

const CATEGORIES = [
  { name: 'Всички', slug: '' },
  { name: 'Спорт на открито', slug: 'outdoor-sports' },
  { name: 'Закрит спорт', slug: 'indoor-sports' },
  { name: 'Езици', slug: 'languages' },
  { name: 'Природни науки', slug: 'science' },
  { name: 'Изкуство', slug: 'art' },
  { name: 'Музика и танци', slug: 'music-dance' },
];

interface School {
  id: string;
  name: string;
  description?: string;
  city: string;
  phone?: string;
  email?: string;
  website?: string;
  verified: boolean;
  category?: string;
}

export default function SchoolsPage() {
  const searchParams = useSearchParams();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      const res = await fetch(`${API}/api/emergency/schools`, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error('Failed');
      setSchools(await res.json());
    } catch { setSchools([]); }
    finally { setLoading(false); }
  };

  const filtered = schools.filter(s => {
    if (cityFilter && s.city?.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (category && s.category !== category) return true; // TODO: match when schools have category field
    return true;
  });

  const cities = [...new Set(schools.map(s => s.city).filter(Boolean))].sort();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Зареждане...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Организации</h1>
      <p className="text-gray-600 mb-8">Проверени образователни институции в цяла България</p>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button
            key={c.slug}
            onClick={() => setCategory(c.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === c.slug ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* City filter */}
      <div className="mb-8">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
        >
          <option value="">Всички градове</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{s.name}</h3>
                {s.verified && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">✓ Проверено</span>}
              </div>
              {s.description && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{s.description}</p>}
              <div className="space-y-1 text-sm text-gray-500 mb-4">
                <div>📍 {s.city}</div>
                {s.phone && <div>📞 {s.phone}</div>}
                {s.email && <div>✉️ {s.email}</div>}
              </div>
              {s.website && (
                <a href={s.website} target="_blank" rel="noopener noreferrer"
                  className="block w-full text-center bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                  Посети сайт
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🏫</div>
          <p className="text-lg">Няма намерени организации</p>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 bg-green-700 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-3">Имате организация?</h2>
        <p className="mb-6 opacity-90">Присъединете се и достигнете до повече семейства.</p>
        <Link href="/register?role=school" className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Започнете сега
        </Link>
      </div>
    </div>
  );
}
