import { useState, useEffect } from 'react';
import { Upload, Clock, PlayCircle, Image, Video, ArrowRight, CheckCircle, Loader } from 'lucide-react';
import { contenuApi, imagesApi } from '../api/client';

interface MediaItem {
  name: string;
  time: string;
  icon: any;
  status: 'completed' | 'processing';
  gradient: string;
  size: string;
  delay: string;
}

const MediaPlanning = () => {
  const [mounted, setMounted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(65);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) return 65;
        return prev + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.allSettled([
      contenuApi.list(),
      imagesApi.list()
    ])
      .then(results => {
        if (!mounted) return;
        
        const [contenu, images] = results.map(r => 
          r.status === 'fulfilled' ? (r.value as any)?.data || [] : []
        );

        const mediaItems: MediaItem[] = [
          ...contenu.map((c: any): MediaItem => ({
            name: c.titre || 'Contenu sans titre',
            time: 'Il y a 1h',
            icon: Video,
            status: 'completed',
            gradient: 'from-amber-500 to-orange-500',
            size: '45.8 MB',
            delay: '0.2s'
          })),
          ...images.map((img: any): MediaItem => ({
            name: img.url?.split('/').pop() || 'Image sans nom',
            time: 'Il y a 20h',
            icon: Image,
            status: 'completed',
            gradient: 'from-blue-500 to-cyan-500',
            size: '2.4 MB',
            delay: '0.3s'
          }))
        ];

        setMediaItems(mediaItems);
      })
      .catch(err => {
        console.error('Error fetching media:', err);
        setError('Erreur lors du chargement des médias');
      })
      .finally(() => setLoading(false));

    return () => { mounted = false };
  }, []);

  return (
    <div className="p-4 sm:p-6 text-gray-100 min-h-screen bg-gray-900">
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out both;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out both;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out both;
        }

        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }

        .glassmorphism {
          background: rgba(31, 41, 55, 0.4);
          backdrop-filter: blur(12px);
        }

        .media-item:hover .media-icon {
          transform: scale(1.1);
        }
      `}</style>

      {/* Header avec animation */}
      <div
        className={`mb-6 p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 backdrop-blur-xl border border-blue-500/30 ${mounted ? 'animate-fadeInDown' : 'opacity-0'}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              Planification & Médias
            </h2>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <Upload className="text-purple-400 w-8 h-8" />
        </div>
      </div>

      {/* Tutorial Section */}
      <div
        className={`glassmorphism rounded-2xl p-6 shadow-xl border-2 border-emerald-500/30 mb-6 ${mounted ? 'animate-scaleIn' : 'opacity-0'}`}
        style={{ animationDelay: '0.1s' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
              <PlayCircle className="text-white w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-white mb-1">
                Tutoriel Vidéo : <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Les Bases</span>
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Article : S.Clé — <span className="text-emerald-400 font-semibold">Succès</span>
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1 flex-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <span className="text-xs text-gray-400">100%</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 whitespace-nowrap">
            <CheckCircle className="w-3.5 h-3.5" />
            Prêt
          </span>
        </div>
      </div>

      {/* Recent Media Section */}
      {loading && (
        <div className="text-sm text-gray-400 mb-6">Chargement des médias...</div>
      )}
      {error && (
        <div className="text-sm text-red-400 mb-6">{error}</div>
      )}
      <div
        className={`glassmorphism rounded-2xl p-6 shadow-xl border-2 border-purple-500/30 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}
        style={{ animationDelay: '0.2s' }}
      >
        <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-5">
          Médias Récents ({mediaItems.length})
        </h3>

        <div className="space-y-4">
          {mediaItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`media-item glassmorphism rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 ${mounted ? 'animate-slideIn' : 'opacity-0'}`}
                style={{ animationDelay: item.delay }}
              >
                <div className="flex items-center gap-4">
                  <div className={`media-icon p-3 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg transition-transform duration-300`}>
                    <Icon className="text-white w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate mb-1">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-3">
                      {item.status === 'completed' ? (
                        <>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-400">{item.size}</span>
                        </>
                      ) : (
                        <span className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                          <Loader className="w-3 h-3 animate-spin-slow" />
                          Compression en cours
                        </span>
                      )}
                    </div>
                    
                    {item.status === 'processing' && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{uploadProgress}% complété</span>
                          <span className="text-xs text-gray-500">{item.size}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {item.status === 'completed' && (
                    <CheckCircle className="text-emerald-400 w-5 h-5 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-700/50">
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total Uploads</p>
            <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {mediaItems.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Ce Mois</p>
            <p className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {mediaItems.filter(m => m.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <button className="group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-xl font-semibold mt-6 w-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30">
          Accéder à la Gestion de Contenu
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default MediaPlanning;