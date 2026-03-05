'use client';

import { useState, useEffect } from 'react';
import { schoolsAPI } from '@/lib/supabase-api';

export default function TestSchoolsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('🔥 TEST: Component mounted, starting API call...');
    
    const fetchData = async () => {
      try {
        console.log('🔥 TEST: Calling schoolsAPI.getAll()...');
        
        const response = await schoolsAPI.getAll();
        
        console.log('🔥 TEST: API Response:', response);
        
        setData(response.data);
        setError('');
        
      } catch (err) {
        console.error('🔥 TEST: Error:', err);
        setError(err.message || 'Unknown error');
      } finally {
        console.log('🔥 TEST: Setting loading to false');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Test Schools API</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Data count:</strong> {data.length}</p>
      </div>

      {loading && (
        <div className="text-blue-600">Loading schools...</div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 p-4 rounded">
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {data.map((school) => (
            <div key={school.id} className="bg-white p-4 rounded shadow border">
              <h3 className="font-bold text-lg">{school.name}</h3>
              <p className="text-gray-600">{school.city}</p>
              <p className="text-sm text-gray-500">{school.address}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}