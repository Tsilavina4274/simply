import { useState, useEffect } from 'react';
import { Calendar, Search, TrendingUp, TrendingDown, BarChart3, Download, DollarSign, Clock, Award, ChevronDown } from 'lucide-react';
import { usersApi } from '../api/client';

interface DataItem {
  id: string;
  name: string;
  manager: string;
  total: string;
  mediaPush: string;
  mediaPrive: string;
  tips: string;
  heures: string;
  trend: 'up' | 'down' | 'stable';
  performance: number;
}

const Analyse = () => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DataItem[]>([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange] = useState("1er Sep - 30 Sep 2024");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    usersApi.list()
      .then((res: any) => {
        const users = Array.isArray(res?.data) ? res.data : [];
        if (!mounted) return;
        const mapped: DataItem[] = users.map((u: any) => {
          const perf = typeof u.performance === 'number' ? u.performance : (u.performance ? parseInt(u.performance as any) : 0);
          const createdAt = u.createdAt ? new Date(u.createdAt) : new Date();
          const days = Math.max(1, Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)));
          const hours = days * 8;
          return {
            id: u.id,
            name: u.name || u.email || 'Utilisateur',
            manager: u.role || '—',
            total: `${((perf || 0) * 10).toFixed(2)} $`,
            mediaPush: `${((perf || 0) * 4).toFixed(2)}$`,
            mediaPrive: `${((perf || 0) * 2).toFixed(2)}$`,
            tips: `${((perf || 0) * 3).toFixed(2)}$`,
            heures: `${hours}h`,
            trend: perf >= 80 ? 'up' : perf >= 60 ? 'stable' : 'down',
            performance: perf || 0
          };
        });
        setData(mapped);
      })
      .catch((err: any) => {
        console.error(err);
        setError(err?.message || 'Erreur lors du chargement des utilisateurs');
      })
      .finally(() => setLoading(false));

    return () => { mounted = false; };
  }, []);

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = data.reduce((sum, item) => sum + parseFloat(item.total.replace(/[$ ]/g, '')), 0);
  const totalHours = data.reduce((sum, item) => {
    const [hours] = item.heures.split('h');
    return sum + parseInt(hours);
  }, 0);
  const avgPerformance = Math.round(data.reduce((sum, item) => sum + item.performance, 0) / data.length);

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
          transform: translateX(2px);
        }
      `}</style>

      {/* Header */}
      <div
        className={`mb-6 p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 backdrop-blur-xl border border-blue-500/30 ${mounted ? 'animate-fadeInDown' : 'opacity-0'}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
              Analyse des Employés
            </h2>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
          </div>
          <BarChart3 className="text-purple-400 w-8 h-8" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { 
            icon: DollarSign, 
            label: 'Revenus Totaux', 
            value: `${totalRevenue.toFixed(2)} $`, 
            gradient: 'from-emerald-500 to-teal-500',
            delay: '0.1s'
          },
          { 
            icon: Clock, 
            label: 'Heures Totales', 
            value: `${totalHours}h`, 
            gradient: 'from-blue-500 to-cyan-500',
            delay: '0.2s'
          },
          { 
            icon: Award, 
            label: 'Performance Moy.', 
            value: `${avgPerformance}%`, 
            gradient: 'from-purple-500 to-pink-500',
            delay: '0.3s'
          }
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

      {/* Search and Filters */}
      <div
        className={`flex flex-col md:flex-row md:items-center gap-4 mb-6 ${mounted ? 'animate-scaleIn' : 'opacity-0'}`}
        style={{ animationDelay: '0.4s' }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par employé ou manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 text-gray-200 placeholder-gray-500 border border-gray-700/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>

        {/* Date Range */}
        <button className="flex items-center gap-2 glassmorphism px-4 py-3 rounded-xl text-sm border border-gray-700/50 hover:border-purple-500/30 transition-all whitespace-nowrap">
          <Calendar className="text-purple-400 w-5 h-5" />
          <span className="font-medium text-gray-300">{selectedDateRange}</span>
          <ChevronDown className="text-gray-400 w-4 h-4" />
        </button>

        {/* Export Button */}
        <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30 whitespace-nowrap">
          <Download className="w-5 h-5" />
          Exporter
        </button>
      </div>

      {/* Table */}
      <div
        className={`glassmorphism rounded-2xl shadow-xl border-2 border-purple-500/30 overflow-hidden ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}
        style={{ animationDelay: '0.5s' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-purple-500/30 text-left text-gray-400 uppercase text-xs tracking-wide">
                <th className="px-6 py-4 font-semibold min-w-[180px]">Employé</th>
                <th className="px-6 py-4 font-semibold min-w-[120px]">Manager</th>
                <th className="px-6 py-4 font-semibold min-w-[100px] text-center">Total</th>
                <th className="px-6 py-4 font-semibold min-w-[120px] text-center">Media Push</th>
                <th className="px-6 py-4 font-semibold min-w-[120px] text-center">Media Privé</th>
                <th className="px-6 py-4 font-semibold min-w-[100px] text-center">Tips</th>
                <th className="px-6 py-4 font-semibold min-w-[140px] text-center">Heures</th>
                <th className="px-6 py-4 font-semibold min-w-[120px] text-center">Performance</th>
                <th className="px-6 py-4 font-semibold min-w-[100px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.id}
                  className={`border-b border-gray-800/50 table-row-hover transition-all duration-300 ${mounted ? 'animate-slideIn' : 'opacity-0'}`}
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  {/* Employee */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm ring-2 ring-blue-500/50 ring-offset-2 ring-offset-gray-900">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-100">{item.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {item.trend === 'up' ? (
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-red-400" />
                          )}
                          <span className={`text-xs ${item.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.trend === 'up' ? '+12%' : '-8%'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Manager */}
                  <td className="px-6 py-4 text-gray-400">{item.manager}</td>

                  {/* Total */}
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-blue-400">{item.total}</span>
                  </td>

                  {/* Media Push */}
                  <td className="px-6 py-4 text-center text-gray-300">{item.mediaPush}</td>

                  {/* Media Privé */}
                  <td className="px-6 py-4 text-center text-gray-300">{item.mediaPrive}</td>

                  {/* Tips */}
                  <td className="px-6 py-4 text-center">
                    <span className="text-emerald-400 font-semibold">{item.tips}</span>
                  </td>

                  {/* Heures */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-300">{item.heures}</span>
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            item.performance >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                            item.performance >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                            'bg-gradient-to-r from-amber-500 to-orange-500'
                          }`}
                          style={{ width: `${item.performance}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400 min-w-[35px]">{item.performance}%</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => console.log(`Voir le graphique pour ${item.name}`)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30 hover:scale-105"
                    >
                      Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t-2 border-purple-500/30 p-4 flex items-center justify-between text-sm">
          <p className="text-gray-400">
            Affichage de <span className="text-white font-semibold">{filteredData.length}</span> sur <span className="text-white font-semibold">{data.length}</span> employés
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg glassmorphism border border-gray-700/50 text-gray-300 hover:text-white hover:border-purple-500/30 transition-all">
              Précédent
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyse;