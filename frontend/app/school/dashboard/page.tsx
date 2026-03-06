'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { activitiesAPI, leadsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Activity {
  id: string;
  title: string;
  description: string;
  age_min: number;
  age_max: number;
  price_monthly?: number;
  verified: boolean;
  created_at: string;
}

interface Lead {
  id: string;
  child_age: number;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
  parent: {
    email: string;
    phone?: string;
  };
  activity: {
    title: string;
  };
}

export default function SchoolDashboard() {
  const { user, isSchool } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activities' | 'leads'>('activities');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!isSchool) {
      router.push('/');
      return;
    }

    fetchSchoolData();
  }, [user, isSchool, router]);

  const fetchSchoolData = async () => {
    try {
      console.log('🏫 Loading school dashboard data (emergency mode)...');
      
      // Emergency mock data for school demo
      const mockActivities: Activity[] = [
        {
          id: '1',
          title: 'Модерен танц за деца',
          description: 'Уроци по модерен танц за деца от 4 до 12 години',
          age_min: 4,
          age_max: 12,
          price_monthly: 80,
          verified: true,
          created_at: new Date().toISOString()
        }
      ];
      
      const mockLeads: Lead[] = [
        {
          id: '1',
          child_age: 8,
          message: 'Интересувам се от танцови уроци за дъщеря ми',
          status: 'new',
          created_at: new Date().toISOString(),
          parent: {
            email: 'parent@example.com',
            phone: '+359888123456'
          },
          activity: {
            title: 'Модерен танц за деца'
          }
        }
      ];
      
      setActivities(mockActivities);
      setLeads(mockLeads);
      console.log('✅ School dashboard data loaded');
    } catch (error) {
      console.error('❌ Error loading school dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadStatus = async (leadId: string, status: string) => {
    try {
      console.log('📝 Updating lead status (emergency mode):', { leadId, status });
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: status as any } : lead
      ));
    } catch (error) {
      console.error('❌ Error updating lead status:', error);
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
            🏫 Организационен дашборд
          </h1>
          <p className="text-slate-600">
            Управлявайте дейностите и запитванията на вашата организация
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link
            href="/school/add-activity"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center border border-slate-200"
          >
            <div className="text-3xl mb-3">➕</div>
            <h3 className="font-semibold text-slate-900 mb-2">Нова дейност</h3>
            <p className="text-sm text-slate-600">Добавете нова дейност</p>
          </Link>

          <Link
            href="/school/profile"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center border border-slate-200"
          >
            <div className="text-3xl mb-3">🏫</div>
            <h3 className="font-semibold text-slate-900 mb-2">Профил</h3>
            <p className="text-sm text-slate-600">Организационни данни</p>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md text-center border border-slate-200">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-slate-900 mb-2">Статистики</h3>
            <p className="text-sm text-slate-600">
              {activities.length} дейности • {leads.length} запитвания
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md text-center border border-slate-200">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-semibold text-slate-900 mb-2">Рейтинг</h3>
            <p className="text-sm text-slate-600">4.5/5 (15 отзива)</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{leads.filter(l => l.status === 'new').length}</div>
            <div className="text-sm text-blue-800">Нови запитвания</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{activities.filter(a => a.verified).length}</div>
            <div className="text-sm text-green-800">Одобрени дейности</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{activities.filter(a => !a.verified).length}</div>
            <div className="text-sm text-purple-800">Чакащи одобрение</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">85%</div>
            <div className="text-sm text-orange-800">Отговор</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('activities')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'activities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🎯 Моите дейности ({activities.length})
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'leads'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              📬 Запитвания ({leads.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-slate-800">
                🎯 Моите дейности
              </h2>
              <Link 
                href="/school/add-activity"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ➕ Добавете дейност
              </Link>
            </div>
            
            {activities.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-slate-200">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-medium text-slate-800 mb-2">Няма дейности</h3>
                <p className="text-slate-600 mb-4">
                  Все още не сте добавили дейности за вашата организация
                </p>
                <Link 
                  href="/school/add-activity" 
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Добавете първата дейност
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-slate-800">
                        {activity.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        activity.verified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {activity.verified ? '✅ Одобрена' : '⏳ Чака одобрение'}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">{activity.description}</p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-600 mb-4">
                      <div>
                        <strong>Възраст:</strong> {activity.age_min}-{activity.age_max} години
                      </div>
                      {activity.price_monthly && (
                        <div>
                          <strong>Цена:</strong> {activity.price_monthly} лв/месец
                        </div>
                      )}
                      <div>
                        <strong>Създадена:</strong> {new Date(activity.created_at).toLocaleDateString('bg-BG')}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200">
                        ✏️ Редактирай
                      </button>
                      <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200">
                        👀 Преглед
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              📬 Запитвания от родители
            </h2>
            {leads.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center border border-slate-200">
                <div className="text-4xl mb-4">📭</div>
                <h3 className="font-medium text-slate-800 mb-2">Няма запитвания</h3>
                <p className="text-slate-600">
                  Все още няма запитвания от родители за вашите дейности
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-800 mb-1">
                          Запитване за: {lead.activity.title}
                        </h3>
                        <p className="text-slate-600">
                          <strong>Възраст на детето:</strong> {lead.child_age} години
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lead.status === 'new' ? '🆕 Ново' :
                         lead.status === 'contacted' ? '📞 Свързахме се' : '✅ Завършено'}
                      </span>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded mb-4">
                      <p className="italic text-slate-700">"{lead.message}"</p>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-600">
                        <div><strong>Родител:</strong> {lead.parent.email}</div>
                        {lead.parent.phone && <div><strong>Телефон:</strong> {lead.parent.phone}</div>}
                        <div><strong>Дата:</strong> {new Date(lead.created_at).toLocaleDateString('bg-BG')}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {lead.status === 'new' && (
                          <button
                            onClick={() => handleLeadStatus(lead.id, 'contacted')}
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                          >
                            📞 Свързахме се
                          </button>
                        )}
                        {lead.status === 'contacted' && (
                          <button
                            onClick={() => handleLeadStatus(lead.id, 'closed')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            ✅ Завърши
                          </button>
                        )}
                        <a
                          href={`mailto:${lead.parent.email}`}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                          ✉️ Имейл
                        </a>
                      </div>
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