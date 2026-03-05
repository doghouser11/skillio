'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  role: 'school' | 'teacher';
  phone?: string;
  verified: boolean;
  created_at: string;
}

export default function AdminApprovePage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/');
      return;
    }
    loadPendingUsers();
  }, [isAdmin, router]);

  const loadPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .in('role', ['school', 'teacher'])
        .eq('verified', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingUsers(data || []);
    } catch (error) {
      console.error('Error loading pending users:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ verified: true })
        .eq('id', userId);

      if (error) throw error;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: user?.id,
        action_type: 'verify',
        target_type: 'user',
        target_id: userId,
        reason: 'Approved by admin'
      });

      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      alert('✅ Потребителят е одобрен!');
    } catch (error) {
      console.error('Error approving user:', error);
      alert('❌ Грешка при одобряване');
    }
  };

  const rejectUser = async (userId: string) => {
    if (!confirm('Сигурни ли сте, че искате да откажете този потребител?')) {
      return;
    }

    try {
      // Delete user profile and auth record
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Log admin action
      await supabase.from('admin_actions').insert({
        admin_id: user?.id,
        action_type: 'reject',
        target_type: 'user',
        target_id: userId,
        reason: 'Rejected by admin'
      });

      setPendingUsers(prev => prev.filter(u => u.id !== userId));
      alert('❌ Потребителят е отказан');
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('❌ Грешка при отказване');
    }
  };

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          👑 Админ панел - Одобрения
        </h1>
        <p className="text-gray-600">
          Одобрете или отхвърлете нови регистрации на училища и учители
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Зареждане...</p>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold mb-2">Няма чакащи одобрения</h3>
          <p className="text-gray-600">Всички регистрации са обработени</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">
                      {user.role === 'school' ? '🏫' : '👨‍🏫'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {user.full_name || 'Без име'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {user.role === 'school' ? 'Училище/Агенция' : 'Учител/Треньор'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📧</span>
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">📞</span>
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">📅</span>
                      <span>
                        Регистрирано: {new Date(user.created_at).toLocaleDateString('bg-BG')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 ml-6">
                  <button
                    onClick={() => approveUser(user.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>✅</span>
                    Одобри
                  </button>
                  <button
                    onClick={() => rejectUser(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>❌</span>
                    Откажи
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}