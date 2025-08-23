// Utility functions to handle localStorage
export const getTransactions = () => {
  const data = localStorage.getItem('transactions');
  return data ? JSON.parse(data) : [];
};

export const saveTransactions = (transactions) => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

// Calculate totals
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