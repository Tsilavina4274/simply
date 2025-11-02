import React, { useEffect, useState } from "react";
import { Profile } from "../components/ui/Profile";
import DashboardLayout from "../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { profileApi } from "../api/client";
import type { 
  UserProfile, 
  ProfileUpdate, 
  SettingsUpdate, 
  SocialUpdate 
} from "../types/profileTypes";

interface ProfileState {
  isLoading: boolean;
  error: string | null;
  data: UserProfile | null;
  isSaving: boolean;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<ProfileState>({
    isLoading: true,
    error: null,
    data: null,
    isSaving: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
        const response = await profileApi.getProfile();
        setState(prev => ({
          ...prev,
          isLoading: false,
          data: response.data
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erreur lors du chargement du profil'
        }));
      }
    };

    loadProfile();
  }, [navigate]);

  const handleUpdateProfile = async (updates: ProfileUpdate) => {
    try {
      setState(prev => ({ ...prev, isSaving: true, error: null }));
      const response = await profileApi.updateProfile(updates);
      setState(prev => ({
        ...prev,
        isSaving: false,
        data: response.data,
        error: null
      }));
      // Optionnel: Ajouter une notification de succès
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: 'Erreur lors de la mise à jour du profil'
      }));
    }
  };

  const handleUpdateSettings = async (settings: SettingsUpdate) => {
    try {
      setState(prev => ({ ...prev, isSaving: true, error: null }));
      const response = await profileApi.updateSettings(settings);
      setState(prev => ({
        ...prev,
        isSaving: false,
        data: response.data,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: 'Erreur lors de la mise à jour des paramètres'
      }));
    }
  };

  const handleUpdateSocial = async (social: SocialUpdate) => {
    try {
      setState(prev => ({ ...prev, isSaving: true, error: null }));
      const response = await profileApi.updateSocial(social);
      setState(prev => ({
        ...prev,
        isSaving: false,
        data: response.data,
        error: null
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: 'Erreur lors de la mise à jour des réseaux sociaux'
      }));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-gray-900 p-6">
        {state.isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : state.error ? (
          <div className="text-red-500 text-center p-4 bg-red-500/10 rounded-lg">
            {state.error}
          </div>
        ) : (
          <Profile
            profile={state.data!}
            onUpdate={handleUpdateProfile}
            onUpdateSettings={handleUpdateSettings}
            onUpdateSocial={handleUpdateSocial}
            isSaving={state.isSaving}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
