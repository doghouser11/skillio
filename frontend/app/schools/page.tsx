'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Star } from 'lucide-react';

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

interface School { id: string; name: string; description?: string; city: string; phone?: string; email?: string; website?: string; verified: boolean; category?: string; }
interface Review { id: string; rating: number; comment?: string; created_at: string; parent: { id: string; email: string }; }

function StarRating({ rating, onClick }: { rating: number; onClick?: (n: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star key={n} className={`w-5 h-5 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${onClick ? 'cursor-pointer' : ''}`}
          onClick={() => onClick?.(n)} />
      ))}
    </div>
  );
}

function ReviewPanel({ schoolId }: { schoolId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { loadReviews(); }, [schoolId]);

  const loadReviews = async () => {
    try {
      const res = await fetch(`${API}/api/reviews/school/${schoolId}`);
      if (res.ok) setReviews(await res.json());
    } catch {} finally { setLoading(false); }
  };

  const submit = async () => {
    if (rating === 0) return;
    setSubmitting(true); setMsg('');
    try {
      const token = localStorage.getItem('token');
      if (!token) { setMsg('Влезте в профила си, за да оставите отзив'); setSubmitting(false); return; }
      const res = await fetch(`${API}/api/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ school_id: schoolId, rating, comment: comment || undefined }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Грешка'); }
      setMsg('✅ Благодарим за отзива!');
      setRating(0); setComment('');
      loadReviews();
    } catch (e: any) { setMsg('❌ ' + e.message); }
    finally { setSubmitting(false); }
  };

  const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      {loading ? <p className="text-sm text-gray-400">Зареждане...</p> : (
        <>
          {avg && <div className="flex items-center gap-2 mb-3"><StarRating rating={Math.round(Number(avg))} /><span className="text-sm font-medium text-gray-700">{avg} ({reviews.length})</span></div>}

          {/* Existing reviews */}
          {reviews.length > 0 && (
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
              {reviews.map(r => (
                <div key={r.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={r.rating} />
                    <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('bg-BG')}</span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Add review */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Оставете отзив:</p>
            <StarRating rating={rating} onClick={setRating} />
            {rating > 0 && (
              <>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Коментар (незадължително)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" rows={2} />
                <button onClick={submit} disabled={submitting}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                  {submitting ? '...' : 'Изпрати'}
                </button>
              </>
            )}
            {msg && <p className="text-sm">{msg}</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default function SchoolsPage() {
  const searchParams = useSearchParams();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [cityFilter, setCityFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/emergency/schools`, { headers: { Accept: 'application/json' } });
        if (res.ok) setSchools(await res.json());
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const filtered = schools.filter(s => {
    if (cityFilter && s.city?.toLowerCase() !== cityFilter.toLowerCase()) return false;
    return true;
  });

  const cities = [...new Set(schools.map(s => s.city).filter(Boolean))].sort();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Зареждане...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Организации</h1>
      <p className="text-gray-600 mb-8">Проверени образователни институции в цяла България</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(c => (
          <button key={c.slug} onClick={() => setCategory(c.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === c.slug ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm" value={cityFilter} onChange={e => setCityFilter(e.target.value)}>
          <option value="">Всички градове</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{s.name}</h3>
                {s.verified && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">✓</span>}
              </div>
              {s.description && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{s.description}</p>}
              <div className="space-y-1 text-sm text-gray-500 mb-4">
                <div>📍 {s.city}</div>
                {s.phone && <div>📞 {s.phone}</div>}
                {s.email && <div>✉️ {s.email}</div>}
              </div>
              <div className="flex gap-2">
                {s.website && (
                  <a href={s.website} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Сайт
                  </a>
                )}
                <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">
                  ⭐ Отзиви
                </button>
              </div>
              {expanded === s.id && <ReviewPanel schoolId={s.id} />}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <div className="text-5xl mb-4">🏫</div>
          <p className="text-lg">Няма намерени организации</p>
        </div>
      )}

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
