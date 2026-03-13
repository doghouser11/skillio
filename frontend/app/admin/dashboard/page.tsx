'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { schoolsAPI, activitiesAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

const API = 'https://api.skillio.live';

interface School {
  id: string;
  name: string;
  city: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  neighborhood?: string;
  address?: string;
  verified: boolean;
  claimed_by?: string | null;
  created_at: string;
}

interface Activity {
  id: string;
  title: string;
  category: string;
  verified: boolean;
  source: string;
  created_at: string;
  school: {
    name: string;
  } | null;
}

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schools' | 'activities' | 'allSchools'>('schools');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<School>>({});

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    if (!isAdmin) { router.push('/'); return; }
    fetchData();
  }, [user, isAdmin, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schoolsResponse, activitiesResponse] = await Promise.all([
        schoolsAPI.getAll(),
        activitiesAPI.getAll(),
      ]);
      setSchools(schoolsResponse.data);
      setActivities(activitiesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifySchool = async (schoolId: string) => {
    try {
      await schoolsAPI.verify(schoolId);
      const response = await schoolsAPI.getAll();
      setSchools(response.data);
    } catch (error) {
      console.error('Error verifying school:', error);
      alert('Error verifying school');
    }
  };

  const verifyActivity = async (activityId: string) => {
    try {
      await activitiesAPI.verify(activityId);
      const response = await activitiesAPI.getAll();
      setActivities(response.data);
    } catch (error) {
      console.error('Error verifying activity:', error);
      alert('Error verifying activity');
    }
  };

  const deleteSchool = async (id: string) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете тази организация?')) return;
    try {
      const res = await fetch(`${API}/api/schools/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Грешка'); }
      setSchools(prev => prev.filter(s => s.id !== id));
    } catch (e: any) {
      alert('Грешка: ' + e.message);
    }
  };

  const startEdit = (school: School) => {
    setEditingId(school.id);
    setEditForm({
      name: school.name,
      city: school.city,
      description: school.description || '',
      phone: school.phone || '',
      email: school.email || '',
      website: school.website || '',
      category: school.category || '',
      neighborhood: school.neighborhood || '',
      address: school.address || '',
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      const res = await fetch(`${API}/api/schools/${editingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.detail || 'Грешка'); }
      const updated = await res.json();
      setSchools(prev => prev.map(s => s.id === editingId ? { ...s, ...updated } : s));
      setEditingId(null);
    } catch (e: any) {
      alert('Грешка: ' + e.message);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('bg-BG');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Зареждане...</div>
      </div>
    );
  }

  const unverifiedSchools = schools.filter(s => !s.verified);
  const unverifiedActivities = activities.filter(a => !a.verified);

  const editFields: { key: keyof School; label: string }[] = [
    { key: 'name', label: 'Име' },
    { key: 'city', label: 'Град' },
    { key: 'description', label: 'Описание' },
    { key: 'phone', label: 'Телефон' },
    { key: 'email', label: 'Email' },
    { key: 'website', label: 'Уебсайт' },
    { key: 'category', label: 'Категория' },
    { key: 'neighborhood', label: 'Квартал' },
    { key: 'address', label: 'Адрес' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Управление на платформата</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{schools.length}</div>
          <div className="text-sm text-gray-600">Общо организации</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">{activities.length}</div>
          <div className="text-sm text-gray-600">Общо дейности</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-2">{unverifiedSchools.length}</div>
          <div className="text-sm text-gray-600">Чакащи верификация</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">{unverifiedActivities.length}</div>
          <div className="text-sm text-gray-600">Дейности чакащи</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button onClick={() => setActiveTab('schools')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'schools' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Верификация ({unverifiedSchools.length})
          </button>
          <button onClick={() => setActiveTab('activities')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'activities' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Дейности ({unverifiedActivities.length})
          </button>
          <button onClick={() => setActiveTab('allSchools')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'allSchools' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Всички организации ({schools.length})
          </button>
        </nav>
      </div>

      {/* Schools Verification */}
      {activeTab === 'schools' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Опашка за верификация</h3>
          </div>
          {unverifiedSchools.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Няма чакащи организации</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {unverifiedSchools.map(school => (
                <div key={school.id} className="p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{school.name}</h4>
                    <div className="text-sm text-gray-600 mb-3">
                      <div>📍 {school.city}</div>
                      <div>📅 {formatDate(school.created_at)}</div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full">Чака верификация</span>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => verifySchool(school.id)} className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600">Потвърди</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">Откажи</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Activities Verification */}
      {activeTab === 'activities' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Дейности за верификация</h3>
          </div>
          {unverifiedActivities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Няма чакащи дейности</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {unverifiedActivities.map(activity => (
                <div key={activity.id} className="p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h4>
                    <div className="text-sm text-gray-600 mb-3">
                      <div>Категория: {activity.category}</div>
                      <div>Източник: {activity.source}</div>
                      {activity.school && <div>Организация: {activity.school.name}</div>}
                      <div>📅 {formatDate(activity.created_at)}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">{activity.category}</span>
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full">Чака верификация</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => verifyActivity(activity.id)} className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600">Потвърди</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">Откажи</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Schools - Edit/Delete */}
      {activeTab === 'allSchools' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Всички организации</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {schools.map(school => (
              <div key={school.id} className="p-6">
                {editingId === school.id ? (
                  <div className="space-y-3">
                    {editFields.map(f => (
                      <div key={f.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                        {f.key === 'description' ? (
                          <textarea value={(editForm as any)[f.key] || ''} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" rows={3} />
                        ) : (
                          <input value={(editForm as any)[f.key] || ''} onChange={e => setEditForm({ ...editForm, [f.key]: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                        )}
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <button onClick={saveEdit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Запази</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">Отказ</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-gray-900">{school.name}</h4>
                        {school.verified && <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-full">Верифициран</span>}
                        {school.claimed_by && <span className="bg-blue-100 text-blue-800 px-2 py-0.5 text-xs rounded-full">Заявен</span>}
                      </div>
                      <div className="text-sm text-gray-600">
                        📍 {school.city}{school.neighborhood ? `, ${school.neighborhood}` : ''} · 📅 {formatDate(school.created_at)}
                        {school.category && <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{school.category}</span>}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => startEdit(school)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm">✏️ Редактирай</button>
                      <button onClick={() => deleteSchool(school.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm">🗑️ Изтрий</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
