'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isParent, isSchool, isAdmin, loading } = useAuth();

  return (
    <nav className="sticky top-4 z-50 mx-6">
      <div className="comic-navbar container mx-auto px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo - Comic Style (keeping as requested) */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-3xl">🎓</span>
            <span className="text-3xl font-bold text-[#1A1A1A]">
              Skillio
            </span>
          </Link>

          {/* Navigation Links - Comic Style */}
          <div className="hidden md:flex space-x-2">
            <Link 
              href="/activities" 
              className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-6 py-3 rounded-3xl hover:bg-[#FFB1B1]/30 text-lg"
            >
              🎨 Дейности
            </Link>
            <Link 
              href="/schools" 
              className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-6 py-3 rounded-3xl hover:bg-[#FFB1B1]/30 text-lg"
            >
              👩‍🏫 Организации
            </Link>
            <Link 
              href="/about" 
              className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-6 py-3 rounded-3xl hover:bg-[#FFB1B1]/30 text-lg"
            >
              💫 За нас
            </Link>
          </div>

          {/* User Menu - Comic Style */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex space-x-2">
                <div className="w-20 h-8 bg-[#FFB1B1] rounded-3xl animate-pulse"></div>
                <div className="w-24 h-8 bg-[#FFB1B1] rounded-3xl animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#2D5A27] border-2 border-black rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-[#1A1A1A] font-bold text-base">{user.email.split('@')[0]}</div>
                    <div className="text-sm text-[#1A1A1A] font-medium">
                      {user.role === 'parent' ? '👨‍👩‍👧‍👦 Родител' : user.role === 'school' ? '🏢 Организация' : '⚡ Админ'}
                    </div>
                  </div>
                </div>
                
                {/* Role-specific links */}
                {isParent && (
                  <Link 
                    href="/parent/dashboard" 
                    className="text-[#1A1A1A] hover:text-white font-semibold transition-all duration-300 px-4 py-2 rounded-3xl hover:bg-[#2D5A27] border border-[#2D5A27]"
                  >
                    📊 Табло
                  </Link>
                )}
                
                {isSchool && (
                  <Link 
                    href="/school/dashboard" 
                    className="text-[#1A1A1A] hover:text-white font-semibold transition-all duration-300 px-4 py-2 rounded-3xl hover:bg-[#2D5A27] border border-[#2D5A27]"
                  >
                    📊 Табло
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    href="/admin/dashboard" 
                    className="text-[#1A1A1A] hover:text-white font-semibold transition-all duration-300 px-4 py-2 rounded-3xl hover:bg-[#FFB1B1] border border-[#FFB1B1]"
                  >
                    ⚡ Админ
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 text-base underline underline-offset-4"
                >
                  🚪 Изход
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-4 py-2 text-lg"
                >
                  🔐 Вход
                </Link>
                <Link
                  href="/register"
                  className="comic-button px-6 py-3 text-lg font-semibold"
                >
                  ✨ Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-[#1A1A1A] hover:text-[#2D5A27] p-2 rounded-3xl border-2 border-[#1A1A1A] hover:border-[#2D5A27] transition-all duration-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}