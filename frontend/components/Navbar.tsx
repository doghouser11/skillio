'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isParent, isSchool, isAdmin, loading } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🎓 Skillio
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/activities" className="text-gray-700 hover:text-blue-600 font-medium">
              Дейности
            </Link>
            <Link href="/schools" className="text-gray-700 hover:text-blue-600 font-medium">
              Училища
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              // Показва placeholder докато зарежда
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            ) : user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.email} ({user.role})
                </span>
                
                {/* Role-specific links */}
                {isParent && (
                  <Link 
                    href="/parent/dashboard" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Табло
                  </Link>
                )}
                
                {isSchool && (
                  <Link 
                    href="/school/dashboard" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Училище
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    href="/admin/dashboard" 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Админ
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                  Изход
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}