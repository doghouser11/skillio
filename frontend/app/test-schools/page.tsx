'use client';

import { useState, useEffect } from 'react';

export default function TestSchoolsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    console.log('🔥 TEST: Component mounted, starting emergency API call...');
    
    const fetchData = async () => {
      try {
        console.log('🔥 TEST: Calling emergency schools endpoint...');
        
        const API_URL = 'https://api.skillio.live';
        const response = await fetch(`${API_URL}/api/emergency/schools`, {
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const schoolsData = await response.json();
        
        console.log('🔥 TEST: Emergency API Response:', schoolsData);
        setData(schoolsData);
      } catch (err: any) {
        console.error('❌ TEST: API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Test Emergency Schools API</h1>
      
      {loading && (
        <div className="text-blue-600">⏳ Loading emergency schools data...</div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          ❌ Error: {error}
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            ✅ Success! Loaded {data.length} schools from emergency endpoint
          </div>
          
          <div className="grid gap-4">
            {data.map((school, index) => (
              <div key={school.id || index} className="bg-white border rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-lg mb-2">{school.name}</h3>
                <p className="text-gray-600 mb-2">{school.description}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>📍 Град: {school.city}</p>
                  {school.phone && <p>📞 Телефон: {school.phone}</p>}
                  {school.email && <p>📧 Имейл: {school.email}</p>}
                  {school.website && <p>🌐 Уебсайт: {school.website}</p>}
                  <p>✅ Верифицирано: {school.verified ? 'Да' : 'Не'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <pre className="text-xs text-gray-600">
          API URL: {'https://api.skillio.live'}{'\n'}
          Endpoint: /api/emergency/schools{'\n'}
          Status: {loading ? 'Loading' : error ? 'Error' : 'Success'}{'\n'}
          Schools count: {data.length}
        </pre>
      </div>
    </div>
  );
}