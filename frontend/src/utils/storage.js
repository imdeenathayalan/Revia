// src/utils/storage.js
// Utility functions to handle localStorage
export const getTransactions = () => {
  const data = localStorage.getItem('transactions');
  const transactions = data ? JSON.parse(data) : [];
  
  // Ensure all dates are proper Date objects
  return transactions.map(transaction => ({
    ...transaction,
    date: new Date(transaction.date)
  }));
};

export const saveTransactions = (transactions) => {
  // Convert Date objects to ISO string for storage
  const transactionsForStorage = transactions.map(transaction => ({
    ...transaction,
    date: transaction.date.toISOString() // Store as ISO string
  }));
  localStorage.setItem('transactions', JSON.stringify(transactionsForStorage));
};

// Calculate totals with rupee symbol
export const calculateTotals = (transactions) => {
  let income = 0;
  let expenses = 0;

  transactions.forEach(transaction => {
    if (transaction.amount > 0) {
      income += transaction.amount;
    } else {
      expenses += Math.abs(transaction.amount);
    }
  });

  const balance = income - expenses;

  return { income, expenses, balance };
};

// Format currency for India (Rupee)
export const formatIndianCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Indian categories
export const indianCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Utilities',
  'Rent & EMI',
  'Healthcare',
  'Education',
  'Investment',
  'Salary',
  'Freelance',
  'Other Income',
  'Other Expense'
];

// Helper function to format date for display
export const formatDisplayDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};