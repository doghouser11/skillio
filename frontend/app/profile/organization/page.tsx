'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const API = 'https://api.skillio.live';

export default function OrganizationProfilePage() {
  const { user, isSchool } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: '', 
    category: '', 
    description: '', 
    phone: '', 
    email: '', 
    website: '', 
    city: 'София', 
    neighborhood: '', 
    price: '',
    address: '',
    facility: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Redirect if not authenticated or not a school
  useEffect(() => {
    if (user && !isSchool) {
      router.push('/');
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, isSchool, router]);

  if (!user || !isSchool) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Пренасочване...</div>;
  }

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.city || !form.category) { 
      setMsg('Име на организацията, дейност и град са задължителни'); 
      return; 
    }
    
    setLoading(true); 
    setMsg('');
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare payload with all form data
      const payload = {
        name: form.name,
        category: form.category,
        city: form.city,
        neighborhood: form.neighborhood,
        phone: form.phone,
        email: form.email,
        website: form.website,
        // Combine description fields
        description: [
          form.description,
          form.address ? `📍 Адрес: ${form.address}` : '',
          form.facility ? `🏢 Спортна база: ${form.facility}` : '',
          form.price ? `💰 Цена: ${form.price}` : ''
        ].filter(Boolean).join('\n')
      };
      
      const res = await fetch(`${API}/api/schools/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) { 
        const d = await res.json(); 
        throw new Error(d.detail || 'Грешка при запазване на профила'); 
      }
      
      setMsg('✅ Профилът е изпратен за одобрение! Ще се появи в платформата след преглед от администратор.');
      
      // Redirect to home after successful submission
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (e: any) { 
      setMsg('❌ ' + e.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const cities = ['София', 'Пловдив', 'Варна', 'Бургас', 'Русе', 'Стара Загора', 'Плевен', 'Добрич', 'Друг'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Създайте вашия профил</h1>
          <p className="text-gray-600">Попълнете информацията за вашата организация, за да я видят родителите</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-xl p-8 border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Име на организацията *
              </label>
              <input 
                value={form.name} 
                onChange={e => set('name', e.target.value)} 
                required 
                placeholder="напр. Спортен клуб Левски, Училище за танци Ритъм"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Дейност *</label>
              <select 
                value={form.category} 
                onChange={e => set('category', e.target.value)} 
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Град *</label>
              <select 
                value={form.city} 
                onChange={e => set('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Описание / Опит
            </label>
            <textarea 
              value={form.description} 
              onChange={e => set('description', e.target.value)} 
              rows={4} 
              placeholder="Опишете вашата организация, опит, какво предлагате, за какви възрасти..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
              <input 
                value={form.address} 
                onChange={e => set('address', e.target.value)} 
                placeholder="ул. Примерна 10, София"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Квартал</label>
              <input 
                value={form.neighborhood} 
                onChange={e => set('neighborhood', e.target.value)} 
                placeholder="напр. Лозенец, Младост 1..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Спортна база / Помещение
            </label>
            <input 
              value={form.facility} 
              onChange={e => set('facility', e.target.value)} 
              placeholder="напр. Зала в НДК, Стадион Васил Левски, Собствена зала"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Цена (ако искате)</label>
              <input 
                value={form.price} 
                onChange={e => set('price', e.target.value)} 
                placeholder="напр. 30-50 €/час, 80 €/месец, По договаряне"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
              <input 
                value={form.phone} 
                onChange={e => set('phone', e.target.value)} 
                placeholder="+359..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Имейл</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={e => set('email', e.target.value)} 
                placeholder="email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Уебсайт / Facebook</label>
              <input 
                value={form.website} 
                onChange={e => set('website', e.target.value)} 
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              />
            </div>
          </div>

          {msg && (
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm">{msg}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 text-lg"
          >
            {loading ? 'Изпращане...' : 'Създай профил'}
          </button>
        </form>
      </div>
    </div>
  );
}