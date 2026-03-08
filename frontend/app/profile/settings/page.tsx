'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const API = 'https://api.skillio.live';

export default function ProfileSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    if (typeof window !== 'undefined') router.push('/login');
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Пренасочване...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setError('');
    if (newPassword !== confirm) { setError('Паролите не съвпадат'); return; }
    if (newPassword.length < 6) { setError('Минимум 6 символа'); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Грешка'); }
      setMsg('✅ Паролата е сменена успешно!');
      setCurrentPassword(''); setNewPassword(''); setConfirm('');
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Настройки на профила</h1>
        <p className="text-gray-600 mb-8">{user.email}</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 border border-gray-200 space-y-4">
          <h2 className="font-semibold text-gray-900">Смяна на парола</h2>
          <input type="password" placeholder="Текуща парола" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="password" placeholder="Нова парола" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          <input type="password" placeholder="Потвърдете нова парола" value={confirm} onChange={e => setConfirm(e.target.value)} required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {msg && <p className="text-green-600 text-sm">{msg}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
            {loading ? 'Запазване...' : 'Смени паролата'}
          </button>
        </form>
      </div>
    </div>
  );
}
