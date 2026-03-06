'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
      console.log('📋 Loading pending users for approval...');
      
      // Emergency mock data for pending users
      const mockPendingUsers: PendingUser[] = [
        {
          id: '1',
          email: 'school@example.com',
          full_name: 'Тест Организация',
          role: 'school',
          phone: '+359888123456',
          verified: false,
          created_at: new Date().toISOString()
        }
      ];

      setPendingUsers(mockPendingUsers);
      setLoading(false);
      console.log('✅ Pending users loaded');
    } catch (error) {
      console.error('Error loading pending users:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      console.log('✅ Approving user:', userId);
      // Remove from pending list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      console.log('❌ Rejecting user:', userId);
      // Remove from pending list
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-6 w-1/3"></div>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="h-24 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">
          📋 Одобряване на Потребители
        </h1>

        {pendingUsers.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-slate-600">Няма чакащи за одобрение потребители</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map(user => (
              <div key={user.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{user.full_name}</h3>
                    <p className="text-slate-600">{user.email}</p>
                    <p className="text-sm text-slate-500">
                      Роля: {user.role} | Дата: {new Date(user.created_at).toLocaleDateString('bg-BG')}
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleReject(user.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      ❌ Отхвърли
                    </button>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      ✅ Одобри
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}