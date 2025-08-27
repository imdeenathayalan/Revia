// src/context/SharedContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const SharedContext = createContext();

export const useShared = () => {
  const context = useContext(SharedContext);
  if (!context) {
    throw new Error('useShared must be used within a SharedProvider');
  }
  return context;
};

export const SharedProvider = ({ children }) => {
  const [sharedAccounts, setSharedAccounts] = useState([]);
  const [sharedTransactions, setSharedTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSharedData();
  }, []);

  const loadSharedData = () => {
    try {
      const savedAccounts = localStorage.getItem('sharedAccounts');
      const savedTransactions = localStorage.getItem('sharedTransactions');
      
      if (savedAccounts) {
        setSharedAccounts(JSON.parse(savedAccounts));
      }
      if (savedTransactions) {
        setSharedTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Error loading shared data:', error);
      localStorage.removeItem('sharedAccounts');
      localStorage.removeItem('sharedTransactions');
      setSharedAccounts([]);
      setSharedTransactions([]);
    }
    setIsLoading(false);
  };

  const saveSharedData = () => {
    localStorage.setItem('sharedAccounts', JSON.stringify(sharedAccounts));
    localStorage.setItem('sharedTransactions', JSON.stringify(sharedTransactions));
  };

  const createSharedAccount = (accountData) => {
    const newAccount = {
      id: Date.now(),
      ...accountData,
      createdAt: new Date().toISOString(),
      balance: 0,
      members: [{
        userId: accountData.ownerId,
        email: accountData.ownerEmail,
        role: 'owner',
        joinedAt: new Date().toISOString()
      }]
    };
    
    const updatedAccounts = [...sharedAccounts, newAccount];
    setSharedAccounts(updatedAccounts);
    localStorage.setItem('sharedAccounts', JSON.stringify(updatedAccounts));
    return newAccount;
  };

  const inviteMember = (accountId, email, role = 'member') => {
    const updatedAccounts = sharedAccounts.map(account => {
      if (account.id === accountId) {
        const invitation = {
          id: Date.now(),
          email: email.toLowerCase(),
          role,
          status: 'pending',
          invitedAt: new Date().toISOString(),
          token: Math.random().toString(36).substring(2, 15)
        };
        
        return {
          ...account,
          invitations: [...(account.invitations || []), invitation]
        };
      }
      return account;
    });
    
    setSharedAccounts(updatedAccounts);
    localStorage.setItem('sharedAccounts', JSON.stringify(updatedAccounts));
    return true;
  };

  const addSharedTransaction = (transactionData) => {
    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      createdAt: new Date().toISOString(),
      settled: false
    };
    
    const updatedTransactions = [...sharedTransactions, newTransaction];
    setSharedTransactions(updatedTransactions);
    
    // Update account balance
    const updatedAccounts = sharedAccounts.map(account => {
      if (account.id === transactionData.accountId) {
        const newBalance = transactionData.type === 'income' 
          ? account.balance + transactionData.amount
          : account.balance - transactionData.amount;
        
        return { ...account, balance: newBalance };
      }
      return account;
    });
    
    setSharedAccounts(updatedAccounts);
    localStorage.setItem('sharedTransactions', JSON.stringify(updatedTransactions));
    localStorage.setItem('sharedAccounts', JSON.stringify(updatedAccounts));
    
    return newTransaction;
  };

  const getAccountTransactions = (accountId) => {
    return sharedTransactions.filter(t => t.accountId === accountId);
  };

  const getMemberAccounts = (userId) => {
    return sharedAccounts.filter(account => 
      account.members.some(member => member.userId === userId)
    );
  };

  const value = {
    sharedAccounts,
    sharedTransactions,
    isLoading,
    createSharedAccount,
    inviteMember,
    addSharedTransaction,
    getAccountTransactions,
    getMemberAccounts,
    refreshSharedData: loadSharedData
  };

  return (
    <SharedContext.Provider value={value}>
      {children}
    </SharedContext.Provider>
  );
};

export default SharedContext;