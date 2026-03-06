// EMERGENCY API - Compatible with emergency backend endpoints
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.skillio.live';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export const authAPI = {
  login: (data: any) => {
    console.log('🔥 LOGIN: Calling', API_URL + '/api/emergency/login');
    return api.post('/api/emergency/login', data);
  },
  register: (data: any) => {
    console.log('🔥 REGISTER: Calling', API_URL + '/api/emergency/register');
    return api.post('/api/emergency/register', data);
  },
  me: () => api.get('/api/auth/me'),
};

// Emergency schools API
export const schoolsAPI = {
  getAll: async (filters?: any) => {
    const response = await fetch(`${API_URL}/api/emergency/schools`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch schools');
    const data = await response.json();
    return { data };
  },
  getOne: (id: any) => Promise.resolve({ data: null }),
  create: (data: any) => Promise.resolve({ data: null }),
  update: (id: any, data: any) => Promise.resolve({ data: null }),
  delete: (id: any) => Promise.resolve({ data: null }),
  // ADMIN FUNCTIONS - Real API integration  
  verify: async (schoolId: string) => {
    return api.put(`/api/admin/schools/${schoolId}/approve`);
  },
};

// Emergency activities API
export const activitiesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/emergency/activities`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch activities');
    const data = await response.json();
    return { data };
  },
  getOne: (id: any) => Promise.resolve({ data: null }),
  create: (data: any) => Promise.resolve({ data: null }),
  update: (id: any, data: any) => Promise.resolve({ data: null }),
  delete: (id: any) => Promise.resolve({ data: null }),
  // ADMIN FUNCTIONS - Real API integration
  verify: async (activityId: string) => {
    return api.put(`/api/admin/activities/${activityId}/verify`, { verified: true });
  },
};

// Placeholder APIs for future implementation
export const leadsAPI = {
  getAll: () => Promise.resolve({ data: [] }),
  getMy: () => Promise.resolve({ data: [] }),
  getSchool: () => Promise.resolve({ data: [] }),
  create: (data: any) => Promise.resolve({ data: null }),
  updateStatus: (id: any, status: string) => Promise.resolve({ data: null }),
};

export const reviewsAPI = {
  getAll: () => Promise.resolve({ data: [] }),
  create: (data: any) => Promise.resolve({ data: null }),
};

export const neighborhoodsAPI = {
  getAll: () => Promise.resolve({ data: [] }),
};

// Emergency endpoints for data
export const emergencyAPI = {
  schools: () => fetch(`${API_URL}/api/emergency/schools`).then(r => r.json()),  
  activities: () => fetch(`${API_URL}/api/emergency/activities`).then(r => r.json()),
};

// ADMIN API - Real backend integration  
export const adminAPI = {
  getStats: () => api.get('/api/admin/stats'),
  getPendingSchools: () => api.get('/api/admin/schools/pending'),
  getAllSchools: (params?: any) => api.get('/api/admin/schools', { params }),
  approveSchool: (schoolId: string, approval: { status: string }) => 
    api.put(`/api/admin/schools/${schoolId}/approve`, approval),
  getAllActivities: (params?: any) => api.get('/api/admin/activities', { params }),
  verifyActivity: (activityId: string, verified: boolean = true) => 
    api.put(`/api/admin/activities/${activityId}/verify`, { verified }),
  getAllLeads: (params?: any) => api.get('/api/admin/leads', { params }),
};

// Legacy compatibility
export default api;