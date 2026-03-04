'use client';

import { useState, useEffect } from 'react';
import { schoolsAPI } from '../../lib/api';
import Link from 'next/link';

interface School {
  id: string;
  name: string;
  description?: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  verified: boolean;
  activities_count?: number;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => {
    loadSchools();
  }, [cityFilter]);

  const loadSchools = async () => {
    try {
      setLoading(true);
      const filters = cityFilter ? { city: cityFilter } : {};
      const response = await schoolsAPI.getAll(filters);
      setSchools(response.data);
    } catch (error) {
      console.error('Error loading schools:', error);
      setSchools([]);
    } finally {
      setLoading(false);
    }
  };

  const cities = ['София', 'Пловдив', 'Варна', 'Бургас', 'Русе', 'Стара Загора', 'Плевен', 'Добрич'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Партньорски училища
        </h1>
        <p className="text-xl text-gray-600">
          Проверени образователни институции в цяла България
        </p>
      </div>

      {/* City Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center space-x-4">
          <label className="block text-sm font-medium text-gray-700">
            Филтър по град:
          </label>
          <select
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">Всички градове</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schools Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : schools.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map((school) => (
            <div key={school.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-bold text-xl text-gray-900 line-clamp-2">
                  {school.name}
                </h3>
                {school.verified && (
                  <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs ml-2">
                    <span className="mr-1">✓</span>
                    Проверено
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>{school.city}</span>
                  {school.address && <span>, {school.address}</span>}
                </div>

                {school.phone && (
                  <div className="flex items-center">
                    <span className="mr-2">📞</span>
                    <span>{school.phone}</span>
                  </div>
                )}

                {school.email && (
                  <div className="flex items-center">
                    <span className="mr-2">✉️</span>
                    <span className="truncate">{school.email}</span>
                  </div>
                )}

                {school.activities_count && (
                  <div className="flex items-center">
                    <span className="mr-2">🎯</span>
                    <span>{school.activities_count} дейности</span>
                  </div>
                )}
              </div>

              {school.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {school.description}
                </p>
              )}

              <div className="space-y-2">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Виж дейности
                </button>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    Контакт
                  </button>
                  
                  {school.website && (
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-center"
                    >
                      Сайт
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏫</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Няма намерени училища
          </h3>
          <p className="text-gray-600 mb-6">
            {cityFilter 
              ? `Няма регистрирани училища в ${cityFilter}`
              : 'Все още няма регистрирани училища'
            }
          </p>
          <Link
            href="/register?role=school"
            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <span className="mr-2">🏫</span>
            Регистрирайте училището си
          </Link>
        </div>
      )}

      {/* Call to action */}
      <div className="mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">
          Имате училище или организирате курсове?
        </h2>
        <p className="text-xl mb-6 opacity-90">
          Присъединете се към нашата мрежа от партньори и достигнете до повече семейства.
        </p>
        <Link
          href="/register?role=school"
          className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          <span className="mr-2">🚀</span>
          Започнете сега
        </Link>
      </div>
    </div>
  );
}