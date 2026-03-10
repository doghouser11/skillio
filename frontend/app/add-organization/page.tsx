'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const API = 'https://api.skillio.live';

export default function AddOrganizationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', category: '', description: '', phone: '', email: '', website: '', city: 'София', neighborhood: '', price: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [duplicateWarning, setDuplicateWarning] = useState('');

  useEffect(() => {
    fetch(`${API}/api/schools/`).then(r => r.json()).then(d => {
      if (Array.isArray(d)) setExistingNames(d.map((s: any) => s.name?.toLowerCase().trim()).filter(Boolean));
    }).catch(() => {});
  }, []);

  const checkDuplicate = (name: string) => {
    const n = name.toLowerCase().trim();
    if (n.length < 3) { setDuplicateWarning(''); return; }
    const match = existingNames.find(e => e === n || e.includes(n) || n.includes(e));
    setDuplicateWarning(match ? `⚠️ Вече има подобна организация: "${match}". Проверете дали не е същата.` : '');
  };

  if (!user) {
    if (typeof window !== 'undefined') router.push('/login');
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Пренасочване...</div>;
  }

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.category) { setMsg('Име, дейност и град са задължителни'); return; }
    setLoading(true); setMsg('');
    try {
      const token = localStorage.getItem('token');
      const payload = { ...form, description: [form.description, form.price ? `💰 Цена: ${form.price}` : ''].filter(Boolean).join('\n') };
      const res = await fetch(`${API}/api/schools/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Грешка'); }
      setMsg('✅ Изпратено за одобрение! Ще се появи след преглед от администратор.');
      setForm({ name: '', category: '', description: '', phone: '', email: '', website: '', city: 'София', neighborhood: '', price: '' });
    } catch (e: any) { setMsg('❌ ' + e.message); }
    finally { setLoading(false); }
  };

  const cities = ['София', 'Пловдив', 'Варна', 'Бургас', 'Русе', 'Стара Загора', 'Плевен', 'Добрич', 'Друг'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Добави организация / учител</h1>
        <p className="text-gray-600 mb-8 text-sm">Познавате страхотен учител или клуб? Добавете го тук и ние ще го прегледаме.</p>

        <form onSubmit={submit} className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Име *</label>
            <input value={form.name} onChange={e => { set('name', e.target.value); checkDuplicate(e.target.value); }} required placeholder="напр. Учител Иван — Английски език"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            {duplicateWarning && <p className="text-xs text-orange-600 mt-1">{duplicateWarning}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дейност *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">— Изберете дейност —</option>
              <option value="outdoor-sports">⚽ Спорт на открито</option>
              <option value="indoor-sports">🏀 Закрит спорт</option>
              <option value="languages">🌍 Езици</option>
              <option value="science">🔬 Природни науки / IT</option>
              <option value="art">🎨 Изкуство</option>
              <option value="music-dance">🎵 Музика и танци</option>
              <option value="martial-arts">🥋 Бойни изкуства</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Какво предлага, за какви възрасти, опит..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Град *</label>
              <select value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+359..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Квартал</label>
            <input value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} placeholder="напр. Лозенец, Младост 1..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имейл</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цена (ориентировъчна)</label>
            <input value={form.price} onChange={e => set('price', e.target.value)} placeholder="напр. 30-50 €/час, 80 €/месец, По договаряне"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Уебсайт / Facebook</label>
            <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>

          {msg && <p className="text-sm">{msg}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
            {loading ? 'Изпращане...' : 'Изпрати за одобрение'}
          </button>
        </form>
      </div>
    </div>
  );
}
