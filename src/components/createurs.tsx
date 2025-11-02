import React, { useState, useEffect } from 'react';
import { fansApi, contenuApi, imagesApi } from '../api/client';
import { ChevronDown } from 'lucide-react';
import AddContenuModal from './contenu/AddContenuModal';
import AddImageModal from './images/AddImageModal';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --------------------------------------------------
// A. Composant Carte de Métrique (MetricCard)
// --------------------------------------------------
interface MetricCardProps {
  title: string;
  amount: string;
  subtitle: string;
  type?: 'revenue' | 'permanent';
  iconUrl?: string;
  delay?: string;
  gradient?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  amount, 
  subtitle, 
  type = 'revenue', 
  iconUrl = 'https://i.pravatar.cc/30?img=1',
  delay = '0s',
  gradient = 'from-blue-500 to-purple-600'
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div 
      className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 ${mounted ? 'animate-scaleIn' : 'opacity-0'}`}
      style={{ animationDelay: delay }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl"></div>
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient}`}></div>
      
      <div className="relative p-4 border border-gray-700/50">
        <div className="mb-2">
          {type === 'revenue' && (
            <div className="flex items-center mb-2">
              <img 
                src={iconUrl} 
                alt="avatar" 
                className={`w-6 h-6 rounded-full mr-2 ring-2 ring-${gradient.split(' ')[0].replace('from-', '')}`}
              />
              <p className="font-semibold text-xs text-gray-200 uppercase tracking-wide">{title}</p>
            </div>
          )}
          {type === 'permanent' && (
            <p className="font-semibold text-xs text-gray-200 uppercase tracking-wide mb-2">{title}</p>
          )}
        </div>
        <div className="flex flex-col">
          <h3 className={`text-xl font-bold bg-gradient-to-br ${gradient} bg-clip-text text-transparent`}>
            {amount}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------
// B. Composant Panneau de Droite (RightPanel)
// --------------------------------------------------
const PermissionItem: React.FC<{ text: string; active?: boolean }> = ({ text, active = false }) => (
  <div className={`py-2 px-3 text-sm cursor-pointer transition-colors duration-200
                  ${active 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg font-semibold' 
                    : 'text-gray-300 hover:bg-emerald-500/10 rounded-lg'}`}>
    {text}
  </div>
);

