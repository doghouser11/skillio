'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { schoolsAPI, activitiesAPI, leadsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface School {
  id: string;
  name: string;
  verified: boolean;
}

interface Activity {
  id: string;
  title: string;
  category: string;
  verified: boolean;
  active: boolean;
}

interface Lead {
  id: string;
  child_age: number;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
  parent: {
    email: string;
  };
  activity: {
    title: string;
  };
}

export default function SchoolDashboard() {
  const { user, isSchool } = useAuth();
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
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

    fetchData();
  }, [user, isSchool, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch school info
      try {
        const schoolResponse = await schoolsAPI.getMy();
        setSchool(schoolResponse.data);
      } catch (error) {
        // School doesn't exist yet
        setSchool(null);
      }

      // Fetch activities and leads
      const [leadsResponse] = await Promise.all([
        leadsAPI.getSchool(),
      ]);
      
      setLeads(leadsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      await leadsAPI.updateStatus(leadId, status);
      // Refresh leads
      const response = await leadsAPI.getSchool();
      setLeads(response.data);
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          School Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your school profile, activities, and leads
        </p>
      </div>

      {/* School Status */}
      {!school ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Complete Your School Profile
          </h3>
          <p className="text-yellow-700 mb-4">
            You need to create your school profile before you can add activities and receive leads.
          </p>
          <Link
            href="/school/setup"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Create School Profile
          </Link>
        </div>
      ) : (
        <div className={`border rounded-lg p-6 mb-8 ${
          school.verified ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {school.name}
              </h3>
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  school.verified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {school.verified ? '✓ Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>
            <Link
              href="/school/profile"
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      )}

      {school && (
        <>
          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/school/activities/new"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-2xl mb-2">➕</div>
              <h3 className="font-semibold text-gray-900 mb-1">Add Activity</h3>
              <p className="text-sm text-gray-600">Create a new activity offering</p>
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-gray-900 mb-1">Your Stats</h3>
              <p className="text-sm text-gray-600">
                {activities.length} activities • {leads.length} leads
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-gray-900 mb-1">New Leads</h3>
              <p className="text-sm text-gray-600">
                {leads.filter(l => l.status === 'new').length} waiting for response
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('activities')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activities ({activities.length})
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'leads'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Leads ({leads.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'activities' && (
            <div className="bg-white rounded-lg shadow-md">
              {activities.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-500 mb-4">No activities yet</div>
                  <Link
                    href="/school/activities/new"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Your First Activity
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {activity.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {activity.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${
                              activity.verified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {activity.verified ? 'Verified' : 'Pending'}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${
                              activity.active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {activity.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/school/activities/${activity.id}`}
                          className="text-blue-500 hover:text-blue-600 text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="bg-white rounded-lg shadow-md">
              {leads.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-gray-500 mb-4">No leads yet</div>
                  <p className="text-sm text-gray-400">
                    Leads will appear here when parents show interest in your activities
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <div key={lead.id} className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {lead.activity.title}
                          </h3>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <div>Parent: {lead.parent.email}</div>
                            <div>Child Age: {lead.child_age}</div>
                            <div>Submitted: {formatDate(lead.created_at)}</div>
                          </div>

                          {lead.message && (
                            <div className="text-sm text-gray-700 mb-3">
                              <strong>Message:</strong> {lead.message}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                          
                          {lead.status === 'new' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'contacted')}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                              >
                                Mark Contacted
                              </button>
                              <button
                                onClick={() => updateLeadStatus(lead.id, 'closed')}
                                className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                              >
                                Close
                              </button>
                            </div>
                          )}
                          
                          {lead.status === 'contacted' && (
                            <button
                              onClick={() => updateLeadStatus(lead.id, 'closed')}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                            >
                              Close
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}