'use client';

import Link from 'next/link';

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

interface SchoolCardProps {
  school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        {/* School Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {school.name}
          </h3>
          {school.verified && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Location */}
        <div className="text-sm text-gray-600 mb-3">
          <div>{school.city}</div>
          {school.neighborhood && (
            <div>{school.neighborhood.name}</div>
          )}
          {school.address && (
            <div className="text-xs text-gray-500 mt-1">{school.address}</div>
          )}
        </div>

        {/* Description */}
        {school.description && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-3">
            {school.description}
          </p>
        )}

        {/* Contact Info */}
        <div className="space-y-1 text-sm text-gray-600 mb-4">
          {school.phone && (
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">📞</span>
              <span>{school.phone}</span>
            </div>
          )}
          {school.email && (
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2">✉️</span>
              <span className="truncate">{school.email}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Link
            href={`/schools/${school.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 flex-1 text-center"
          >
            View Details
          </Link>
          <Link
            href={`/schools/${school.id}/activities`}
            className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 flex-1 text-center"
          >
            View Activities
          </Link>
        </div>
      </div>
    </div>
  );
}