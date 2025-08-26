// src/context/InvestmentContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const InvestmentContext = createContext();

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};

export const InvestmentProvider = ({ children }) => {
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = () => {
    try {
      const savedInvestments = localStorage.getItem('investments');
      if (savedInvestments) {
        setInvestments(JSON.parse(savedInvestments));
      }
    } catch (error) {
      console.error('Error loading investments:', error);
      localStorage.removeItem('investments');
      setInvestments([]);
    }
    setIsLoading(false);
  };

  const saveInvestments = (newInvestments) => {
    setInvestments(newInvestments);
    localStorage.setItem('investments', JSON.stringify(newInvestments));
  };

  const addInvestment = (investmentData) => {
    const newInvestment = {
      id: Date.now(),
      ...investmentData,
      createdAt: new Date().toISOString(),
      currentValue: investmentData.investedAmount, // Start with same as invested
      gainLoss: 0,
      gainLossPercentage: 0
    };
    
    const updatedInvestments = [...investments, newInvestment];
    saveInvestments(updatedInvestments);
    return newInvestment;
  };

  const deleteInvestment = (id) => {
    const updatedInvestments = investments.filter(inv => inv.id !== id);
    saveInvestments(updatedInvestments);
  };

  const calculateTotals = () => {
    const totals = investments.reduce((acc, investment) => {
      return {
        portfolioValue: acc.portfolioValue + (investment.currentValue || investment.investedAmount),
        investedAmount: acc.investedAmount + investment.investedAmount,
        gainLoss: acc.gainLoss + ((investment.currentValue || investment.investedAmount) - investment.investedAmount)
      };
    }, { portfolioValue: 0, investedAmount: 0, gainLoss: 0 });

    return {
      ...totals,
      gainLossPercentage: totals.investedAmount > 0 ? (totals.gainLoss / totals.investedAmount) * 100 : 0
    };
  };

  const value = {
    investments,
    isLoading,
    addInvestment,
    deleteInvestment,
    calculateTotals,
    refreshInvestments: loadInvestments
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};

export default InvestmentContext;