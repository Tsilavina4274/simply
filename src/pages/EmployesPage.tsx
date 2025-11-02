import { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Download, Edit, Trash2, MoreVertical, Mail, Phone, MapPin, Calendar, TrendingUp, Award } from 'lucide-react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import AddEmployeModal from '../components/employes/AddEmployeModal';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'vacation';
  avatar: string;
  joinDate: string;
  performance: number;
  _rawId?: string;
}

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Sarah Martinez",
    email: "sarah.m@company.com",
    phone: "+33 6 12 34 56 78",
    role: "Manager",
    department: "Marketing",
    status: "active",
    avatar: "SM",
    joinDate: "2023-01-15",
    performance: 95
  },
  {
    id: 2,
    name: "Thomas Dubois",
    email: "thomas.d@company.com",
    phone: "+33 6 23 45 67 89",
    role: "Developer",
    department: "Tech",
    status: "active",
    avatar: "TD",
    joinDate: "2023-03-20",
    performance: 88
  },
  {
    id: 3,
    name: "Julie Chen",
    email: "julie.c@company.com",
    phone: "+33 6 34 56 78 90",
    role: "Designer",
    department: "Creative",
    status: "vacation",
    avatar: "JC",
    joinDate: "2023-05-10",
    performance: 92
  },
  {
    id: 4,
    name: "Marc Laurent",
    email: "marc.l@company.com",
    phone: "+33 6 45 67 89 01",
    role: "Sales",
    department: "Commercial",
    status: "inactive",
    avatar: "ML",
    joinDate: "2022-11-05",
    performance: 76
  }
];

const EmployeeManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<{ id?: string; name?: string; job?: string; email?: string; role?: string; phone?: string; department?: string; status?: string; avatar?: string; joinDate?: string; performance?: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // fetch real users from backend
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await (await import('../api/client')).usersApi.list();
        // res expected { data: [...] }
        const data = res.data || res;
        const mapped: Employee[] = data.map((u: any, idx: number) => ({
          id: idx + 1,
          name: u.name || u.email,
          email: u.email,
          phone: u.phone || '',
          role: u.job || u.role || 'Employé',
          department: u.city || '—',
          status: u.role === 'admin' ? 'active' : 'active',
          avatar: (u.name || 'U').split(' ').map((s: string) => s[0]).slice(0,2).join('').toUpperCase(),
          joinDate: u.createdAt || new Date().toISOString(),
          performance: Math.floor(Math.random() * 30) + 70,
          _rawId: u.id
        }));
        setEmployees(mapped);
      } catch (err: any) {
        setError(err?.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusConfig = {
    active: {
      label: 'Actif',
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      gradient: 'from-emerald-500 to-teal-500'
    },
    inactive: {
      label: 'Inactif',
      bg: 'bg-gray-600/20',
      text: 'text-gray-400',
      border: 'border-gray-600/40',
      gradient: 'from-gray-500 to-gray-600'
    },
    vacation: {
      label: 'En Congé',
      bg: 'bg-amber-500/20',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
      gradient: 'from-amber-500 to-orange-500'
    }
  };

  const activeCount = employees.filter(e => e.status === 'active').length;
  const avgPerformance = Math.round(employees.reduce((sum, e) => sum + e.performance, 0) / employees.length);

  return (

    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-0">
        <Navbar />

        <div className="flex-1 overflow-auto bg-gray-900">
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

        .employee-card:hover {
          transform: translateX(4px);
        }
      `}</style>

            {/* Header */}
            <div
              className={`mb-6 p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-500/20 backdrop-blur-xl border border-blue-500/30 ${mounted ? 'animate-fadeInDown' : 'opacity-0'}`}
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                    Gestion des Employés
                  </h2>
                  <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:scale-105"
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  Ajouter un employé
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {[
                {
                  icon: Users,
                  label: 'Total Employés',
                  value: employees.length,
                  gradient: 'from-blue-500 to-cyan-500',
                  delay: '0.1s'
                },
                {
                  icon: TrendingUp,
                  label: 'Employés Actifs',
                  value: activeCount,
                  gradient: 'from-emerald-500 to-teal-500',
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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 text-gray-200 placeholder-gray-500 border border-gray-700/50 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>

              <button className="flex items-center gap-2 glassmorphism px-4 py-3 rounded-xl text-sm border border-gray-700/50 hover:border-purple-500/30 transition-all whitespace-nowrap">
                <Filter className="text-purple-400 w-5 h-5" />
                <span className="font-medium text-gray-300">Filtres</span>
              </button>

              <button className="flex items-center gap-2 glassmorphism px-4 py-3 rounded-xl text-sm border border-gray-700/50 hover:border-purple-500/30 transition-all whitespace-nowrap">
                <Download className="text-purple-400 w-5 h-5" />
                <span className="font-medium text-gray-300">Exporter</span>
              </button>
            </div>

            {/* Employee Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {filteredEmployees.map((employee, index) => {
                // show real id if present
                const status = statusConfig[employee.status];
                return (
                  <div
                    key={employee.id}
                    className={`employee-card glassmorphism rounded-2xl p-6 shadow-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 ${mounted ? 'animate-slideIn' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${status.gradient} flex items-center justify-center text-white font-bold text-lg ring-2 ring-offset-2 ring-offset-gray-900 ${employee.status === 'active' ? 'ring-emerald-500/50' :
                            employee.status === 'vacation' ? 'ring-amber-500/50' :
                              'ring-gray-600/50'
                          }`}>
                          {employee.avatar}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{employee.name}</h3>
                          <p className="text-sm text-gray-400">{employee.role}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.bg} ${status.text} ${status.border}`}>
                          {status.label}
                        </span>
                        <button className="p-2 glassmorphism rounded-lg hover:bg-gray-700/50 transition-all">
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-4 h-4 text-blue-400" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span>{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span>Depuis le {new Date(employee.joinDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Performance</span>
                        <span className="text-xs font-semibold text-gray-400">{employee.performance}%</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${employee.performance >= 90 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                              employee.performance >= 80 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                employee.performance >= 70 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                  'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}
                          style={{ width: `${employee.performance}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                          <button onClick={() => {
                            // open modal in edit mode
                            setEditing({ id: (employee as any)._rawId, name: employee.name, job: employee.role, email: employee.email, role: 'user', phone: employee.phone, department: employee.department, status: employee.status, avatar: employee.avatar, joinDate: employee.joinDate, performance: employee.performance });
                            setIsModalOpen(true);
                          }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/30 hover:scale-105">
                            <Edit className="w-4 h-4" />
                            Modifier
                          </button>
                      <button onClick={async () => {
                        // delete employee by raw id
                        try {
                          const client = await import('../api/client');
                          const rawId = (employee as any)._rawId;
                          if (!rawId) return;
                          await client.usersApi.delete(rawId);
                          setEmployees((prev) => prev.filter(e => (e as any)._rawId !== rawId));
                        } catch (err) {
                          console.error('delete error', err);
                        }
                      }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl glassmorphism border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-all">
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {loading && <div className="text-center text-gray-400 mt-4">Chargement...</div>}
            {error && <div className="text-center text-red-400 mt-4">{error}</div>}

            {/* Pagination */}
            <div
              className={`glassmorphism rounded-xl p-4 border border-gray-700/50 flex items-center justify-between ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}
              style={{ animationDelay: '0.8s' }}
            >
              <p className="text-sm text-gray-400">
                Affichage de <span className="text-white font-semibold">{filteredEmployees.length}</span> sur <span className="text-white font-semibold">{employees.length}</span> employés
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

            {/* Modal Placeholder */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="glassmorphism rounded-2xl p-6 max-w-md w-full border-2 border-purple-500/30 animate-scaleIn">
                  <h3 className="text-xl font-bold text-white mb-4">{editing ? 'Modifier un employé' : 'Ajouter un employé'}</h3>
                  <AddEmployeModal setIsModalOpen={(open) => { setIsModalOpen(open); if (!open) setEditing(null); }} initial={editing ?? undefined} onCreated={async () => {
                    // refresh list
                    const res = await (await import('../api/client')).usersApi.list();
                    const data = res.data || res;
                    const mapped: Employee[] = data.map((u: any, idx: number) => ({
                      id: idx + 1,
                      name: u.name || u.email,
                      email: u.email,
                      phone: u.phone || '',
                      role: u.job || u.role || 'Employé',
                      department: u.city || '—',
                      status: 'active',
                      avatar: (u.name || 'U').split(' ').map((s: string) => s[0]).slice(0,2).join('').toUpperCase(),
                      joinDate: u.createdAt || new Date().toISOString(),
                      performance: Math.floor(Math.random() * 30) + 70,
                      _rawId: u.id
                    }));
                    setEmployees(mapped);
                  }} onUpdated={(updated) => {
                    // update local state with updated user
                    const u = updated.data || updated;
                    setEmployees((prev) => prev.map((p) => ((p as any)._rawId === u.id ? { ...p, name: u.name || p.name, email: u.email || p.email, role: u.job || u.role } : p)));
                    setEditing(null);
                  }} />
                  
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>

  );
};

export default EmployeeManagement;