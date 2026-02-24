'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isParent, isSchool, isAdmin } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-blue-600">
            KidsActivities
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <Link href="/activities" className="text-gray-700 hover:text-blue-600">
              Activities
            </Link>
            <Link href="/schools" className="text-gray-700 hover:text-blue-600">
              Schools
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.email} ({user.role})
                </span>
                
                {/* Role-specific links */}
                {isParent && (
                  <Link 
                    href="/parent/dashboard" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Dashboard
                  </Link>
                )}
                
                {isSchool && (
                  <Link 
                    href="/school/dashboard" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    School Dashboard
                  </Link>
                )}
                
                {isAdmin && (
                  <Link 
                    href="/admin/dashboard" 
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Admin Dashboard
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}