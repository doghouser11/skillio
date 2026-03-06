'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminProtectionProps {
  children: React.ReactNode;
}

export default function AdminProtection({ children }: AdminProtectionProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in - redirect to login
        console.log('🚨 Admin access denied: Not logged in');
        router.push('/login?redirect=/admin');
        return;
      }

      if (!isAdmin) {
        // Logged in but not admin - redirect to home
        console.log('🚨 Admin access denied: User role is', user.role, 'but admin required');
        router.push('/');
        return;
      }

      console.log('✅ Admin access granted for:', user.email);
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FDF6EC'}}>
        <div className="comic-card p-8 text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Проверяваме достъпа...</h2>
          <p className="text-[#1A1A1A]">Моля, изчакайте</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FDF6EC'}}>
        <div className="comic-card p-8 text-center">
          <div className="text-4xl mb-4">🚨</div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Достъп отказан</h2>
          <p className="text-[#1A1A1A]">Пренасочваме ви...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#FDF6EC'}}>
        <div className="comic-card p-8 text-center max-w-md">
          <div className="text-4xl mb-4">⛔</div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-4">Няmate достъп</h2>
          <p className="text-[#1A1A1A] mb-6">
            Тази секция е само за администратори. Вашият профил е: <strong>{user.role}</strong>
          </p>
          <button
            onClick={() => router.push('/')}
            className="comic-button px-6 py-3 text-lg font-semibold"
          >
            🏠 Към началото
          </button>
        </div>
      </div>
    );
  }

  // User is admin - render the protected content
  return <>{children}</>;
}