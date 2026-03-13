'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const API = 'https://api.skillio.live';

const CATEGORIES = [
  { name: 'Всички', slug: '' },
  { name: 'Спорт на открито', slug: 'outdoor-sports' },
  { name: 'Закрит спорт', slug: 'indoor-sports' },
  { name: 'Езици', slug: 'languages' },
  { name: 'Природни науки', slug: 'science' },
  { name: 'Изкуство', slug: 'art' },
  { name: 'Музика и танци', slug: 'music-dance' },
  { name: 'Бойни изкуства', slug: 'martial-arts' },
  { name: 'Образование', slug: 'education' },
];

const CATEGORY_NAMES_MAP: Record<string, string> = {
  'outdoor-sports': 'Спорт на открито',
  'indoor-sports': 'Закрит спорт',
  'languages': 'Езици',
  'science': 'Природни науки',
  'art': 'Изкуство',
  'music-dance': 'Музика и танци',
  'martial-arts': 'Бойни изкуства',
  'education': 'Образование',
};

interface School { id: string; name: string; description?: string; city: string; neighborhood?: string; phone?: string; email?: string; website?: string; verified: boolean; category?: string; created_at?: string; created_by?: string; claimed_by?: string | null; claimed_at?: string | null; }

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

function ReviewPanel({ schoolId, createdBy }: { schoolId: string; createdBy?: string }) {
  const { user } = useAuth();
  const isOwner = user && createdBy && user.id === createdBy;
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
          {isOwner ? (
            <p className="text-sm text-gray-400 italic">Вие добавихте тази организация и не можете да я оценявате.</p>
          ) : (
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
          )}
        </>
      )}
    </div>
  );
}

function InquiryModal({ school, onClose }: { school: School; onClose: () => void }) {
  const [form, setForm] = useState({ parent_name: '', parent_email: '', parent_phone: '', child_age: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/inquiries/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_id: school.id,
          parent_name: form.parent_name,
          parent_email: form.parent_email,
          parent_phone: form.parent_phone || undefined,
          child_age: form.child_age ? parseInt(form.child_age) : undefined,
          message: form.message,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Грешка'); }
      setResult('success');
    } catch (e: any) {
      setResult('error:' + e.message);
    } finally { setSubmitting(false); }
  };

  if (result === 'success') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
          <div className="text-5xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Запитването е изпратено!</h3>
          <p className="text-gray-600 mb-6">Запитването ви беше регистрирано. Ще направим всичко възможно да го предадем на организацията.</p>
          <button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium">Затвори</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">📩 Запитване към {school.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        {result?.startsWith('error:') && <p className="text-red-600 text-sm mb-3">❌ {result.slice(6)}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Вашето име *</label>
            <input required value={form.parent_name} onChange={e => setForm({...form, parent_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input required type="email" value={form.parent_email} onChange={e => setForm({...form, parent_email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
            <input value={form.parent_phone} onChange={e => setForm({...form, parent_phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Възраст на детето</label>
            <input type="number" min="1" max="18" value={form.child_age} onChange={e => setForm({...form, child_age: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Съобщение *</label>
            <textarea required rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none" placeholder="Какво ви интересува?" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-50 transition-colors">
            {submitting ? 'Изпращане...' : '📩 Изпрати запитване'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SchoolsPage() {
  const searchParams = useSearchParams();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [inquirySchool, setInquirySchool] = useState<School | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/schools/`, { headers: { Accept: 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          // Sort newest first
          // Claimed and parent-added first, then by date
          const SEED_UUID = '4a212536-a4ea-4b97-ac67-d38ef23ebc59';
          data.sort((a: any, b: any) => {
            const aScore = a.claimed_by ? 2 : (a.created_by && a.created_by !== SEED_UUID) ? 1 : 0;
            const bScore = b.claimed_by ? 2 : (b.created_by && b.created_by !== SEED_UUID) ? 1 : 0;
            if (aScore !== bScore) return bScore - aScore;
            return (b.created_at || '').localeCompare(a.created_at || '');
          });
          setSchools(data);
        }
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  // SEO meta tags - update document title based on filters
  useEffect(() => {
    const categoryName = category ? CATEGORY_NAMES_MAP[category] : null;
    let title = 'Организации за деца | Skillio';
    
    if (categoryName && cityFilter) {
      title = `${categoryName} в ${cityFilter} | Skillio`;
    } else if (categoryName) {
      title = `${categoryName} | Skillio`;
    } else if (cityFilter) {
      title = `Дейности за деца в ${cityFilter} | Skillio`;
    }
    
    document.title = title;
  }, [category, cityFilter]);

  const filtered = schools.filter(s => {
    if (cityFilter && s.city?.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (category && s.category !== category) return false;
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
            <div key={s.id} className={`rounded-xl p-6 hover:shadow-md transition-shadow ${s.claimed_by ? 'bg-green-50 border-2 border-green-200' : (s.created_by && s.created_by !== '4a212536-a4ea-4b97-ac67-d38ef23ebc59') ? 'bg-blue-50 border-2 border-blue-200' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <Link href={`/schools/${s.id}`} className="font-bold text-lg text-gray-900 line-clamp-2 hover:text-green-700 transition-colors">{s.name}</Link>
                {(s.claimed_by || (s.created_by && s.created_by !== '4a212536-a4ea-4b97-ac67-d38ef23ebc59')) && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2 whitespace-nowrap">✓</span>}
              </div>
              {s.category && <span className="inline-block text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full mb-2">{CATEGORY_LABELS[s.category] || s.category}</span>}
              {s.description && <p className="text-gray-600 text-sm mb-4 line-clamp-3">{s.description}</p>}
              <div className="space-y-1 text-sm text-gray-500 mb-4">
                <div>📍 {s.city}{s.neighborhood ? `, ${s.neighborhood}` : ''}</div>
                {s.phone && <div>📞 {s.phone}</div>}
                {s.email && <div>✉️ {s.email}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setInquirySchool(s)}
                  className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-bold transition-colors">
                  📩 Запитване
                </button>
                {s.website && (
                  <a href={s.website} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                    Сайт
                  </a>
                )}
                <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">
                  ⭐ Отзиви
                </button>
              </div>
              {/* Share buttons */}
              <div className="flex justify-center gap-3 mt-3">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://skillio.live/schools?search=${s.name}`)}`}
                   target="_blank" rel="noopener noreferrer"
                   className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors">
                  f Споделяне
                </a>
                <a href={`viber://forward?text=${encodeURIComponent(`Виж ${s.name} в Skillio: https://skillio.live/schools`)}`}
                   className="text-purple-600 hover:text-purple-800 text-xs font-medium transition-colors">
                  📱 Viber
                </a>
              </div>
              {/* Claim badge - only for claimed or parent-added */}
              {s.claimed_by ? (
                <div className="mt-2 text-center"><span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Потвърден профил</span></div>
              ) : s.created_by && s.created_by !== '4a212536-a4ea-4b97-ac67-d38ef23ebc59' ? (
                <div className="mt-2 text-center">
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">👤 Добавено от родител</span>
                </div>
              ) : null}
              {expanded === s.id && <ReviewPanel schoolId={s.id} createdBy={s.created_by} />}
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
        <h2 className="text-2xl font-bold mb-3">Познавате страхотен учител?</h2>
        <p className="mb-6 opacity-90">Добавете го и помогнете на други родители да го намерят!</p>
        <Link href="/add-organization" className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Добавете организация
        </Link>
      </div>

      {inquirySchool && <InquiryModal school={inquirySchool} onClose={() => setInquirySchool(null)} />}
    </div>
  );
}
