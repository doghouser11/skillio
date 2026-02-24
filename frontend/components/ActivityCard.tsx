'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { leadsAPI } from '@/lib/api';

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
  } | null;
}

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { user, isParent } = useAuth();
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [childAge, setChildAge] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await leadsAPI.create({
        activity_id: activity.id,
        child_age: parseInt(childAge),
        message,
      });
      
      setSubmitted(true);
      setShowInterestForm(false);
      
      // Reset form
      setChildAge('');
      setMessage('');
      
      // Show success message briefly
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting interest:', error);
      alert('Error submitting interest. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Activity Header */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {activity.title}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {activity.category}
          </span>
        </div>

        {/* School Info */}
        {activity.school && (
          <div className="flex items-center mb-3 text-sm text-gray-600">
            <span>{activity.school.name}</span>
            {activity.school.verified && (
              <span className="ml-2 text-green-600">✓ Verified</span>
            )}
            <span className="ml-2">• {activity.school.city}</span>
          </div>
        )}

        {/* Age Range */}
        <div className="mb-3">
          <span className="text-sm text-gray-600">
            Ages {activity.age_min}-{activity.age_max}
          </span>
          {activity.price_monthly && (
            <span className="ml-4 text-sm font-medium text-green-600">
              ${activity.price_monthly}/month
            </span>
          )}
        </div>

        {/* Description */}
        {activity.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-3">
            {activity.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {isParent && user && (
            <>
              {!showInterestForm && !submitted && (
                <button
                  onClick={() => setShowInterestForm(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600"
                >
                  Show Interest
                </button>
              )}
              
              {submitted && (
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded text-sm">
                  Interest submitted! School will contact you.
                </div>
              )}
            </>
          )}
          
          {!user && (
            <a
              href="/login"
              className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
            >
              Login to Show Interest
            </a>
          )}
        </div>
      </div>

      {/* Interest Form */}
      {showInterestForm && (
        <div className="border-t p-6 bg-gray-50">
          <h4 className="font-medium mb-4">Express Interest</h4>
          <form onSubmit={handleInterestSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Child&apos;s Age
              </label>
              <input
                type="number"
                min={activity.age_min}
                max={activity.age_max}
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Any questions or special requirements..."
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Interest'}
              </button>
              <button
                type="button"
                onClick={() => setShowInterestForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}