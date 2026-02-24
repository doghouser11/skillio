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

    fetchData();
  }, [user, isParent, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [leadsResponse, reviewsResponse] = await Promise.all([
        leadsAPI.getMy(),
        reviewsAPI.getMy(),
      ]);
      
      setLeads(leadsResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
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
          Parent Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your activity interests and reviews
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/activities"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <div className="text-2xl mb-2">🔍</div>
          <h3 className="font-semibold text-gray-900 mb-1">Browse Activities</h3>
          <p className="text-sm text-gray-600">Find new activities for your child</p>
        </Link>

        <Link
          href="/parent/submit-activity"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
        >
          <div className="text-2xl mb-2">➕</div>
          <h3 className="font-semibold text-gray-900 mb-1">Submit Activity</h3>
          <p className="text-sm text-gray-600">Know a great activity? Share it!</p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold text-gray-900 mb-1">Your Stats</h3>
          <p className="text-sm text-gray-600">
            {leads.length} interests • {reviews.length} reviews
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('leads')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'leads'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Interests ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reviews'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Reviews ({reviews.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-lg shadow-md">
          {leads.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-4">No activity interests yet</div>
              <Link
                href="/activities"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Browse Activities
              </Link>
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
                        <div>School: {lead.activity.school.name}</div>
                        <div>Child Age: {lead.child_age}</div>
                        <div>Submitted: {formatDate(lead.created_at)}</div>
                      </div>

                      {lead.message && (
                        <div className="text-sm text-gray-700 mb-3">
                          <strong>Your message:</strong> {lead.message}
                        </div>
                      )}

                      {lead.status === 'contacted' && (
                        <div className="text-sm text-gray-600">
                          <div>Contact: {lead.activity.school.phone}</div>
                          <div>Email: {lead.activity.school.email}</div>
                        </div>
                      )}
                    </div>

                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="bg-white rounded-lg shadow-md">
          {reviews.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-4">No reviews yet</div>
              <Link
                href="/schools"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Browse Schools
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {review.school.name}
                      </h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < review.rating ? '★' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {review.rating}/5
                        </span>
                      </div>

                      {review.comment && (
                        <p className="text-sm text-gray-700 mb-2">
                          {review.comment}
                        </p>
                      )}

                      <div className="text-xs text-gray-500">
                        {formatDate(review.created_at)}
                      </div>
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