const RightPanel: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`w-full lg:w-80 glassmorphism border-t lg:border-t-0 lg:border-l border-cyan-500/20 p-6 flex flex-col space-y-6 ${mounted ? 'animate-fadeInRight' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
      
      {/* Role & Permission Section */}
      <div>
        <div className="flex justify-between items-center mb-4 cursor-pointer">
          <h2 className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Role & permission
          </h2>
          <ChevronDown className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="glassmorphism p-3 rounded-xl mb-4 border border-emerald-500/30">
          <div className="flex items-center">
            <img 
              src="https://i.pravatar.cc/30?img=5" 
              alt="avatar" 
              className="w-8 h-8 rounded-full mr-3 ring-2 ring-emerald-500" 
            />
            <span className="font-bold text-base text-white">Tips</span>
          </div>
        </div>

        <div className="space-y-1">
          <PermissionItem text="Manage users" active={true} />
          <PermissionItem text="Media" />
          <PermissionItem text="View" />
          <PermissionItem text="Analytics" />
          <PermissionItem text="Media" />
          <PermissionItem text="View" />
          <PermissionItem text="Analytics" />
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>

      {/* Users Directory Section */}
      <div>
        <h2 className="font-bold text-lg mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Users directory
        </h2>
        <div className="space-y-1 mb-6">
          <PermissionItem text="Manage users" />
          <PermissionItem text="Media" />
          <PermissionItem text="View" />
          <PermissionItem text="Analytics" />
        </div>
        <div className="flex justify-between space-x-3">
          <button className="flex-1 py-2 rounded-lg border-2 border-cyan-500/30 text-sm hover:bg-cyan-500/10 transition-colors duration-200 font-semibold glassmorphism">
            Change role
          </button>
          <button className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-sm hover:opacity-90 font-bold transition-opacity duration-200">
            Change role
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------------------
// C. Composant Principal (Createurs)
// --------------------------------------------------
const Createurs: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  

  const [fans, setFans] = useState<any[]>([]);
  const [contenus, setContenus] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openAddContenu, setOpenAddContenu] = useState(false);
  const [openAddImage, setOpenAddImage] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const [f, c, i] = await Promise.all([fansApi.list(), contenuApi.list(), imagesApi.list()]);
      setFans((f && f.data) || f || []);
      setContenus((c && c.data) || c || []);
      setImages((i && i.data) || i || []);
    } catch (err) {
      console.error('load createurs data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const revenueCards: Array<{ title: string; amount: string; subtitle: string; delay: string; gradient: string }> = (contenus.length ? contenus.slice(0,3).map((c: any, i: number) => ({ title: c.titre || `Contenu ${i+1}`, amount: `${c.prix || 0} $`, subtitle: 'Contenu', delay: `0.${i+1}s`, gradient: ['from-blue-500 to-cyan-500','from-purple-500 to-pink-500','from-emerald-500 to-teal-500'][i] })) : [
    { title: "Abonnements", amount: "1478.98 $", subtitle: "Medias Privés", delay: "0.1s", gradient: "from-blue-500 to-cyan-500" },
    { title: "Medias push", amount: "1478.98 $", subtitle: "Lives", delay: "0.2s", gradient: "from-purple-500 to-pink-500" },
    { title: "Tips", amount: "1478.98 $", subtitle: "Affiliés", delay: "0.3s", gradient: "from-emerald-500 to-teal-500" },
  ]);

  const permanentCards: Array<{ title: string; amount: string; subtitle: string; delay: string; gradient: string }> = (fans.length ? fans.slice(0,4).map((f: any, i: number) => ({ title: f.nom || `Fan ${i+1}`, amount: `${f.totalDepense || 0}`, subtitle: f.statut || 'Fan', delay: `0.${i+4}s`, gradient: ['from-orange-500 to-red-500','from-violet-500 to-purple-600','from-indigo-500 to-blue-600','from-rose-500 to-pink-600'][i] })) : [
    { title: "Employe permanent", amount: "1,300", subtitle: "Medias Privés", delay: "0.4s", gradient: "from-orange-500 to-red-500" },
    { title: "Employe permanent", amount: "1,300", subtitle: "Medias Privés", delay: "0.5s", gradient: "from-violet-500 to-purple-600" },
    { title: "Employe permanent", amount: "1,300", subtitle: "Medias Privés", delay: "0.6s", gradient: "from-indigo-500 to-blue-600" },
    { title: "Employe permanent", amount: "1,300", subtitle: "Medias Privés", delay: "0.7s", gradient: "from-rose-500 to-pink-600" },
  ]);

  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-screen bg-gray-900 text-white">
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

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
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

        .animate-fadeInDown {
          animation: fadeInDown 0.6s ease-out both;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.6s ease-out both;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out both;
        }

        .glassmorphism {
          background: rgba(31, 41, 55, 0.4);
          backdrop-filter: blur(12px);
        }
      `}</style>
      
      {/* Contenu principal: Détails des revenus et Graphique */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div className={`mb-6 ${mounted ? 'animate-fadeInDown' : 'opacity-0'}`}>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Détail de revenus
          </h1>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-full"></div>
          <div className="mt-3 flex gap-3">
            <button onClick={reload} className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm">Refresh</button>
            <button onClick={() => setOpenAddContenu(true)} className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">Ajouter contenu</button>
            <div className="ml-auto flex items-center gap-3">
              {loading && <div className="text-sm text-gray-300">Chargement...</div>}
              <button onClick={() => setOpenAddImage(true)} className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-sm">Ajouter image</button>
              <div className="text-sm text-gray-400">Images: <span className="text-white font-semibold">{images.length}</span></div>
            </div>
          </div>
        </div>

        <AddContenuModal open={openAddContenu} setOpen={setOpenAddContenu} onCreated={async () => { await reload(); }} />
        <AddImageModal open={openAddImage} setOpen={setOpenAddImage} onCreated={async () => { await reload(); }} />

        {/* Top Revenue Cards (Abonnements, Medias push, Tips) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {revenueCards.map((card, index) => (
            <MetricCard 
              key={index}
              title={card.title} 
              amount={card.amount} 
              subtitle={card.subtitle} 
              delay={card.delay}
              gradient={card.gradient}
            />
          ))}
        </div>

        {/* Employee Cards (Employés permanents) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {permanentCards.map((card, index) => (
            <MetricCard 
              key={index}
              title={card.title} 
              amount={card.amount} 
              subtitle={card.subtitle} 
              type="permanent"
              delay={card.delay}
              gradient={card.gradient}
            />
          ))}
        </div>

        {/* Revenue Graph Section */}
        <div 
          className={`relative overflow-hidden rounded-xl shadow-lg ${mounted ? 'animate-fadeInUp' : 'opacity-0'}`}
          style={{ animationDelay: '0.8s' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl"></div>
          
          <div className="relative p-4 border border-indigo-500/20">
            <p className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Revenus mensuels
            </p>
            
            <div className="h-64 sm:h-80 glassmorphism rounded-lg border border-indigo-500/30 p-4 overflow-hidden">
              <div className="flex flex-col sm:flex-row gap-4 h-full">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Revenus (résumé)</p>
                    <h3 className="text-2xl font-bold text-white">{contenus.reduce((s, c: any) => s + (Number(c.prix) || 0), 0)} $</h3>
                    <p className="text-xs text-gray-500">Basé sur les contenus listés</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="p-3 bg-gray-800/40 rounded-lg">
                      <p className="text-xs text-gray-400">Total contenus</p>
                      <p className="text-sm font-semibold text-white">{contenus.length}</p>
                    </div>
                    <div className="p-3 bg-gray-800/40 rounded-lg">
                      <p className="text-xs text-gray-400">Fans</p>
                      <p className="text-sm font-semibold text-white">{fans.length}</p>
                    </div>
                    <div className="p-3 bg-gray-800/40 rounded-lg">
                      <p className="text-xs text-gray-400">Images</p>
                      <p className="text-sm font-semibold text-white">{images.length}</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center">
                    {contenus.length === 0 ? (
                      <div className="text-center text-gray-500">Aucun contenu à afficher</div>
                    ) : (
                      <div className="w-full max-w-xl h-36">
                        <ResponsiveContainer width="100%" height={140}>
                          <BarChart data={contenus.slice(0, 10).map((c: any, i: number) => ({ name: c.titre || `C${i+1}`, prix: Number(c.prix) || 0 }))}>
                            <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
                            <YAxis tick={{ fill: '#94a3b8' }} />
                            <Tooltip wrapperStyle={{ background: '#0f172a', borderRadius: 6 }} />
                            <Bar dataKey="prix" fill="#6EE7B7" />
                          </BarChart>
                        </ResponsiveContainer>
                        <p className="text-xs text-gray-400 text-right">Prix des contenus (échantillon)</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Panneau de Droite (Role & permission) */}
      <RightPanel />
    </div>
  );
};

export default Createurs;