// src/context/RecurringContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const RecurringContext = createContext();

export const useRecurring = () => {
  const context = useContext(RecurringContext);
  if (!context) {
    throw new Error('useRecurring must be used within a RecurringProvider');
  }
  return context;
};

export const RecurringProvider = ({ children }) => {
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRecurringTransactions();
  }, []);

  const loadRecurringTransactions = () => {
    const saved = localStorage.getItem('recurringTransactions');
    if (saved) {
      setRecurringTransactions(JSON.parse(saved));
    }
    setIsLoading(false);
  };

  const saveToStorage = (transactions) => {
    localStorage.setItem('recurringTransactions', JSON.stringify(transactions));
  };

  const addRecurringTransaction = (transaction) => {
    const newTransaction = {
      id: Date.now(),
      ...transaction,
      createdAt: new Date().toISOString(),
      nextDate: calculateNextDate(transaction.startDate, transaction.frequency),
      isActive: true
    };
    const updated = [...recurringTransactions, newTransaction];
    setRecurringTransactions(updated);
    saveToStorage(updated);
  };

  const updateRecurringTransaction = (id, updates) => {
    const updated = recurringTransactions.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    setRecurringTransactions(updated);
    saveToStorage(updated);
  };

  const deleteRecurringTransaction = (id) => {
    const updated = recurringTransactions.filter(t => t.id !== id);
    setRecurringTransactions(updated);
    saveToStorage(updated);
  };

  const calculateNextDate = (startDate, frequency) => {
    const date = new Date(startDate);
    switch (frequency) {
      case 'daily': date.setDate(date.getDate() + 1); break;
      case 'weekly': date.setDate(date.getDate() + 7); break;
      case 'monthly': date.setMonth(date.getMonth() + 1); break;
      case 'yearly': date.setFullYear(date.getFullYear() + 1); break;
      default: return startDate;
    }
    return date.toISOString();
  };

  const value = {
    recurringTransactions,
    isLoading,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    refresh: loadRecurringTransactions
  };

  return (
    <RecurringContext.Provider value={value}>
      {children}
    </RecurringContext.Provider>
  );
};

export default RecurringContext;