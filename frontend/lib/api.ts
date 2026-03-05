// SKILLIO API - 100% SUPABASE INTEGRATION
// =====================================
// Note: This replaces the old Coolify backend with pure Supabase

import { schoolsAPI } from './supabase-api';

// Re-export Supabase APIs for backward compatibility
export { schoolsAPI };

// Placeholder APIs for future implementation
export const activitiesAPI = {
  getAll: () => Promise.resolve({ data: [] }),
  getOne: (id: any) => Promise.resolve({ data: null }),
};

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

// EMERGENCY AUTH - Compatible with emergency backend endpoints
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

// Legacy compatibility - all APIs now use Supabase
export default {
  get: () => Promise.reject('Use Supabase client instead'),
  post: () => Promise.reject('Use Supabase client instead'),
};
