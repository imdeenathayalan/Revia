// src/context/SearchContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useFinance } from './FinanceContext';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [savedSearches, setSavedSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const { transactions } = useFinance();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSearchData();
  }, []);

  const loadSearchData = () => {
    try {
      const saved = localStorage.getItem('savedSearches');
      const recent = localStorage.getItem('recentSearches');
      const history = localStorage.getItem('searchHistory');
      
      if (saved) setSavedSearches(JSON.parse(saved));
      if (recent) setRecentSearches(JSON.parse(recent));
      if (history) setSearchHistory(JSON.parse(history));
    } catch (error) {
      console.error('Error loading search data:', error);
      localStorage.removeItem('savedSearches');
      localStorage.removeItem('recentSearches');
      localStorage.removeItem('searchHistory');
    }
    setIsLoading(false);
  };

  const saveSearchData = () => {
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  };

  const searchTransactions = (filters) => {
    let results = [...transactions];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(transaction =>
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(query))
      );
    }

    // Amount range
    if (filters.minAmount !== undefined) {
      results = results.filter(t => Math.abs(t.amount) >= filters.minAmount);
    }
    if (filters.maxAmount !== undefined) {
      results = results.filter(t => Math.abs(t.amount) <= filters.maxAmount);
    }

    // Date range
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      results = results.filter(t => new Date(t.date) >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      results = results.filter(t => new Date(t.date) <= end);
    }

    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(t => filters.categories.includes(t.category));
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      results = results.filter(t => 
        filters.type === 'income' ? t.amount > 0 : t.amount < 0
      );
    }

    // Add to search history
    if (filters.query || Object.keys(filters).length > 1) {
      addToSearchHistory(filters);
    }

    return results.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const addToSearchHistory = (filters) => {
    const searchEntry = {
      id: Date.now(),
      filters: { ...filters },
      timestamp: new Date().toISOString(),
      resultCount: searchTransactions(filters).length
    };

    const updatedHistory = [searchEntry, ...searchHistory].slice(0, 50); // Keep last 50
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const saveSearch = (searchData) => {
    const savedSearch = {
      id: Date.now(),
      name: searchData.name,
      filters: searchData.filters,
      createdAt: new Date().toISOString(),
      isPinned: false
    };

    const updatedSearches = [...savedSearches, savedSearch];
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
    return savedSearch;
  };

  const deleteSavedSearch = (id) => {
    const updatedSearches = savedSearches.filter(search => search.id !== id);
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
  };

  const pinSearch = (id) => {
    const updatedSearches = savedSearches.map(search =>
      search.id === id ? { ...search, isPinned: !search.isPinned } : search
    );
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
  };

  const getSearchSuggestions = (query) => {
    if (!query) return [];
    
    const lowerQuery = query.toLowerCase();
    const suggestions = new Set();

    // Suggest categories
    transactions.forEach(t => {
      if (t.category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(t.category);
      }
    });

    // Suggest descriptions
    transactions.forEach(t => {
      if (t.description.toLowerCase().includes(lowerQuery)) {
        suggestions.add(t.description);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  };

  const value = {
    savedSearches,
    recentSearches,
    searchHistory,
    isLoading,
    searchTransactions,
    saveSearch,
    deleteSavedSearch,
    pinSearch,
    getSearchSuggestions,
    refreshSearchData: loadSearchData
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;