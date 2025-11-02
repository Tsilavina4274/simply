import { useState, useEffect } from 'react';
import { User, Clock, Activity, Settings, TrendingUp, Award } from 'lucide-react';
import { usersApi } from '../api/client';

type StatusType = 'En Ligne' | 'En Attente' | 'Permissions';

interface Moderator {
  name: string;
  treated: number;
  time: string;
  status: StatusType;
  efficiency: number;
  trend?: 'up' | 'down';
  avatar?: string;
}

// Transforme un utilisateur de l'API en modérateur pour l'UI
const userToModerator = (user: any): Moderator => {
  const perf = typeof user.performance === 'number' ? user.performance : (user.performance ? parseInt(user.performance as any) : 0);
  const createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
  const minutesActive = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60)) % 60);
  
  return {
    name: user.name || user.email?.split('@')[0] || 'Utilisateur',
    treated: Math.round(perf * 2), // estimation basée sur la performance
    time: `${minutesActive} min`,
    status: perf >= 80 ? 'En Ligne' : perf >= 60 ? 'En Attente' : 'Permissions',
    efficiency: perf,
    trend: perf >= 75 ? 'up' : 'down',
    avatar: user.avatar
  };
};

const statusColors: Record<StatusType, string> = {
  'En Ligne': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  'En Attente': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
  'Permissions': 'bg-blue-500/20 text-blue-400 border-blue-500/40',
};

const ModeratorActivity = () => {
  const [mounted, setMounted] = useState(false);
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    usersApi.list()
      .then((res: any) => {
        const users = Array.isArray(res?.data) ? res.data : [];
        if (!mounted) return;
        setModerators(users.map(userToModerator));
      })
      .catch(err => {
        console.error('Error fetching moderators:', err);
        setError('Erreur lors du chargement des modérateurs');
      })
      .finally(() => setLoading(false));

    return () => { mounted = false };
  }, []);

  useEffect(() => {
    setMounted(true);
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

        .glassmorphism {
          background: rgba(31, 41, 55, 0.4);
          backdrop-filter: blur(12px);
        }

        .table-row-hover:hover {
          background: rgba(59, 130, 246, 0.05);
          transform: translateX(4px);
        }
      `}</style>

      {/* Header avec animation */}
      <div
        className={`mb-6 p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 backdrop-blur-xl border border-blue-500/30 ${mounted ? 'animate-fadeInDown' : 'opacity-0'}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              Activité des Modérateurs
            </h2>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <Activity className="text-purple-400 w-8 h-8" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { icon: User, label: 'Modérateurs Actifs', value: moderators.filter(m => m.status === 'En Ligne').length.toString(), gradient: 'from-blue-500 to-cyan-500', delay: '0.1s' },
          { icon: Activity, label: 'Messages Traités', value: moderators.reduce((sum, m) => sum + m.treated, 0).toString(), gradient: 'from-purple-500 to-pink-500', delay: '0.2s' },
          { icon: Clock, label: 'Temps Moyen', value: `${Math.round(moderators.reduce((sum, m) => sum + parseInt(m.time), 0) / Math.max(1, moderators.length))} min`, gradient: 'from-emerald-500 to-teal-500', delay: '0.3s' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`glassmorphism rounded-xl p-5 shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300 ${mounted ? 'animate-scaleIn' : 'opacity-0'}`}
              style={{ animationDelay: stat.delay }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                  <Icon className="text-white w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 uppercase tracking-wide">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Table Card */}
      <div
        className={`glassmorphism rounded-2xl p-6 shadow-xl border-2 border-purple-500/30 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}
        style={{ animationDelay: '0.4s' }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b-2 border-purple-500/30 text-left text-gray-400 uppercase text-xs tracking-wide">
                <th className="py-4 px-4">Modérateur</th>
                <th className="py-4 px-4">Messages Traités</th>
                <th className="py-4 px-4">Temps de Réponse</th>
                <th className="py-4 px-4">Efficacité</th>
                <th className="py-4 px-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {moderators.map((user, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-800/50 table-row-hover transition-all duration-300 ${mounted ? 'animate-slideIn' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-purple-500/50 ring-offset-2 ring-offset-gray-900">
                          <User className="text-white w-5 h-5" />
                        </div>
                        {user.status === 'En Ligne' && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                        )}
                      </div>
                      <span className="ml-3 font-semibold text-gray-200">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{user.treated}</span>
                      {user.trend === 'up' && (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-300">{user.time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                          style={{ width: `${user.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400 min-w-[35px]">{user.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 ${statusColors[user.status]}`}
                    >
                      {user.status === 'En Ligne' && <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>}
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Best Performer Section */}
        <div className="mt-6 glassmorphism rounded-xl p-4 border border-amber-500/30">
          <div className="flex items-center justify-between">
                {moderators.length > 0 ? (
                  (() => {
                    // Choisir le meilleur modérateur (basé sur "treated") de façon défensive
                    const best = moderators.reduce((prev, cur) => (cur.treated > prev.treated ? cur : prev), moderators[0]);
                    return (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                            <Award className="text-white w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Meilleur Performance</p>
                            <p className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                              {best.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Messages</p>
                          <p className="text-2xl font-bold text-white">{best.treated}</p>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
                        <Award className="text-white w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Meilleur Performance</p>
                        <p className="text-lg font-bold text-gray-300">Aucun modérateur</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Messages</p>
                      <p className="text-2xl font-bold text-gray-300">0</p>
                    </div>
                  </div>
                )}
          </div>
        </div>

        {/* Action Button */}
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold mt-6 w-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 group">
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Gérer les Rôles et Permissions
        </button>
      </div>
    </div>
  );
};

export default ModeratorActivity;