import { Home, Users, Mail, ChevronDown, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type SubMenuItem = {
  title: string;
  path?: string;
};

type MenuItem = {
  title: string;
  icon: React.ReactNode;
  path?: string;
  subMenu?: (string | SubMenuItem)[];
};

const Sidebar: React.FC = () => {
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menus: MenuItem[] = [
    { title: "Dashboard", icon: <Home size={20} />, path: "/dashboard" },
    { title: "Créateurs", icon: <Users size={20} />, path: "/createurs" },
    {
      title: "Employés",
      icon: <Users size={20} />,
      subMenu: [
        { title: "Liste employés", path: "/employe" },
        //{ title: "Ajouter employé", path: "/employes/ajouter" },
        { title: "Statistiques", path: "/analyse" },
         { title: "Manager", path: "/manager" },
      ],
    },
    {
      title: "Messagerie",
      icon: <Mail size={20} />,
      subMenu: [
        { title: "Messages", path: "/MessagePage" },
        "Messages envoyés",
        "Paramètres mail",
      ],
    },
  ];

  const toggleSubMenu = (menu: MenuItem, subItem?: string | SubMenuItem) => {
    if (subItem && typeof subItem === "object" && subItem.path) {
      navigate(subItem.path);
      setSidebarOpen(false);
      return;
    }
    if (menu.path) {
      navigate(menu.path);
      setSidebarOpen(false);
    } else if (menu.subMenu) {
      setOpenSubMenu(openSubMenu === menu.title ? null : menu.title);
    }
  };

  return (
    <div className="flex">
      {/* Header mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg border-b border-slate-700/50 flex items-center justify-between px-6 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SIMPLY
          </h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <Menu size={24} className="text-slate-200" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-72 z-50
          bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
          border-r border-slate-700/50 shadow-2xl
          lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base">S</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
                SIMPLY
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={18} className="text-slate-400" />
            </button>
          </div>
        </div>


        {/* Menu */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
          {menus.map((menu, idx) => (
            <div key={idx}>
              <div
                className={`
                  group flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                  cursor-pointer transition-all duration-200
                  hover:bg-gradient-to-r hover:from-slate-800/80 hover:to-slate-800/40
                  hover:shadow-lg hover:scale-[1.02]
                  ${openSubMenu === menu.title ? 'bg-gradient-to-r from-slate-800/60 to-slate-800/30' : ''}
                `}
                onClick={() => toggleSubMenu(menu)}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg transition-all duration-200
                    ${openSubMenu === menu.title
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400'
                      : 'bg-slate-800/50 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-slate-200'
                    }
                  `}>
                    {menu.icon}
                  </div>
                  <span className={`
                    font-medium transition-colors duration-200
                    ${openSubMenu === menu.title ? 'text-slate-100' : 'text-slate-300 group-hover:text-slate-100'}
                  `}>
                    {menu.title}
                  </span>
                </div>
                {menu.subMenu && (
                  <ChevronDown
                    size={18}
                    className={`
                      transition-all duration-300
                      ${openSubMenu === menu.title
                        ? 'rotate-180 text-blue-400'
                        : 'text-slate-500 group-hover:text-slate-300'
                      }
                    `}
                  />
                )}
              </div>

              {menu.subMenu && openSubMenu === menu.title && (
                <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-300">
                  {menu.subMenu.map((subItem, subIdx) => (
                    <div
                      key={subIdx}
                      className="
                        group/sub flex items-center gap-3 px-4 py-2.5 rounded-lg
                        cursor-pointer transition-all duration-200
                        hover:bg-slate-800/60 hover:translate-x-1
                        border-l-2 border-slate-700 hover:border-blue-500/50
                      "
                      onClick={() => toggleSubMenu(menu, subItem)}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover/sub:bg-blue-400 transition-colors" />
                      <span className="text-sm text-slate-400 group-hover/sub:text-slate-200 transition-colors">
                        {typeof subItem === "string" ? subItem : subItem.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

      </div>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;