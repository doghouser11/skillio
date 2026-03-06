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
    console.log('🔐 SECURE LOGIN: Calling', API_URL + '/api/auth/login');
    return api.post('/api/auth/login', data);
  },
  register: (data: any) => {
    console.log('🔐 SECURE REGISTER: Calling', API_URL + '/api/auth/register');
    return api.post('/api/auth/register', data);
  },
  me: () => {
    const token = localStorage.getItem('token');
    return api.get('/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  refresh: (refreshToken: string) => {
    return api.post('/api/auth/refresh', { refresh_token: refreshToken });
  },
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

// ADMIN API - Secure backend integration with auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const adminAPI = {
  getStats: () => api.get('/api/admin/stats', { headers: getAuthHeaders() }),
  getPendingSchools: () => api.get('/api/admin/schools/pending', { headers: getAuthHeaders() }),
  getAllSchools: (params?: any) => api.get('/api/admin/schools', { params, headers: getAuthHeaders() }),
  approveSchool: (schoolId: string, approval: { status: string }) => 
    api.put(`/api/admin/schools/${schoolId}/approve`, approval, { headers: getAuthHeaders() }),
  getAllActivities: (params?: any) => api.get('/api/admin/activities', { params, headers: getAuthHeaders() }),
  verifyActivity: (activityId: string, verified: boolean = true) => 
    api.put(`/api/admin/activities/${activityId}/verify`, { verified }, { headers: getAuthHeaders() }),
  getAllLeads: (params?: any) => api.get('/api/admin/leads', { params, headers: getAuthHeaders() }),
};

// ADMIN SETUP API - One-time setup for master admin
export const adminSetupAPI = {
  createMasterAdmin: (data: { email: string; password: string; confirm_password: string }) =>
    api.post('/api/admin-setup/create-master-admin', data),
  resetMasterPassword: (data: { email: string; password: string; confirm_password: string }) =>
    api.post('/api/admin-setup/reset-master-password', data),
  getStatus: () => api.get('/api/admin-setup/status'),
};

// Legacy compatibility
export default api;