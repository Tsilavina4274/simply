// Types pour les paramètres utilisateur
export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

// Types pour les réseaux sociaux
export interface UserSocial {
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
}

// Type principal du profil utilisateur
export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  bio: string | null;
  job: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  postalCode: string | null;
  birthday: string | null;
  settings: UserSettings;
  social: UserSocial;
  createdAt: string;
  updatedAt: string;
}

// Type pour les réponses API
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Types pour les mises à jour
export type ProfileUpdate = Partial<Omit<UserProfile, 'id' | 'email' | 'settings' | 'social' | 'createdAt' | 'updatedAt'>>;
export type SettingsUpdate = Partial<UserSettings>;
export type SocialUpdate = Partial<UserSocial>;