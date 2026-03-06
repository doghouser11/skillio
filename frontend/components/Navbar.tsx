'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isParent, isSchool, isAdmin, loading } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-6">
          {/* Logo - Headspace Style */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-3xl">🎓</span>
            <span className="text-2xl font-light text-slate-800">
              Skillio
            </span>
          </Link>

          {/* Navigation Links - Clean */}
          <div className="hidden md:flex space-x-1">
            <Link 
              href="/activities" 
              className="text-slate-600 hover:text-emerald-600 font-normal transition-colors duration-300 px-4 py-2 rounded-full hover:bg-emerald-50"
            >
              Дейности
            </Link>
            <Link 
              href="/schools" 
              className="text-slate-600 hover:text-emerald-600 font-normal transition-colors duration-300 px-4 py-2 rounded-full hover:bg-emerald-50"
            >
              Специалисти
            </Link>
            <Link 
              href="/about" 
              className="text-slate-600 hover:text-emerald-600 font-normal transition-colors duration-300 px-4 py-2 rounded-full hover:bg-emerald-50"
            >
              За нас
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex space-x-2">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-slate-700 font-medium">{user.email.split('@')[0]}</div>
                    <div className="text-xs text-slate-500">
                      {user.role === 'parent' ? 'Родител' : user.role === 'school' ? 'Организация' : 'Админ'}
                    </div>
                  </div>
                </div>
                
                {/* Role-specific links */}
                {isParent && (
                  <Link 
                    href="/parent/dashboard" 
                    className="text-slate-600 hover:text-emerald-600 font-normal transition-colors duration-300 px-3 py-2 rounded-full hover:bg-emerald-50"
                  >
                    Табло
                  </Link>
                )}
                
                {isSchool && (
                  <Link 
                    href="/school/dashboard" 
                    className="text-slate-600 hover:text-emerald-600 font-normal transition-colors duration-300 px-3 py-2 rounded-full hover:bg-emerald-50"
                  >
                    Табло
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    href="/admin/dashboard" 
                    className="text-slate-600 hover:text-emerald-600 font-normal transition-colors duration-300 px-3 py-2 rounded-full hover:bg-emerald-50"
                  >
                    Админ
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="text-slate-500 hover:text-slate-700 font-normal transition-colors duration-300 text-sm underline underline-offset-4"
                >
                  Изход
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-slate-800 font-normal transition-colors duration-300 px-3 py-2"
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-sm"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}