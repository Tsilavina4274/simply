import { useState, useMemo } from 'react';

type FilterFunction<T> = (item: T) => boolean;
type SortFunction<T> = (a: T, b: T) => number;
type SearchConfig<T> = {
  keys: (keyof T)[];
  caseSensitive?: boolean;
};

interface UseFilteredDataProps<T> {
  data: T[];
  filterFn?: FilterFunction<T>;
  sortFn?: SortFunction<T>;
  searchConfig?: SearchConfig<T>;
  initialSearchQuery?: string;
}

interface UseFilteredDataReturn<T> {
  filteredData: T[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setSortFunction: (fn: SortFunction<T> | undefined) => void;
  setFilterFunction: (fn: FilterFunction<T> | undefined) => void;
}

export function useFilteredData<T>({
  data,
  filterFn,
  sortFn,
  searchConfig,
  initialSearchQuery = '',
}: UseFilteredDataProps<T>): UseFilteredDataReturn<T> {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [currentSortFn, setCurrentSortFn] = useState<SortFunction<T> | undefined>(sortFn);
  const [currentFilterFn, setCurrentFilterFn] = useState<FilterFunction<T> | undefined>(filterFn);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Appliquer la recherche si configurée
    if (searchConfig && searchQuery) {
      const searchRegex = new RegExp(searchQuery, searchConfig.caseSensitive ? '' : 'i');
      result = result.filter(item => {
        return searchConfig.keys.some(key => {
          const value = item[key];
          if (typeof value === 'string' || typeof value === 'number') {
            return searchRegex.test(String(value));
          }
          return false;
        });
      });
    }

    // Appliquer le filtre personnalisé
    if (currentFilterFn) {
      result = result.filter(currentFilterFn);
    }

    // Appliquer le tri
    if (currentSortFn) {
      result.sort(currentSortFn);
    }

    return result;
  }, [data, searchQuery, currentFilterFn, currentSortFn, searchConfig]);

  return {
    filteredData,
    searchQuery,
    setSearchQuery,
    setSortFunction: setCurrentSortFn,
    setFilterFunction: setCurrentFilterFn,
  };
}