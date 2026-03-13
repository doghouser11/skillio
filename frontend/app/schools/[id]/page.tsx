'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

interface School { id: string; name: string; description?: string; city: string; neighborhood?: string; address?: string; phone?: string; email?: string; website?: string; verified: boolean; category?: string; created_at?: string; created_by?: string; claimed_by?: string | null; claimed_at?: string | null; }
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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">⭐ Отзиви</h2>
      {loading ? <p className="text-sm text-gray-400">Зареждане...</p> : (
        <>
          {avg && <div className="flex items-center gap-2 mb-4"><StarRating rating={Math.round(Number(avg))} /><span className="text-sm font-medium text-gray-700">{avg} ({reviews.length} отзива)</span></div>}
          {reviews.length > 0 && (
            <div className="space-y-3 mb-6">
              {reviews.map(r => (
                <div key={r.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={r.rating} />
                    <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('bg-BG')}</span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
          {reviews.length === 0 && <p className="text-sm text-gray-400 mb-4">Все още няма отзиви. Бъдете първи!</p>}
          {isOwner ? (
            <p className="text-sm text-gray-400 italic">Вие добавихте тази организация и не можете да я оценявате.</p>
          ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Оставете отзив:</p>
            <StarRating rating={rating} onClick={setRating} />
            {rating > 0 && (
              <>
                <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Коментар (незадължително)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" rows={3} />
                <button onClick={submit} disabled={submitting}
                  className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors">
                  {submitting ? '...' : 'Изпрати отзив'}
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
          <p className="text-gray-600 mb-6">Запитването ви беше изпратено на организацията. Очаквайте отговор от тях.</p>
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

export default function SchoolDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/schools/${id}`);
        if (!res.ok) throw new Error();
        setSchool(await res.json());
      } catch { setError(true); }
      finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    if (school) document.title = `${school.name} | Skillio`;
  }, [school]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Зареждане...</div>;
  if (error || !school) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
      <div className="text-5xl mb-4">🏫</div>
      <p className="text-lg mb-4">Организацията не е намерена</p>
      <Link href="/schools" className="text-green-700 hover:underline font-medium">← Обратно към организациите</Link>
    </div>
  );

  const shareUrl = `https://skillio.live/schools/${school.id}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: school.name,
    description: school.description || '',
    address: {
      '@type': 'PostalAddress',
      addressLocality: school.city,
      streetAddress: school.address || '',
      addressCountry: 'BG',
    },
    ...(school.phone && { telephone: school.phone }),
    ...(school.email && { email: school.email }),
    url: shareUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link href="/schools" className="text-green-700 hover:underline text-sm font-medium mb-6 inline-block">← Всички организации</Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">{school.name}</h1>
            {school.verified && <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">✓ Потвърдена</span>}
          </div>

          {school.category && (
            <span className="inline-block text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full mb-4 font-medium">
              {CATEGORY_LABELS[school.category] || school.category}
            </span>
          )}

          {/* Claim badge */}
          {school.claimed_by ? (
            <div className="mb-4"><span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">✓ Потвърден профил</span></div>
          ) : (
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">👤 Добавено от родител</span>
              {user ? (
                <button onClick={async () => {
                  if (!confirm('Потвърждавате ли, че това е вашата организация?')) return;
                  try {
                    const token = localStorage.getItem('token');
                    const res = await fetch(`${API}/api/schools/${school.id}/claim`, {
                      method: 'POST', headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!res.ok) { const d = await res.json(); alert(d.detail || 'Грешка'); return; }
                    alert('✓ Профилът е заявен успешно!');
                    setSchool({ ...school, claimed_by: user.id });
                  } catch { alert('Грешка при заявяване'); }
                }} className="text-xs text-blue-600 hover:underline">Това вашата организация ли е?</button>
              ) : (
                <Link href={`/register?redirect=/schools/${school.id}`} className="text-xs text-blue-600 hover:underline">Това вашата организация ли е?</Link>
              )}
            </div>
          )}

          {/* Description */}
          {school.description && <p className="text-gray-700 leading-relaxed mb-6">{school.description}</p>}

          {/* Contact info */}
          <div className="space-y-2 text-sm mb-6">
            <div className="text-gray-500">📍 {school.city}{school.neighborhood ? `, ${school.neighborhood}` : ''}{school.address ? ` — ${school.address}` : ''}</div>
            {school.phone && <div><a href={`tel:${school.phone}`} className="text-green-700 hover:underline">📞 {school.phone}</a></div>}
            {school.email && <div><a href={`mailto:${school.email}`} className="text-green-700 hover:underline">✉️ {school.email}</a></div>}
            {school.website && <div><a href={school.website} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">🌐 {school.website}</a></div>}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button onClick={() => setShowInquiry(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors">
              📩 Запитване
            </button>
            {school.website && (
              <a href={school.website} target="_blank" rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                🌐 Уебсайт
              </a>
            )}
          </div>

          {/* Share buttons */}
          <div className="flex gap-4">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
               target="_blank" rel="noopener noreferrer"
               className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              f Сподели във Facebook
            </a>
            <a href={`viber://forward?text=${encodeURIComponent(`Виж ${school.name} в Skillio: ${shareUrl}`)}`}
               className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors">
              📱 Сподели във Viber
            </a>
          </div>
        </div>

        {/* Reviews */}
        <ReviewPanel schoolId={school.id} createdBy={school.created_by} />

        {/* Inquiry modal */}
        {showInquiry && <InquiryModal school={school} onClose={() => setShowInquiry(false)} />}
      </div>
    </>
  );
}
