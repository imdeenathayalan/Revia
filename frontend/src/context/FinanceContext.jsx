// src/context/FinanceContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { getTransactions, saveTransactions, calculateTotals } from '../utils/storage';

const FinanceContext = createContext();

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ balance: 0, income: 0, expenses: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    setTotals(calculateTotals(transactions));
  }, [transactions]);

  const loadTransactions = () => {
    const loadedTransactions = getTransactions();
    setTransactions(loadedTransactions);
    setIsLoading(false);
  };

  const addTransaction = (newTransaction) => {
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const deleteTransaction = (id) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const updateTransaction = (id, updatedData) => {
    const updatedTransactions = transactions.map(t =>
      t.id === id ? { ...t, ...updatedData } : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const getTransactionsByDateRange = (startDate, endDate) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  const getTransactionsByCategory = (category) => {
    return transactions.filter(transaction => transaction.category === category);
  };

  const value = {
    transactions,
    totals,
    isLoading,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getTransactionsByDateRange,
    getTransactionsByCategory,
    refreshTransactions: loadTransactions
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export default FinanceContext;