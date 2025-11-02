import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Settings, LogOut, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timezone, setTimezone] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Obtenir le timezone dynamiquement
  useEffect(() => {
    const offset = -new Date().getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';

    const formattedOffset = `UTC ${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    setTimezone(formattedOffset);
  }, []);

  // Fermer le dropdown si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-lg text-gray-200 h-16 flex items-center justify-between px-6 shadow-xl border-b border-slate-800/30">
      {/* Left section - Search or Title */}
      <div className="flex items-center gap-4">
        <label className="input">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" className="grow btn-xl" placeholder="Search" />
        </label>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Timezone */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-800/50">
          <Clock size={16} className="text-blue-400" />
          <span className="text-sm font-medium text-slate-300">{timezone}</span>
        </div>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer hover:bg-slate-800/60 transition-all duration-200 group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="relative">
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-9 h-9 rounded-full ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-200"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
            </div>

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-200">Admin name</p>
              <p className="text-xs text-slate-400">Administrateur</p>
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-400 transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-blue-400' : 'group-hover:text-slate-200'}`}
            />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-800/30 overflow-hidden z-10 animate-in slide-in-from-top-2 duration-200 ">
              {/* User info */}
              <div className="px-5 py-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-b border-slate-800/30">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src="https://i.pravatar.cc/48"
                    alt="avatar"
                    className="w-12 h-12 rounded-full ring-2 ring-blue-500/30"
                  />
                  <div>
                    <p className="font-semibold text-slate-100">Admin name</p>
                    <p className="text-sm text-slate-400">admin@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/60 rounded-lg border border-slate-800/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-slate-300">En ligne</span>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full px-5 py-2.5 hover:bg-slate-700/60 text-left flex items-center gap-3 group transition-all duration-200"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-blue-500/20 transition-colors">
                    <User
                      size={16}
                      className="text-slate-400 group-hover:text-blue-400 transition-colors"
                    />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
                    Profile
                  </span>
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="w-full px-5 py-2.5 hover:bg-slate-700/60 text-left flex items-center gap-3 group transition-all duration-200"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-purple-500/20 transition-colors">
                    <Settings
                      size={16}
                      className="text-slate-400 group-hover:text-purple-400 transition-colors"
                    />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
                    Account settings
                  </span>
                </button>
              </div>

              {/* Sign out */}
              <div className="border-t border-slate-800/30 p-2">
                <button 
                  onClick={() => navigate("/")}
                  className="w-full px-5 py-2.5 hover:bg-red-500/10 text-left flex items-center gap-3 group transition-all duration-200 rounded-lg"
                >
                  <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-red-500/20 transition-colors">
                    <LogOut size={16} className="text-slate-400 group-hover:text-red-400 transition-colors" />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-red-400 transition-colors font-medium">Sign out</span>

                </button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
