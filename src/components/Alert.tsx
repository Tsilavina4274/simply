import { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Bot, ArrowRight, Sparkles, CheckCircle, X } from 'lucide-react';
import { usersApi, fansApi, contenuApi } from '../api/client';

interface ApiAlert {
  type: 'Priorité Haute' | 'Notification' | 'Recommandation IA';
  text: string;
  button: string;
  icon: any;
  gradient: string;
  bg: string;
  border: string;
  textColor: string;
  delay: string;
  priority: 'high' | 'medium' | 'low';
}

const generateAlerts = (users: any[], fans: any[], content: any[]): ApiAlert[] => {
  const alerts: ApiAlert[] = [];

  // Alerte sur la performance moyenne des utilisateurs
  const avgPerformance = users.length ? users.reduce((sum, u) => sum + (u.performance || 0), 0) / users.length : 0;
  if (avgPerformance < 70) {
    alerts.push({
      type: 'Priorité Haute',
      text: `Performance moyenne des employés faible (${avgPerformance.toFixed(0)}%). Une action est requise.`,
      button: 'Voir analyse',
      icon: AlertTriangle,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/40',
      textColor: 'text-amber-400',
      delay: '0.1s',
      priority: 'high'
    });
  }

  // Alerte sur l'activité des fans
  if (fans.length > 0) {
    alerts.push({
      type: 'Notification',
      text: `${fans.length} fans actifs. Engagement en hausse de 12% cette semaine.`,
      button: 'Voir détails',
      icon: Bell,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/40',
      textColor: 'text-blue-400',
      delay: '0.2s',
      priority: 'medium'
    });
  }

  // Recommandation basée sur le contenu
  if (content.length < 5) {
    alerts.push({
      type: 'Recommandation IA',
      text: 'Augmentez votre production de contenu pour stimuler l\'engagement.',
      button: 'Créer',
      icon: Bot,
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/40',
      textColor: 'text-purple-400',
      delay: '0.3s',
      priority: 'low'
    });
  }

  return alerts;
};

const AlertsAndRecs = () => {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<ApiAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.allSettled([
      usersApi.list(),
      fansApi.list(),
      contenuApi.list()
    ])
      .then(results => {
        if (!mounted) return;
        
        const [users, fans, content] = results.map(r => 
          r.status === 'fulfilled' ? (r.value as any)?.data || [] : []
        );

        setNotifications(generateAlerts(users, fans, content));
      })
      .catch(err => {
        console.error('Error fetching alert data:', err);
        setError('Erreur lors du chargement des alertes');
      })
      .finally(() => setLoading(false));

    return () => { mounted = false };
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDismiss = (index: number) => {
    setDismissed([...dismissed, index]);
  };

  const activeNotifications = notifications.filter((_, index) => !dismissed.includes(index));

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

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.6);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out both;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out both;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out both;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .glassmorphism {
          background: rgba(31, 41, 55, 0.4);
          backdrop-filter: blur(12px);
        }

        .alert-card:hover .alert-icon {
          transform: scale(1.1) rotate(5deg);
        }

        .alert-card.dismissed {
          animation: slideOut 0.3s ease-out forwards;
        }

        @keyframes slideOut {
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }
      `}</style>

      {/* Header avec animation */}
      <div
        className={`mb-6 p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 backdrop-blur-xl border border-blue-500/30 ${mounted ? 'animate-fadeInDown' : 'opacity-0'}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                Alertes & Recommandations
              </h2>
              {activeNotifications.length > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                  {activeNotifications.length}
                </span>
              )}
            </div>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <Sparkles className="text-purple-400 w-8 h-8" />
        </div>
      </div>

      {/* Stats Cards */}
      {loading && (
        <div className="text-sm text-gray-400 mb-6">Chargement des alertes...</div>
      )}
      {error && (
        <div className="text-sm text-red-400 mb-6">{error}</div>
      )}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Critiques', value: '1', gradient: 'from-red-500 to-orange-500', icon: AlertTriangle },
          { label: 'Nouvelles', value: '1', gradient: 'from-blue-500 to-cyan-500', icon: Bell },
          { label: 'IA', value: '1', gradient: 'from-purple-500 to-pink-500', icon: Bot }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`glassmorphism rounded-xl p-4 border border-gray-700/50 text-center ${mounted ? 'animate-scaleIn' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.gradient} mb-2`}>
                <Icon className="text-white w-4 h-4" />
              </div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts List */}
      <div className="space-y-4 mb-6">
        {activeNotifications.map((alert) => {
          const Icon = alert.icon;
          const originalIndex = notifications.indexOf(alert);
          
          return (
            <div
              key={originalIndex}
              className={`alert-card relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl ${
                alert.priority === 'high' ? 'animate-pulse-glow' : ''
              } ${mounted ? 'animate-slideIn' : 'opacity-0'}`}
              style={{ animationDelay: alert.delay }}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl"></div>
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${alert.gradient}`}></div>

              <div className={`relative p-5 border ${alert.border}`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`alert-icon flex-shrink-0 p-3 rounded-xl bg-gradient-to-br ${alert.gradient} shadow-lg transition-transform duration-300`}>
                    <Icon className="text-white w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm font-bold ${alert.textColor} uppercase tracking-wide`}>
                        {alert.type}
                      </p>
                      <button
                        onClick={() => handleDismiss(originalIndex)}
                        className="text-gray-500 hover:text-gray-300 transition-colors p-1 hover:bg-gray-700/50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {alert.text}
                    </p>

                    <button
                      className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r ${alert.gradient} text-white hover:shadow-lg transition-all duration-300 hover:scale-105`}
                    >
                      {alert.button}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Progress bar for high priority */}
                {alert.priority === 'high' && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">Action requise</p>
                      <p className="text-xs text-amber-400 font-semibold">Urgent</p>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${alert.gradient} rounded-full animate-pulse`} style={{ width: '75%' }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {activeNotifications.length === 0 && (
        <div className={`glassmorphism rounded-2xl p-8 text-center border-2 border-emerald-500/30 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Tout est en ordre !</h3>
          <p className="text-sm text-gray-400">Aucune alerte à traiter pour le moment</p>
        </div>
      )}

      {/* Summary Card */}
      {activeNotifications.length > 0 && (
        <div
          className={`glassmorphism rounded-2xl p-6 shadow-xl border-2 border-purple-500/30 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}
          style={{ animationDelay: '0.4s' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                <Bell className="text-white w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Résumé des Notifications</p>
                <p className="text-xs text-gray-400">{activeNotifications.length} notification(s) active(s)</p>
              </div>
            </div>
          </div>

          <button className="group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-xl font-semibold w-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30">
            Voir toutes les notifications
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AlertsAndRecs;