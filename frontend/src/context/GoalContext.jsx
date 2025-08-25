import { createContext, useContext, useState, useEffect } from 'react';

const GoalContext = createContext();

export const useGoal = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoal must be used within a GoalProvider');
  }
  return context;
};

export const GoalProvider = ({ children }) => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        // Ensure all goals have notification flags
        const goalsWithFlags = parsedGoals.map(goal => ({
          ...goal,
          notified25: goal.notified25 || false,
          notified50: goal.notified50 || false,
          notified75: goal.notified75 || false,
          notifiedCompleted: goal.notifiedCompleted || false
        }));
        setGoals(goalsWithFlags);
      } catch (error) {
        console.error('Error parsing goals:', error);
        localStorage.removeItem('goals');
        setGoals([]);
      }
    }
    setIsLoading(false);
  };

  const saveGoalsToStorage = (updatedGoals) => {
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
  };

  const createGoal = (goalData) => {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      createdAt: new Date().toISOString(),
      currentAmount: 0,
      completed: false,
      notified25: false,
      notified50: false,
      notified75: false,
      notifiedCompleted: false
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    saveGoalsToStorage(updatedGoals);
    return newGoal;
  };

  const updateGoal = (id, updatedData) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, ...updatedData } : goal
    );
    setGoals(updatedGoals);
    saveGoalsToStorage(updatedGoals);
  };

  const deleteGoal = (id) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    setGoals(updatedGoals);
    saveGoalsToStorage(updatedGoals);
  };

  const addContribution = (goalId, amount) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.currentAmount + amount;
        const completed = newAmount >= goal.targetAmount;
        return {
          ...goal,
          currentAmount: newAmount,
          completed: completed
        };
      }
      return goal;
    });
    setGoals(updatedGoals);
    saveGoalsToStorage(updatedGoals);
  };

  const calculateGoalProgress = (goal) => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    return {
      percentage: Math.min(percentage, 100),
      remaining: goal.targetAmount - goal.currentAmount,
      isCompleted: goal.currentAmount >= goal.targetAmount
    };
  };

  const getGoalsByStatus = (completed = false) => {
    return goals.filter(goal => goal.completed === completed);
  };

  const resetGoalNotifications = (goalId) => {
    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? {
        ...goal,
        notified25: false,
        notified50: false,
        notified75: false,
        notifiedCompleted: false
      } : goal
    );
    setGoals(updatedGoals);
    saveGoalsToStorage(updatedGoals);
  };

  const value = {
    goals,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    calculateGoalProgress,
    getGoalsByStatus,
    resetGoalNotifications,
    refreshGoals: loadGoals
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
};

export default GoalContext;