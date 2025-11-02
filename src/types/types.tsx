
// types/types.ts
export interface Fan {
  id: string;
  nom: string;
  initiale: string;
  urlAvatar?: string;
  statut: 'Spender' | 'Good buyer' | 'Timewaster';
  derniereActivite: string;
  totalDepense: number;
}

export interface Contenu {
  id: string;
  titre: 'Acheté' | 'En attente' | 'Refusé' | 'Gratuit' | 'Public';
  urlImage: string;
  prix: number;
}

export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

export interface UserSocial {
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
}

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

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Types pour les mises à jour
export type ProfileUpdate = Partial<Omit<UserProfile, 'id' | 'email' | 'settings' | 'social' | 'createdAt' | 'updatedAt'>>;
export type SettingsUpdate = Partial<UserSettings>;
export type SocialUpdate = Partial<UserSocial>;