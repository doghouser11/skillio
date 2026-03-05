'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { leadsAPI, reviewsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lead {
  id: string;
  child_age: number;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
  activity: {
    id: string;
    title: string;
    school: {
      name: string;
      phone: string;
      email: string;
    };
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  school: {
    id: string;
    name: string;
  };
}

export default function ParentDashboard() {
  const { user, isParent } = useAuth();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'reviews'>('leads');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!isParent) {
      router.push('/');
      return;
    }

    fetchUserData();
  }, [user, isParent, router]);

  const fetchUserData = async () => {
    try {
      console.log('📊 Loading parent dashboard data (emergency mode)...');
      
      // Emergency mock data for demo
      const mockLeads: Lead[] = [
        {
          id: '1',
          child_age: 8,
          message: 'Интересувам се от танцови уроци за дъщеря ми',
          status: 'new',
          created_at: new Date().toISOString(),
          activity: {
            id: '1',
            title: 'Модерен танц за деца',
            school: {
              name: 'Test Танцово Студио',
              phone: '+359888123456',
              email: 'info@dancestudio.bg'
            }
          }
        }
      ];
      
      const mockReviews: Review[] = [];
      
      setLeads(mockLeads);
      setReviews(mockReviews);
      console.log('✅ Parent dashboard data loaded');
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded mb-6 w-1/3"></div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[1,2,3].map(i => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            👋 Здравейте, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-slate-600">
            Добре дошли в родителския ви дашборд
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/activities"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center border border-slate-200"
          >
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-slate-900 mb-2">Търсене на дейности</h3>
            <p className="text-sm text-slate-600">Намерете нови дейности за вашето дете</p>
          </Link>

          <Link
            href="/parent/submit-activity"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center border border-slate-200"
          >
            <div className="text-3xl mb-3">➕</div>
            <h3 className="font-semibold text-slate-900 mb-2">Добавяне на дейност</h3>
            <p className="text-sm text-slate-600">Знаете за страхотна дейност? Споделете я!</p>
          </Link>

          <Link
            href="/parent/profile"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center border border-slate-200"
          >
            <div className="text-3xl mb-3">👤</div>
            <h3 className="font-semibold text-slate-900 mb-2">Моят профил</h3>
            <p className="text-sm text-slate-600">Настройки и лична информация</p>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{leads.length}</div>
            <div className="text-sm text-blue-800">Запитвания</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{reviews.length}</div>
            <div className="text-sm text-green-800">Отзиви</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-purple-800">Любими</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">1</div>
            <div className="text-sm text-orange-800">Месеца</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              📬 Моите запитвания ({leads.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              ⭐ Моите отзиви ({reviews.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              📬 Запитвания за дейности
            </h2>
            {leads.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-slate-200">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="font-medium text-slate-800 mb-2">Няма запитвания</h3>
                <p className="text-slate-600 mb-4">
                  Все още не сте изпратили запитвания за дейности
                </p>
                <Link 
                  href="/activities" 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Разгледайте дейности
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-slate-800">
                        {lead.activity.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lead.status === 'new' ? 'Ново' :
                         lead.status === 'contacted' ? 'Отговорено' : 'Завършено'}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">
                      <strong>Възраст на детето:</strong> {lead.child_age} години
                    </p>
                    <p className="text-slate-700 mb-4 italic">
                      "{lead.message}"
                    </p>
                    <div className="text-sm text-slate-500">
                      Изпратено на: {new Date(lead.created_at).toLocaleDateString('bg-BG')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              ⭐ Моите отзиви
            </h2>
            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-slate-200">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="font-medium text-slate-800 mb-2">Няма отзиви</h3>
                <p className="text-slate-600 mb-4">
                  Все още не сте оставили отзиви за училища
                </p>
                <Link 
                  href="/schools" 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Разгледайте училища
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-slate-800">
                        {review.school.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star}
                            className={star <= review.rating ? 'text-yellow-400' : 'text-slate-300'}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-700 mb-4 italic">
                      "{review.comment}"
                    </p>
                    <div className="text-sm text-slate-500">
                      Оставен на: {new Date(review.created_at).toLocaleDateString('bg-BG')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}