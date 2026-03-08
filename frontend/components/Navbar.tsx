'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isParent, isSchool, isAdmin, loading } = useAuth();

  return (
    <nav className="sticky top-2 md:top-4 z-50 mx-2 md:mx-6">
      <div className="comic-navbar container mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-between items-center py-4 md:py-6">
          {/* Logo - Mobile Friendly */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl">🎓</span>
            <span className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
              Skillio
            </span>
          </Link>

          {/* Navigation Links - Hidden on Mobile */}
          <div className="hidden lg:flex space-x-1">
            <Link 
              href="/activities" 
              className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-4 py-2 rounded-3xl hover:bg-[#FFB1B1]/30 text-base"
            >
              Дейности
            </Link>
            <Link 
              href="/schools" 
              className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-4 py-2 rounded-3xl hover:bg-[#FFB1B1]/30 text-base"
            >
              Организации
            </Link>
            <Link 
              href="/about" 
              className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-4 py-2 rounded-3xl hover:bg-[#FFB1B1]/30 text-base"
            >
              За нас
            </Link>
          </div>

          {/* User Menu - Mobile Responsive */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {loading ? (
              <div className="flex space-x-2">
                <div className="w-16 h-8 bg-[#FFB1B1] rounded-3xl animate-pulse"></div>
                <div className="w-20 h-8 bg-[#FFB1B1] rounded-3xl animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#2D5A27] border-2 border-black rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg">
                    {user.email[0].toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-[#1A1A1A] font-bold text-sm md:text-base">{user.email.split('@')[0]}</div>
                    <div className="text-xs md:text-sm text-[#1A1A1A] font-medium">
                      {user.role === 'parent' ? 'Родител' : user.role === 'school' ? 'Организация' : 'Админ'}
                    </div>
                  </div>
                </div>
                
                {/* Role-specific links - Hidden on small mobile */}
                {isParent && (
                  <Link 
                    href="/add-organization" 
                    className="hidden sm:block text-[#1A1A1A] hover:text-white font-semibold transition-all duration-300 px-3 py-2 rounded-3xl hover:bg-[#2D5A27] border border-[#2D5A27] text-sm"
                  >
                    ➕ Добави
                  </Link>
                )}
                
                {isSchool && (
                  <Link 
                    href="/school/dashboard" 
                    className="hidden sm:block text-[#1A1A1A] hover:text-white font-semibold transition-all duration-300 px-3 py-2 rounded-3xl hover:bg-[#2D5A27] border border-[#2D5A27] text-sm"
                  >
                    Табло
                  </Link>
                )}
                
                {isAdmin && (
                  <>
                    <Link 
                      href="/admin/approve" 
                      className="hidden sm:block text-[#1A1A1A] hover:text-white font-semibold transition-all duration-300 px-3 py-2 rounded-3xl hover:bg-[#FFB1B1] border border-[#FFB1B1] text-sm"
                    >
                      Админ
                    </Link>
                  </>
                )}
                
                <Link
                  href="/profile/settings"
                  className="hidden sm:block text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 text-sm"
                >
                  ⚙️
                </Link>
                <button
                  onClick={logout}
                  className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 text-sm md:text-base"
                >
                  Изход
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 md:space-x-4">
                <Link
                  href="/login"
                  className="hidden sm:block text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-3 py-2 text-sm md:text-base"
                >
                  Вход
                </Link>
                <Link
                  href="/register"
                  className="bg-[#2D5A27] hover:bg-[#1f3d1a] text-white px-4 py-2 md:px-6 md:py-3 text-sm md:text-base font-semibold rounded-full transition-all duration-300 border-2 border-black"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
          
        </div>
        
        {/* Mobile Navigation Menu - Full width on mobile */}
        <div className="lg:hidden border-t border-[#1A1A1A]/20 pt-4 pb-2">
          <div className="flex justify-center space-x-6">
            <Link 
              href="/activities" 
              className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-4 py-2 rounded-3xl hover:bg-[#FFB1B1]/30 text-base"
            >
              🎨 Дейности
            </Link>
            <Link 
              href="/schools" 
              className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-4 py-2 rounded-3xl hover:bg-[#FFB1B1]/30 text-base"
            >
              🏢 Организации
            </Link>
            <Link 
              href="/about" 
              className="text-[#1A1A1A] hover:text-[#2D5A27] font-semibold transition-colors duration-300 px-4 py-2 rounded-3xl hover:bg-[#FFB1B1]/30 text-base"
            >
              💫 За нас
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}