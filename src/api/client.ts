import type { 
  UserProfile, 
  ApiResponse,
  ProfileUpdate,
  SettingsUpdate,
  SocialUpdate
} from '../types/profileTypes';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

type FetchOptions = RequestInit & { authenticate?: boolean };

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const url = API_BASE.replace(/\/$/, '') + path;

  // Build headers but avoid forcing Content-Type for FormData bodies
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  const body = (options as any).body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!isFormData) {
    // only set JSON content type when not sending FormData
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  if (options.authenticate !== false) {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    let body: any;
    try { body = JSON.parse(text); } catch { body = { message: text }; }
    const err = new Error(body.error || body.message || res.statusText);
    // attach status for callers
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }

  // try parse json
  const content = await res.text();
  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
}

export async function post(path: string, body: any, opts: RequestInit = {}) {
  return apiFetch(path, { method: 'POST', body: JSON.stringify(body), ...opts });
}

export async function put(path: string, body: any, opts: RequestInit = {}) {
  return apiFetch(path, { method: 'PUT', body: JSON.stringify(body), ...opts });
}

export async function get(path: string, opts: RequestInit = {}) {
  return apiFetch(path, { method: 'GET', ...opts });
}

// Profile API
export const profileApi = {
  getProfile: (): Promise<ApiResponse<UserProfile>> => 
    get('/users/me'),

  updateProfile: (data: ProfileUpdate): Promise<ApiResponse<UserProfile>> => 
    put('/users/me', data),

  updateSettings: (settings: SettingsUpdate): Promise<ApiResponse<UserProfile>> => 
    put('/users/me/settings', settings),

  updateSocial: (social: SocialUpdate): Promise<ApiResponse<UserProfile>> => 
    put('/users/me/social', social),

  uploadAvatar: async (file: File): Promise<ApiResponse<UserProfile>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    // The backend accepts avatar upload on PUT /users/me (multipart)
    return apiFetch('/users/me', {
      method: 'PUT',
      body: formData,
      headers: {} // Let browser set correct content-type for FormData
    });
  }
};

export default { apiFetch, post, put, get, profileApi };

// Users / employees API (admin)
export const usersApi = {
  list: async () => get('/users'),
  create: async (data: any) => post('/users', data),
  update: async (id: string, data: any) => put(`/users/${id}`, data),
  delete: async (id: string) => apiFetch(`/users/${id}`, { method: 'DELETE' })
};

export const fansApi = {
  list: async () => get('/fans'),
  create: async (data: any) => post('/fans', data)
};

export const contenuApi = {
  list: async () => get('/contenu'),
  create: async (data: any) => post('/contenu', data)
};

export const imagesApi = {
  list: async () => get('/images'),
  create: async (data: any) => post('/images', data)
};

export const messagesApi = {
  // list messages between two users
  list: async (fromId: string, toId: string) => get(`/messages?from=${encodeURIComponent(fromId)}&to=${encodeURIComponent(toId)}`),
  create: async (data: { fromId: string; toId: string; content: string }) => post('/messages', data)
};
