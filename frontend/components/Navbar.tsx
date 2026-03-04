'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isParent, isSchool, isAdmin, loading } = useAuth();

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">🎓</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Skillio
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/activities" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Дейности
            </Link>
            <Link 
              href="/schools" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
            >
              Училища
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
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
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {user.email[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user.email}</span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    {user.role === 'parent' ? 'Родител' : user.role === 'school' ? 'Училище' : 'Админ'}
                  </span>
                </div>
                
                {/* Role-specific links */}
                {isParent && (
                  <Link 
                    href="/parent/dashboard" 
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    Моето табло
                  </Link>
                )}
                
                {isSchool && (
                  <Link 
                    href="/school/dashboard" 
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    Училищно табло
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    href="/admin/dashboard" 
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    Админ панел
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Изход
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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