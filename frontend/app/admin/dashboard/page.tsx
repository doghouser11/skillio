'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { schoolsAPI, activitiesAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface School {
  id: string;
  name: string;
  city: string;
  verified: boolean;
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
  const [activeTab, setActiveTab] = useState<'schools' | 'activities'>('schools');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!isAdmin) {
      router.push('/');
      return;
    }

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
      // Refresh schools list
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
      // Refresh activities list
      const response = await activitiesAPI.getAll();
      setActivities(response.data);
    } catch (error) {
      console.error('Error verifying activity:', error);
      alert('Error verifying activity');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading admin dashboard...</div>
      </div>
    );
  }

  const unverifiedSchools = schools.filter(s => !s.verified);
  const unverifiedActivities = activities.filter(a => !a.verified);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Verify schools and activities, manage platform content
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{schools.length}</div>
          <div className="text-sm text-gray-600">Total Schools</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">{activities.length}</div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-2">{unverifiedSchools.length}</div>
          <div className="text-sm text-gray-600">Schools Pending</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">{unverifiedActivities.length}</div>
          <div className="text-sm text-gray-600">Activities Pending</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('schools')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schools'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Schools ({unverifiedSchools.length} pending)
          </button>
          <button
            onClick={() => setActiveTab('activities')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'activities'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Activities ({unverifiedActivities.length} pending)
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'schools' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Schools Verification Queue
            </h3>
          </div>
          
          {unverifiedSchools.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">No schools pending verification</div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {unverifiedSchools.map((school) => (
                <div key={school.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {school.name}
                      </h4>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <div>Location: {school.city}</div>
                        <div>Registered: {formatDate(school.created_at)}</div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full">
                          Pending Verification
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => verifySchool(school.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                      >
                        Verify
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Activities Verification Queue
            </h3>
          </div>
          
          {unverifiedActivities.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">No activities pending verification</div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {unverifiedActivities.map((activity) => (
                <div key={activity.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h4>
                      
                      <div className="text-sm text-gray-600 mb-3">
                        <div>Category: {activity.category}</div>
                        <div>Source: {activity.source}</div>
                        {activity.school && (
                          <div>School: {activity.school.name}</div>
                        )}
                        <div>Submitted: {formatDate(activity.created_at)}</div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full">
                          {activity.category}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 text-xs rounded-full">
                          Pending Verification
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          activity.source === 'school' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {activity.source === 'school' ? 'School Submitted' : 'Parent Submitted'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => verifyActivity(activity.id)}
                        className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600"
                      >
                        Verify
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}