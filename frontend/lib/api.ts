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

export const authAPI = {
  // These are handled by Supabase Auth in AuthContext
  login: () => Promise.reject('Use Supabase Auth via AuthContext'),
  register: () => Promise.reject('Use Supabase Auth via AuthContext'),
  me: () => Promise.reject('Use Supabase Auth via AuthContext'),
};

// Legacy compatibility - all APIs now use Supabase
export default {
  get: () => Promise.reject('Use Supabase client instead'),
  post: () => Promise.reject('Use Supabase client instead'),
};
