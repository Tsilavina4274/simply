import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Building, Calendar, Save,
} from 'lucide-react';
import type { 
  UserProfile, 
  ProfileUpdate, 
  SettingsUpdate, 
  SocialUpdate 
} from '../../types/profileTypes';
import { InputField } from './InputField';

interface ProfileProps {
  profile: UserProfile;
  onUpdate: (updates: ProfileUpdate) => Promise<void>;
  onUpdateSettings: (settings: SettingsUpdate) => Promise<void>;
  onUpdateSocial: (social: SocialUpdate) => Promise<void>;
  isSaving: boolean;
}

export const Profile: React.FC<ProfileProps> = ({ 
  profile, 
  onUpdate,
  isSaving 
}) => {
  const [mounted, setMounted] = useState(false);
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const handleInputChange = (field: keyof ProfileUpdate) => (value: string) => {
    setLocalProfile(prev => ({
      ...prev,
      [field]: value || null
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    
    const updates: ProfileUpdate = {
      firstName: localProfile.firstName,
      lastName: localProfile.lastName,
      phone: localProfile.phone,
      bio: localProfile.bio,
      job: localProfile.job,
      country: localProfile.country,
      city: localProfile.city,
      postalCode: localProfile.postalCode,
      birthday: localProfile.birthday,
    };

    try {
      await onUpdate(updates);
      setHasChanges(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informations personnelles */}
      <div className={`glassmorphism rounded-2xl p-6 shadow-xl border-2 border-purple-500/30 ${
        mounted ? 'animate-fadeInUp' : 'opacity-0'
      }`}>
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
          Informations Personnelles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField 
            label="First Name" 
            icon={User} 
            value={localProfile.firstName || ''} 
            onChange={handleInputChange('firstName')}
            disabled={isSaving}
          />
          <InputField 
            label="Last Name" 
            icon={User} 
            value={localProfile.lastName || ''} 
            onChange={handleInputChange('lastName')}
            disabled={isSaving}
          />
          <InputField 
            label="Email" 
            icon={Mail} 
            value={localProfile.email} 
            disabled={true}
          />
          <InputField 
            label="Phone" 
            icon={Phone} 
            value={localProfile.phone || ''} 
            onChange={handleInputChange('phone')}
            disabled={isSaving}
          />
          <InputField 
            label="Bio" 
            icon={User} 
            value={localProfile.bio || ''} 
            onChange={handleInputChange('bio')}
            disabled={isSaving}
          />
          <InputField 
            label="Job" 
            icon={Building} 
            value={localProfile.job || ''} 
            onChange={handleInputChange('job')}
            disabled={isSaving}
          />
          <InputField 
            label="Country" 
            icon={MapPin} 
            value={localProfile.country || ''} 
            onChange={handleInputChange('country')}
            disabled={isSaving}
          />
          <InputField 
            label="City" 
            icon={MapPin} 
            value={localProfile.city || ''} 
            onChange={handleInputChange('city')}
            disabled={isSaving}
          />
          <InputField 
            label="Postal Code" 
            icon={MapPin} 
            value={localProfile.postalCode || ''} 
            onChange={handleInputChange('postalCode')}
            disabled={isSaving}
          />
          <InputField 
            label="Birthday" 
            icon={Calendar} 
            value={localProfile.birthday || ''} 
            onChange={handleInputChange('birthday')}
            disabled={isSaving}
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="group mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold w-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {isSaving ? 'Enregistrement...' : 'Enregistrer les Modifications'}
        </button>
      </div>
    </div>
  );
};