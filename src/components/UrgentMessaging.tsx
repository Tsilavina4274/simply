import { useState, useEffect } from 'react';
import { Mail, User, Clock, Send, Edit, AlertCircle, Star, ArrowRight, Filter } from 'lucide-react';
import { useUsers, useFans } from '../context/DataContext';

type Status = 'VIP' | 'Urgent' | 'Normal';

type Message = {
  id: string;
  user: string;
  status: Status;
  time: string;
  content: string;
  unread: boolean;
  priority: 'high' | 'urgent' | 'normal';
};

// Génère des messages à partir des données des utilisateurs et fans
const generateMessages = (users: any[], fans: any[]): Message[] => {
  const messages: Message[] = [];

  // VIP messages basés sur les fans avec haut total de dépenses
  fans
    .filter(f => (f.totalDepense || 0) > 100)
    .slice(0, 2)
    .forEach(f => {
      messages.push({
        id: `fan_${f.id}`,
        user: f.nom || 'Fan VIP',
        status: 'VIP',
        time: 'il y a 2h',
        content: 'Question sur l\'accès premium',
        unread: true,
        priority: 'high'
      });
    });

  // Messages urgents basés sur les utilisateurs avec performance basse
  users
    .filter(u => (u.performance || 0) < 60)
    .slice(0, 2)
    .forEach(u => {
      messages.push({
        id: `user_${u.id}`,
        user: u.name || u.email || 'Employé',
        status: 'Urgent',
        time: 'il y a 1h',
        content: 'Besoin d\'assistance',
        unread: true,
        priority: 'urgent'
      });
    });

  // Messages normaux basés sur les autres fans
  fans
    .filter(f => (f.totalDepense || 0) <= 100)
    .slice(0, 3)
    .forEach(f => {
      messages.push({
        id: `fan_${f.id}`,
        user: f.nom || 'Fan',
        status: 'Normal',
        time: 'il y a 4h',
        content: 'Question générale',
        unread: false,
        priority: 'normal'
      });
    });

  return messages;
};

const UrgentMessaging = () => {
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Use shared data from DataContext to avoid duplicate network requests
  const { users } = useUsers();
  const { fans } = useFans();

  useEffect(() => {
    // Derive messages from context data whenever users or fans change
    setLoading(true);
    try {
      setMessages(generateMessages(users || [], fans || []));
      setError(null);
    } catch (err) {
      console.error('Error generating messages from context data:', err);
      setError('Erreur lors du chargement des messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [users, fans]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filters = [
    { id: 'unread', label: 'Non lus', count: messages.filter(m => m.unread).length, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'vip', label: 'VIP', count: messages.filter(m => m.status === 'VIP').length, gradient: 'from-red-500 to-pink-500' },
    { id: 'urgent', label: 'Urgents', count: messages.filter(m => m.status === 'Urgent').length, gradient: 'from-amber-500 to-orange-500' }
  ];

  const statusConfig = {
    'VIP': {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/40',
      gradient: 'from-red-500 to-pink-500',
      icon: Star
    },
    'Urgent': {
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      gradient: 'from-amber-500 to-orange-500',
      icon: AlertCircle
    },
    'Normal': {
      bg: 'bg-gray-600/20',
      text: 'text-gray-400',
      border: 'border-gray-600/40',
      gradient: 'from-gray-500 to-gray-600',
      icon: Mail
    }
  };

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

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
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

        .animate-pulse-dot {
          animation: pulse-dot 2s ease-in-out infinite;
        }

        .glassmorphism {
          background: rgba(31, 41, 55, 0.4);
          backdrop-filter: blur(12px);
        }

        .message-item:hover {
          transform: translateX(4px);
        }
      `}</style>

      {/* Header avec animation */}
      {loading && (
        <div className="text-sm text-gray-400 mb-6">Chargement des messages...</div>
      )}
      {error && (
        <div className="text-sm text-red-400 mb-6">{error}</div>
      )}
      <div
        className={`mb-6 p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 backdrop-blur-xl border border-blue-500/30 ${mounted ? 'animate-fadeInDown' : 'opacity-0'}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                Messagerie Urgente
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                {messages.filter(m => m.unread).length} nouveaux
              </span>
            </div>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <Mail className="text-purple-400 w-8 h-8" />
        </div>
      </div>

      {/* Filters */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 mb-6 ${mounted ? 'animate-scaleIn' : 'opacity-0'}`}
        style={{ animationDelay: '0.1s' }}
      >
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`group relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                activeFilter === filter.id
                  ? `bg-gradient-to-r ${filter.gradient} text-white shadow-lg`
                  : 'glassmorphism text-gray-300 hover:text-white border border-gray-700/50'
              }`}
            >
              <span className="flex items-center gap-2">
                {filter.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeFilter === filter.id 
                    ? 'bg-white/20' 
                    : 'bg-gray-700/50'
                }`}>
                  {filter.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
          <Filter className="w-4 h-4" />
          Tout afficher
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4 mb-6">
        {messages.map((msg, index) => {
          const StatusIcon = statusConfig[msg.status].icon;
          return (
            <div
              key={msg.id}
              className={`message-item glassmorphism rounded-2xl p-5 shadow-lg border-2 ${
                msg.priority === 'urgent' ? 'border-amber-500/30' : 
                msg.priority === 'high' ? 'border-red-500/30' : 
                'border-gray-700/30'
              } hover:shadow-xl transition-all duration-300 ${mounted ? 'animate-slideIn' : 'opacity-0'}`}
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left Section: Profile + Content */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${statusConfig[msg.status].gradient} flex items-center justify-center ring-2 ring-offset-2 ring-offset-gray-900 ${
                      msg.status === 'VIP' ? 'ring-red-500/50' : 
                      msg.status === 'Urgent' ? 'ring-amber-500/50' : 
                      'ring-gray-600/50'
                    }`}>
                      <User className="text-white w-6 h-6" />
                    </div>
                    {msg.unread && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse-dot"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-white text-sm truncate">{msg.user}</p>
                      {msg.status === 'VIP' && (
                        <Star className="w-4 h-4 text-red-400 fill-red-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-2 truncate">{msg.content}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{msg.time}</span>
                    </div>
                  </div>
                </div>

                {/* Right Section: Status + Actions */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusConfig[msg.status].bg} ${statusConfig[msg.status].text} ${statusConfig[msg.status].border}`}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {msg.status}
                  </span>

                  <button
                    className={`group px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2 ${
                      msg.content === 'Brouillon'
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30'
                    }`}
                  >
                    {msg.content === 'Brouillon' ? (
                      <>
                        <Edit className="w-3.5 h-3.5" />
                        Éditer
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        Répondre
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <div
        className={`glassmorphism rounded-2xl p-6 shadow-xl border-2 border-purple-500/30 ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}
        style={{ animationDelay: '0.5s' }}
      >
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Messages Totaux', value: messages.length.toString(), gradient: 'from-blue-400 to-cyan-400' },
            { label: 'Messages Urgent/VIP', value: messages.filter(m => m.status === 'VIP' || m.status === 'Urgent').length.toString(), gradient: 'from-purple-400 to-pink-400' },
            { label: 'Taux de Lecture', value: `${Math.round((messages.filter(m => !m.unread).length / Math.max(1, messages.length)) * 100)}%`, gradient: 'from-emerald-400 to-teal-400' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{stat.label}</p>
              <p className={`text-lg font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <button className="group flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-3 rounded-xl font-semibold w-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30">
          Voir toute la messagerie unifiée
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

export default UrgentMessaging;