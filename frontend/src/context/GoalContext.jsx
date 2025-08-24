// src/context/GoalContext.jsx
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
        setGoals(JSON.parse(savedGoals));
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
      completed: false
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
        return {
          ...goal,
          currentAmount: newAmount,
          completed: newAmount >= goal.targetAmount
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

  const value = {
    goals,
    isLoading,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    calculateGoalProgress,
    getGoalsByStatus,
    refreshGoals: loadGoals
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
};

export default GoalContext;