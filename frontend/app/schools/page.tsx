'use client';

import { useState, useEffect } from 'react';
import { schoolsAPI, neighborhoodsAPI } from '@/lib/api';
import SchoolCard from '@/components/SchoolCard';

interface School {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  verified: boolean;
  neighborhood: {
    id: string;
    name: string;
  } | null;
}

interface Neighborhood {
  id: string;
  name: string;
  city: string;
}

const cities = ['Sofia', 'Plovdiv', 'Varna', 'Burgas', 'Ruse', 'Stara Zagora'];

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    neighborhood_id: '',
    verified_only: false,
  });

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [filters]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== false)
      );
      
      const response = await schoolsAPI.getAll(params);
      setSchools(response.data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNeighborhoods = async () => {
    try {
      const response = await neighborhoodsAPI.getAll();
      setNeighborhoods(response.data);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
    }
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset neighborhood when city changes
    if (key === 'city') {
      newFilters.neighborhood_id = '';
    }
    
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      neighborhood_id: '',
      verified_only: false,
    });
  };

  // Filter neighborhoods by selected city
  const filteredNeighborhoods = filters.city
    ? neighborhoods.filter((n) => n.city.toLowerCase() === filters.city.toLowerCase())
    : neighborhoods;

  if (loading && schools.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading schools...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Schools & Activity Providers
        </h1>
        <p className="text-gray-600">
          Browse verified schools and activity providers in your area
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Neighborhood Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Neighborhood
                </label>
                <select
                  value={filters.neighborhood_id}
                  onChange={(e) => handleFilterChange('neighborhood_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!filters.city}
                >
                  <option value="">All Neighborhoods</option>
                  {filteredNeighborhoods.map((neighborhood) => (
                    <option key={neighborhood.id} value={neighborhood.id}>
                      {neighborhood.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Verified Only Filter */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.verified_only}
                    onChange={(e) => handleFilterChange('verified_only', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Verified schools only</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : schools.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-4">No schools found</div>
              <p className="text-sm text-gray-400">
                Try adjusting your filters or check back later for new schools
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {schools.map((school) => (
                <SchoolCard key={school.id} school={school} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}