// src/context/DebtContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const DebtContext = createContext();

export const useDebt = () => {
  const context = useContext(DebtContext);
  if (!context) {
    throw new Error('useDebt must be used within a DebtProvider');
  }
  return context;
};

export const DebtProvider = ({ children }) => {
  const [debts, setDebts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = () => {
    try {
      const savedDebts = localStorage.getItem('debts');
      if (savedDebts) {
        setDebts(JSON.parse(savedDebts));
      }
    } catch (error) {
      console.error('Error loading debts:', error);
      localStorage.removeItem('debts');
      setDebts([]);
    }
    setIsLoading(false);
  };

  const saveDebts = (newDebts) => {
    setDebts(newDebts);
    localStorage.setItem('debts', JSON.stringify(newDebts));
  };

  const addDebt = (debtData) => {
    const newDebt = {
      id: Date.now(),
      ...debtData,
      createdAt: new Date().toISOString(),
      remainingAmount: debtData.originalAmount,
      totalPaid: 0,
      isActive: true
    };
    
    const updatedDebts = [...debts, newDebt];
    saveDebts(updatedDebts);
    return newDebt;
  };

  const updateDebt = (id, updatedData) => {
    const updatedDebts = debts.map(debt =>
      debt.id === id ? { ...debt, ...updatedData } : debt
    );
    saveDebts(updatedDebts);
  };

  const deleteDebt = (id) => {
    const updatedDebts = debts.filter(debt => debt.id !== id);
    saveDebts(updatedDebts);
  };

  const addPayment = (debtId, paymentData) => {
    const debt = debts.find(d => d.id === debtId);
    if (debt) {
      const payment = {
        id: Date.now(),
        ...paymentData,
        date: new Date().toISOString()
      };
      
      const updatedDebt = {
        ...debt,
        remainingAmount: debt.remainingAmount - paymentData.amount,
        totalPaid: debt.totalPaid + paymentData.amount,
        payments: [...(debt.payments || []), payment]
      };
      
      if (updatedDebt.remainingAmount <= 0) {
        updatedDebt.isActive = false;
        updatedDebt.paidOffDate = new Date().toISOString();
      }
      
      updateDebt(debtId, updatedDebt);
    }
  };

  const calculateDebtTotals = () => {
    return debts.reduce((totals, debt) => {
      if (debt.isActive) {
        totals.totalDebt += debt.remainingAmount;
        totals.totalMonthlyPayment += debt.monthlyPayment || 0;
      }
      totals.totalPaid += debt.totalPaid || 0;
      return totals;
    }, { totalDebt: 0, totalMonthlyPayment: 0, totalPaid: 0 });
  };

  const getActiveDebts = () => {
    return debts.filter(debt => debt.isActive);
  };

  const getPaidOffDebts = () => {
    return debts.filter(debt => !debt.isActive);
  };

  const calculateEMI = (principal, annualInterestRate, tenureMonths) => {
    const monthlyRate = annualInterestRate / 12 / 100;
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    return emi;
  };

  const value = {
    debts,
    isLoading,
    addDebt,
    updateDebt,
    deleteDebt,
    addPayment,
    calculateDebtTotals,
    getActiveDebts,
    getPaidOffDebts,
    calculateEMI,
    refreshDebts: loadDebts
  };

  return (
    <DebtContext.Provider value={value}>
      {children}
    </DebtContext.Provider>
  );
};

export default DebtContext;