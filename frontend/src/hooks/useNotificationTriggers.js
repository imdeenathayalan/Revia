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
  const { goals, updateGoal } = useGoal();
  const { totals, getTransactionsByDateRange, getTransactionsByCategory } = useFinance();

  // Load notification settings with thresholds
  const getNotificationSettings = () => {
    const saved = localStorage.getItem('notificationSettings');
    const defaultSettings = {
      billReminders: true,
      budgetAlerts: true,
      goalUpdates: true,
      lowBalanceWarnings: true,
      budgetWarningThreshold: 80,
      budgetCriticalThreshold: 95,
      lowBalanceThreshold: 5000,
      goalMilestones: [25, 50, 75, 100]
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  };

  // Helper to calculate spending for a specific period
  const calculateCategorySpending = (category, period = 'monthly') => {
    const today = new Date();
    let startDate, endDate;
    
    if (period === 'monthly') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (period === 'weekly') {
      const dayOfWeek = today.getDay();
      startDate = new Date(today);
      startDate.setDate(today.getDate() - dayOfWeek);
      endDate = new Date(today);
      endDate.setDate(today.getDate() + (6 - dayOfWeek));
    } else {
      // Custom period or other handling
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    const transactions = getTransactionsByDateRange(startDate, endDate);
    return transactions
      .filter(t => t.category === category && t.amount < 0)
      .reduce((total, t) => total + Math.abs(t.amount), 0);
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
    const inSevenDays = new Date();
    inSevenDays.setDate(inSevenDays.getDate() + 7);

    recurringTransactions.forEach(transaction => {
      if (transaction.isActive) {
        const nextDate = new Date(transaction.nextDate);
        
        // Notify 7 days before
        if (nextDate.toDateString() === inSevenDays.toDateString()) {
          addNotification({
            type: 'bill',
            icon: 'bi-calendar-event',
            message: `Upcoming bill: ${transaction.description} due in 7 days - ${formatIndianCurrency(Math.abs(transaction.amount))}`,
            priority: 'medium'
          });
        }
        
        // Notify 3 days before
        if (nextDate.toDateString() === inThreeDays.toDateString()) {
          addNotification({
            type: 'bill',
            icon: 'bi-calendar-check',
            message: `Upcoming: ${transaction.description} due in 3 days - ${formatIndianCurrency(Math.abs(transaction.amount))}`,
            priority: 'medium'
          });
        }
        
        // Notify 1 day before
        if (nextDate.toDateString() === tomorrow.toDateString()) {
          addNotification({
            type: 'bill',
            icon: 'bi-calendar-check',
            message: `Reminder: ${transaction.description} due tomorrow - ${formatIndianCurrency(Math.abs(transaction.amount))}`,
            priority: 'high'
          });
        }
      }
    });
  }, [recurringTransactions, addNotification]);

  // Check for budget alerts with actual spending data
  useEffect(() => {
    const settings = getNotificationSettings();
    if (!settings.budgetAlerts) return;

    budgets.forEach(budget => {
      const spent = calculateCategorySpending(budget.category, budget.period);
      const percentage = (spent / budget.amount) * 100;

      // Critical budget alert (over 95% or over budget)
      if (percentage >= settings.budgetCriticalThreshold || spent > budget.amount) {
        addNotification({
          type: 'budget',
          icon: 'bi-exclamation-triangle',
          message: `Budget critical: ${budget.category} is ${percentage.toFixed(0)}% used (₹${spent.toLocaleString('en-IN')} of ₹${budget.amount.toLocaleString('en-IN')})`,
          priority: 'high'
        });
      }
      // Warning budget alert (over 80%)
      else if (percentage >= settings.budgetWarningThreshold) {
        addNotification({
          type: 'budget',
          icon: 'bi-piggy-bank',
          message: `Budget warning: ${budget.category} is ${percentage.toFixed(0)}% used`,
          priority: 'medium'
        });
      }
    });
  }, [budgets, addNotification]);

  // Check for goal progress with proper state management
  useEffect(() => {
    const settings = getNotificationSettings();
    if (!settings.goalUpdates) return;

    goals.forEach(goal => {
      if (goal.completed) return; // Skip completed goals

      const percentage = (goal.currentAmount / goal.targetAmount) * 100;
      
      // Check each milestone
      settings.goalMilestones.forEach(milestone => {
        if (percentage >= milestone && !goal[`notified${milestone}`]) {
          let message = '';
          let icon = 'bi-trophy';
          let priority = 'low';

          switch (milestone) {
            case 25:
              message = `Great start! ${goal.name} is 25% complete`;
              break;
            case 50:
              message = `Halfway there! ${goal.name} is 50% complete`;
              priority = 'medium';
              break;
            case 75:
              message = `Almost there! ${goal.name} is 75% complete`;
              priority = 'medium';
              break;
            case 100:
              message = `Congratulations! You achieved your goal: ${goal.name}`;
              icon = 'bi-award';
              priority = 'high';
              break;
          }

          if (message) {
            addNotification({
              type: 'goal',
              icon: icon,
              message: message,
              priority: priority
            });

            // Update goal notification flag
            updateGoal(goal.id, { [`notified${milestone}`]: true });
          }
        }
      });
    });
  }, [goals, addNotification, updateGoal]);

  // Check for low balance with configurable threshold
  useEffect(() => {
    const settings = getNotificationSettings();
    if (!settings.lowBalanceWarnings) return;

    const lowBalanceThreshold = settings.lowBalanceThreshold || 5000;
    
    if (totals.balance < lowBalanceThreshold && totals.balance > 0) {
      addNotification({
        type: 'balance',
        icon: 'bi-wallet2',
        message: `Low balance alert: Your account balance is ${formatIndianCurrency(totals.balance)}`,
        priority: 'high'
      });
    }

    // Very low balance warning (below ₹1000)
    if (totals.balance < 1000 && totals.balance > 0) {
      addNotification({
        type: 'balance',
        icon: 'bi-exclamation-triangle',
        message: `Very low balance: Only ${formatIndianCurrency(totals.balance)} remaining`,
        priority: 'critical'
      });
    }
  }, [totals.balance, addNotification]);

  // Check for unusual spending patterns
  useEffect(() => {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    const recentTransactions = getTransactionsByDateRange(oneWeekAgo, today);
    const largeExpenses = recentTransactions.filter(t => 
      t.amount < 0 && Math.abs(t.amount) > 10000
    );

    if (largeExpenses.length > 2) {
      addNotification({
        type: 'spending',
        icon: 'bi-graph-up-arrow',
        message: `Unusual spending: ${largeExpenses.length} large expenses this week`,
        priority: 'medium'
      });
    }
  }, [addNotification]);
};