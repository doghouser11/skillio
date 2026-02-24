'use client';

import { useState, useEffect } from 'react';
import { activitiesAPI, neighborhoodsAPI } from '@/lib/api';
import ActivityCard from '@/components/ActivityCard';
import ActivityFilters from '@/components/ActivityFilters';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  age_min: number;
  age_max: number;
  price_monthly: number;
  school: {
    id: string;
    name: string;
    city: string;
    verified: boolean;
  };
}

interface Neighborhood {
  id: string;
  name: string;
  city: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    neighborhood_id: '',
    category: '',
    age_min: '',
    age_max: '',
  });

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      const response = await activitiesAPI.getAll(params);
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
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

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (loading && activities.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading activities...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Find Activities for Your Child
        </h1>
        <p className="text-gray-600">
          Browse through verified extracurricular activities and programs
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ActivityFilters
            filters={filters}
            neighborhoods={neighborhoods}
            onFiltersChange={handleFilterChange}
          />
        </div>

        {/* Activities Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600">Loading...</div>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 mb-4">No activities found</div>
              <p className="text-sm text-gray-400">
                Try adjusting your filters or check back later for new activities
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}