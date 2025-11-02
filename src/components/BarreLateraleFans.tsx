import React from 'react';
import { ElementFan } from './ElementFan';
import type { Fan } from '../types/types';
import { useFilteredData } from '../hooks/useFilteredData';
import { usePagination } from '../hooks/usePagination';
import { SearchInput } from './ui/SearchInput';
import { Pagination } from './ui/Pagination';

interface BarreLateraleFansProps {
  fans: Fan[];
}

export const BarreLateraleFans: React.FC<BarreLateraleFansProps> = ({ fans }) => {
  const { filteredData, searchQuery, setSearchQuery } = useFilteredData({
    data: fans,
    searchConfig: {
      keys: ['nom', 'statut', 'derniereActivite'],
      caseSensitive: false
    }
  });

  const {
    currentItems: currentFans,
    currentPage,
    totalPages,
    setCurrentPage
  } = usePagination({
    items: filteredData,
    itemsPerPage: 15
  });

  // Générer les suggestions de recherche uniques
  const suggestions = [...new Set(
    fans.flatMap(fan => [fan.nom, fan.statut])
  )].filter(suggestion => 
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <aside className="bg-gray-900 h-full border-r border-gray-700 flex flex-col">
      {/* En-tête avec recherche */}
      <div className="p-4 border-b border-gray-700">
        <div className="mb-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            suggestions={suggestions}
            placeholder="Rechercher un fan..."
            className="w-full"
          />
        </div>
        <div className="text-center py-1">
          <span className="text-white font-semibold border-b-2 border-blue-500 text-sm sm:text-base">
            Tous ({filteredData.length})
          </span>
        </div>
      </div>

      {/* Liste des fans avec scroll */}
      <div className="flex-1 overflow-y-auto">
        {currentFans.map(fan => (
          <ElementFan key={fan.id} fan={fan} />
        ))}
        
        {filteredData.length === 0 && searchQuery && (
          <div className="text-center text-gray-400 py-4 text-sm sm:text-base">
            Aucun fan trouvé
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </aside>
  );
};