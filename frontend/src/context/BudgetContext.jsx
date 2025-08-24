// src/context/BudgetContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const BudgetContext = createContext();

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};

export const BudgetProvider = ({ children }) => {
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = () => {
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
    setIsLoading(false);
  };

  const saveBudgetsToStorage = (updatedBudgets) => {
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
  };

  const createBudget = (budgetData) => {
    const newBudget = {
      id: Date.now(),
      ...budgetData,
      createdAt: new Date().toISOString(),
      spent: 0
    };
    const updatedBudgets = [...budgets, newBudget];
    setBudgets(updatedBudgets);
    saveBudgetsToStorage(updatedBudgets);
    return newBudget;
  };

  const updateBudget = (id, updatedData) => {
    const updatedBudgets = budgets.map(budget =>
      budget.id === id ? { ...budget, ...updatedData } : budget
    );
    setBudgets(updatedBudgets);
    saveBudgetsToStorage(updatedBudgets);
  };

  const deleteBudget = (id) => {
    const updatedBudgets = budgets.filter(budget => budget.id !== id);
    setBudgets(updatedBudgets);
    saveBudgetsToStorage(updatedBudgets);
  };

  const getBudgetByCategory = (category) => {
    return budgets.find(budget => budget.category === category);
  };

  const calculateBudgetProgress = (budget, currentSpending) => {
    const spent = currentSpending || budget.spent;
    const percentage = (spent / budget.amount) * 100;
    return {
      percentage: Math.min(percentage, 100),
      remaining: budget.amount - spent,
      isOverBudget: spent > budget.amount
    };
  };

  const value = {
    budgets,
    isLoading,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetByCategory,
    calculateBudgetProgress,
    refreshBudgets: loadBudgets
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};

export default BudgetContext;