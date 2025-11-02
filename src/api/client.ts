import type { 
  UserProfile, 
  ApiResponse,
  ProfileUpdate,
  SettingsUpdate,
  SocialUpdate
} from '../types/profileTypes';

const API_BASE = import.meta.env.VITE_API_URL || 'https://back-simply.onrender.com';

type FetchOptions = RequestInit & { authenticate?: boolean };

function getAuthToken() {
  return localStorage.getItem('token');
}

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const pathWithSlash = path.startsWith('/') ? path : `/${path}`;
  const url = API_BASE.replace(/\/$/, '') + pathWithSlash;

  // Build headers
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  const body = (options as any).body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  // Add Authorization header dynamically if token is present and authentication
  // is not explicitly disabled. Do NOT throw if token is missing; let the
  // server respond with 401 so the UI can handle redirecting to login.
  if (options.authenticate !== false) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  // default to sending credentials (cookies) unless caller overrides
  const fetchOptions: RequestInit = { ...options, headers };
  if ((fetchOptions as any).credentials === undefined) (fetchOptions as any).credentials = 'include';

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const text = await res.text();
    let body: any;
    try { body = JSON.parse(text); } catch { body = { message: text }; }
    const err = new Error(body.error || body.message || res.statusText);
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }

  const content = await res.text();
  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
}

export async function post(path: string, body: any, opts: RequestInit & { authenticate?: boolean } = {}) {
  return apiFetch(path, { method: 'POST', body: JSON.stringify(body), ...opts });
}

export async function put(path: string, body: any, opts: RequestInit & { authenticate?: boolean } = {}) {
  return apiFetch(path, { method: 'PUT', body: JSON.stringify(body), ...opts });
}

export async function get(path: string, opts: RequestInit & { authenticate?: boolean } = {}) {
  return apiFetch(path, { method: 'GET', ...opts });
}

// =====================
// Profile API
// =====================
export const profileApi = {
  getProfile: (): Promise<ApiResponse<UserProfile>> => get('/users/me'),
  updateProfile: (data: ProfileUpdate): Promise<ApiResponse<UserProfile>> => put('/users/me', data),
  updateSettings: (settings: SettingsUpdate): Promise<ApiResponse<UserProfile>> => put('/users/me/settings', settings),
  updateSocial: (social: SocialUpdate): Promise<ApiResponse<UserProfile>> => put('/users/me/social', social),
  uploadAvatar: async (file: File): Promise<ApiResponse<UserProfile>> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiFetch('/users/me', {
      method: 'PUT',
      body: formData,
      headers: {}, // browser sets content-type for FormData
    });
  },
};

// =====================
// Users / Employees API (Admin)
// =====================
export const usersApi = {
  list: async () => get('/users'),
  create: async (data: any) => post('/users', data),
  update: async (id: string, data: any) => put(`/users/${id}`, data),
  delete: async (id: string) => apiFetch(`/users/${id}`, { method: 'DELETE' }),
};

// =====================
// Fans API
// =====================
export const fansApi = {
  list: async () => get('/fans'),
  create: async (data: any) => post('/fans', data),
};

// =====================
// Contenu API
// =====================
export const contenuApi = {
  list: async () => get('/contenu'),
  create: async (data: any) => post('/contenu', data),
};

// =====================
// Images API
// =====================
export const imagesApi = {
  list: async () => get('/images'),
  create: async (data: any) => post('/images', data),
};

// =====================
// Messages API
// =====================
export const messagesApi = {
  list: async (fromId: string, toId: string) => get(`/messages?from=${encodeURIComponent(fromId)}&to=${encodeURIComponent(toId)}`),
  create: async (data: { fromId: string; toId: string; content: string }) => post('/messages', data),
};

export default { apiFetch, post, put, get, profileApi, usersApi, fansApi, contenuApi, imagesApi, messagesApi };
