'use client';

import { useState, useEffect } from 'react';
import { activitiesAPI } from '../../lib/api';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  age_min?: number;
  age_max?: number;
  price_monthly?: number;
  school?: any;
  verified: boolean;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    age_min: '',
    age_max: '',
    price_max: ''
  });

  useEffect(() => {
    loadActivities();
  }, [filters]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await activitiesAPI.getAll(filters);
      setActivities(response.data);
    } catch (error) {
      console.error('Error loading activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Спорт', 'Изкуство', 'Музика', 'Програмиране', 'Роботика', 'Танци', 'Театър', 'Езици'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Всички дейности
        </h1>
        <p className="text-xl text-gray-600">
          Намерете перфектната дейност за вашето дете
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Филтри</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категория
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">Всички категории</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              От възраст
            </label>
            <input
              type="number"
              min="0"
              max="18"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="4"
              value={filters.age_min}
              onChange={(e) => setFilters(prev => ({ ...prev, age_min: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              До възраст
            </label>
            <input
              type="number"
              min="0"
              max="18"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="12"
              value={filters.age_max}
              onChange={(e) => setFilters(prev => ({ ...prev, age_max: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Макс. цена (лв./мес)
            </label>
            <input
              type="number"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="100"
              value={filters.price_max}
              onChange={(e) => setFilters(prev => ({ ...prev, price_max: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Activities Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-900 line-clamp-2">
                  {activity.title}
                </h3>
                {activity.verified && (
                  <span className="text-green-500 text-sm ml-2">✓</span>
                )}
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {activity.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {activity.category}
                  </span>
                  <span className="text-gray-600 font-medium">
                    {activity.price_monthly ? `${activity.price_monthly} лв./мес` : 'Безплатно'}
                  </span>
                </div>

                {(activity.age_min || activity.age_max) && (
                  <div className="text-sm text-gray-500">
                    Възраст: {activity.age_min && `от ${activity.age_min}г`} {activity.age_max && `до ${activity.age_max}г`}
                  </div>
                )}

                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Разгледай детайли
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Няма намерени дейности
          </h3>
          <p className="text-gray-600">
            Опитайте с различни филтри или проверете отново по-късно
          </p>
        </div>
      )}
    </div>
  );
}