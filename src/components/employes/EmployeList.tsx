import React from "react";
import { usePagination } from "../../hooks/usePagination";
import { useFilteredData } from "../../hooks/useFilteredData";
import { SearchInput } from "../ui/SearchInput";

interface Employe {
  id: number;
  nom: string;
  poste: string;
  email: string;
  statut: string;
}

interface Props {
  employes: Employe[];
  setEmployes: React.Dispatch<React.SetStateAction<Employe[]>>;
}

const EmployeList: React.FC<Props> = ({ employes, setEmployes }) => {
  const supprimerEmploye = (id: number) => {
    setEmployes(employes.filter((emp) => emp.id !== id));
  };

  const { filteredData, searchQuery, setSearchQuery } = useFilteredData({
    data: employes,
    searchConfig: {
      keys: ['nom', 'poste', 'email'],
      caseSensitive: false
    }
  });

  const {
    currentItems
  } = usePagination({
    items: filteredData,
    itemsPerPage: 10
  });

  // Générer les suggestions de recherche uniques
  const suggestions = [...new Set(
    employes.flatMap(emp => [emp.nom, emp.poste, emp.email])
  )].filter(suggestion => 
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="bg-gray-900 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-lg">
      <div className="mb-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          suggestions={suggestions}
          placeholder="Rechercher un employé..."
          className="max-w-md"
        />
      </div>

      <table className="w-full text-left text-sm text-slate-300">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700/50">
            <th className="py-3 px-4">Nom</th>
            <th className="py-3 px-4">Poste</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Statut</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((emp) => (
            <tr
              key={emp.id}
              className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-3 px-4">{emp.nom}</td>
              <td className="py-3 px-4">{emp.poste}</td>
              <td className="py-3 px-4">{emp.email}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    emp.statut === "Actif"
                      ? " text-green-400 "
                      : " text-red-400 "
                  }`}
                >
                  {emp.statut}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => supprimerEmploye(emp.id)}
                  className="px-3 py-1 text-sm rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all duration-200"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {employes.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-5 text-slate-500">
                Aucun employé enregistré.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeList;
