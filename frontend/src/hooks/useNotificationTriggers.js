// src/hooks/useNotificationTriggers.js
import { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useRecurring } from '../context/RecurringContext';
import { useBudget } from '../context/BudgetContext';
import { useGoal } from '../context/GoalContext';

export const useNotificationTriggers = () => {
  const { addNotification } = useNotification();
  const { recurringTransactions } = useRecurring();
  const { budgets } = useBudget();
  const { goals } = useGoal();

  // Check for upcoming recurring transactions
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    recurringTransactions.forEach(transaction => {
      if (transaction.isActive) {
        const nextDate = new Date(transaction.nextDate);
        
        if (nextDate.toDateString() === tomorrow.toDateString()) {
          addNotification({
            type: 'warning',
            icon: 'bi-calendar-check',
            message: `Reminder: ${transaction.description} due tomorrow - ${formatIndianCurrency(Math.abs(transaction.amount))}`
          });
        }
      }
    });
  }, [recurringTransactions, addNotification]);

  // Check for budget alerts
  useEffect(() => {
    // Budget notification logic will be added here
  }, [budgets, addNotification]);

  // Check for goal progress
  useEffect(() => {
    // Goal notification logic will be added here
  }, [goals, addNotification]);
};

// Helper function (add to your storage.js if needed)
export const formatIndianCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};