// Utility functions to handle localStorage
export const getTransactions = () => {
  const data = localStorage.getItem('transactions');
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = (transactions) => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
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