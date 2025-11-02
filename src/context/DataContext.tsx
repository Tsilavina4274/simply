import React, { createContext, useContext, useEffect, useState } from 'react';
import { usersApi, fansApi, contenuApi, imagesApi } from '../api/client';

interface DataContextType {
  users: any[];
  fans: any[];
  content: any[];
  images: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  users: [],
  fans: [],
  content: [],
  images: [],
  loading: false,
  error: null,
  refetch: async () => {}
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [fans, setFans] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersRes, fansRes, contentRes, imagesRes] = await Promise.allSettled([
        usersApi.list(),
        fansApi.list(),
        contenuApi.list(),
        imagesApi.list()
      ]);

      if (usersRes.status === 'fulfilled') setUsers(usersRes.value?.data || []);
      if (fansRes.status === 'fulfilled') setFans(fansRes.value?.data || []);
      if (contentRes.status === 'fulfilled') setContent(contentRes.value?.data || []);
      if (imagesRes.status === 'fulfilled') setImages(imagesRes.value?.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value = {
    users,
    fans,
    content,
    images,
    loading,
    error,
    refetch: fetchData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Hook spécialisés pour éviter les re-renders inutiles
export const useUsers = () => {
  const { users, loading, error, refetch } = useData();
  return { users, loading, error, refetch };
};

export const useFans = () => {
  const { fans, loading, error, refetch } = useData();
  return { fans, loading, error, refetch };
};

export const useContent = () => {
  const { content, loading, error, refetch } = useData();
  return { content, loading, error, refetch };
};

export const useImages = () => {
  const { images, loading, error, refetch } = useData();
  return { images, loading, error, refetch };
};