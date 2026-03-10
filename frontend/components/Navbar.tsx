'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isParent, isSchool, isAdmin, loading } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl">🎓</span>
            <span className="text-xl font-bold text-gray-900">Skillio</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/activities" className="text-gray-600 hover:text-green-700 text-sm font-medium">Дейности</Link>
            <Link href="/schools" className="text-gray-600 hover:text-green-700 text-sm font-medium">Организации</Link>
            <Link href="/about" className="text-gray-600 hover:text-green-700 text-sm font-medium">Защо?</Link>
          </div>

          {/* User area */}
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-16 h-8 bg-gray-100 rounded animate-pulse" />
            ) : user ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-600">{user.email.split('@')[0]}</span>
                {isParent && <Link href="/add-organization" className="text-sm text-green-700 font-medium">➕</Link>}
                {isSchool && <Link href="/profile/organization" className="text-sm text-green-700 font-medium">🏢</Link>}
                {isAdmin && <Link href="/admin/approve" className="text-sm text-red-600 font-medium">Админ</Link>}
                <Link href="/profile/settings" className="text-sm">⚙️</Link>
                <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">Изход</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-600 hover:text-green-700 font-medium">Вход</Link>
                <Link href="/register" className="bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-800">Регистрация</Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-gray-100 py-2 flex justify-center space-x-6">
          <Link href="/activities" className="text-gray-600 hover:text-green-700 text-sm font-medium">Дейности</Link>
          <Link href="/schools" className="text-gray-600 hover:text-green-700 text-sm font-medium">Организации</Link>
          <Link href="/about" className="text-gray-600 hover:text-green-700 text-sm font-medium">Защо?</Link>
          {user && isParent && <Link href="/add-organization" className="text-green-700 text-sm font-medium">➕ Добави</Link>}
          {user && isSchool && <Link href="/profile/organization" className="text-green-700 text-sm font-medium">🏢 Моя организация</Link>}
          {user && <Link href="/profile/settings" className="text-gray-600 text-sm font-medium">⚙️ Профил</Link>}
        </div>
      </div>
    </nav>
  );
}
