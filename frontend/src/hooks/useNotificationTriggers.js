// src/hooks/useNotificationTriggers.js
import { useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { useRecurring } from '../context/RecurringContext';
import { useBudget } from '../context/BudgetContext';
import { useGoal } from '../context/GoalContext';
import { useFinance } from '../context/FinanceContext';
import { formatIndianCurrency } from '../utils/storage';

export const useNotificationTriggers = () => {
  const { addNotification } = useNotification();
  const { recurringTransactions } = useRecurring();
  const { budgets } = useBudget();
  const { goals } = useGoal();
  const { totals } = useFinance();

  // Load notification settings
  const getNotificationSettings = () => {
    const saved = localStorage.getItem('notificationSettings');
    return saved ? JSON.parse(saved) : {
      billReminders: true,
      budgetAlerts: true,
      goalUpdates: true,
      lowBalanceWarnings: true
    };
  };

  // Check for upcoming recurring transactions (bills)
  useEffect(() => {
    const settings = getNotificationSettings();
    if (!settings.billReminders) return;

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const inThreeDays = new Date();
    inThreeDays.setDate(inThreeDays.getDate() + 3);

    recurringTransactions.forEach(transaction => {
      if (transaction.isActive) {
        const nextDate = new Date(transaction.nextDate);
        
        // Notify 3 days before
        if (nextDate.toDateString() === inThreeDays.toDateString()) {
          addNotification({
            type: 'bill',
            icon: 'bi-calendar-check',
            message: `Upcoming: ${transaction.description} due in 3 days - ${formatIndianCurrency(Math.abs(transaction.amount))}`
          });
        }
        
        // Notify 1 day before
        if (nextDate.toDateString() === tomorrow.toDateString()) {
          addNotification({
            type: 'bill',
            icon: 'bi-calendar-check',
            message: `Reminder: ${transaction.description} due tomorrow - ${formatIndianCurrency(Math.abs(transaction.amount))}`
          });
        }
      }
    });
  }, [recurringTransactions, addNotification]);

  // Check for budget alerts
  useEffect(() => {
    const settings = getNotificationSettings();
    if (!settings.budgetAlerts) return;

    budgets.forEach(budget => {
      // This would require actual spending data per category
      // For now, we'll simulate some budget alerts
      const spent = Math.random() * budget.amount;
      const percentage = (spent / budget.amount) * 100;

      if (percentage > 80 && percentage <= 100) {
        addNotification({
          type: 'budget',
          icon: 'bi-piggy-bank',
          message: `Budget alert: ${budget.category} is ${percentage.toFixed(0)}% used`
        });
      }

      if (percentage > 100) {
        addNotification({
          type: 'budget',
          icon: 'bi-piggy-bank',
          message: `Over budget: ${budget.category} exceeded by ${formatIndianCurrency(spent - budget.amount)}`
        });
      }
    });
  }, [budgets, addNotification]);

  // Check for goal progress
  useEffect(() => {
    const settings = getNotificationSettings();
    if (!settings.goalUpdates) return;

    goals.forEach(goal => {
      const percentage = (goal.currentAmount / goal.targetAmount) * 100;
      
      if (percentage >= 100 && !goal.notifiedCompleted) {
        addNotification({
          type: 'goal',
          icon: 'bi-trophy',
          message: `Congratulations! You achieved your goal: ${goal.name}`
        });
        // Mark as notified to avoid duplicate notifications
        goal.notifiedCompleted = true;
      }
      else if (percentage >= 75 && percentage < 100 && !goal.notified75) {
        addNotification({
          type: 'goal',
          icon: 'bi-trophy',
          message: `Great progress! ${goal.name} is ${percentage.toFixed(0)}% complete`
        });
        goal.notified75 = true;
      }
      else if (percentage >= 50 && percentage < 75 && !goal.notified50) {
        addNotification({
          type: 'goal',
          icon: 'bi-trophy',
          message: `Halfway there! ${goal.name} is ${percentage.toFixed(0)}% complete`
        });
        goal.notified50 = true;
      }
    });
  }, [goals, addNotification]);

  // Check for low balance
  useEffect(() => {
    const settings = getNotificationSettings();
    if (!settings.lowBalanceWarnings) return;

    const lowBalanceThreshold = 5000; // ₹5000
    if (totals.balance < lowBalanceThreshold && totals.balance > 0) {
      addNotification({
        type: 'balance',
        icon: 'bi-wallet2',
        message: `Low balance alert: Your account balance is ${formatIndianCurrency(totals.balance)}`
      });
    }
  }, [totals.balance, addNotification]);
};