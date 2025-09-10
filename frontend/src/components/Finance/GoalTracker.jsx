import { useState } from 'react';
import { useGoal } from '../../context/GoalContext';
import AddGoalModal from './AddGoalModal';

function GoalTracker() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { goals, calculateGoalProgress, deleteGoal } = useGoal();

  const getProgressColor = (percentage, isCompleted) => {
    if (isCompleted) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-orange-500';
    return 'bg-gradient-to-r from-[#ff5252] to-[#ff7b46]';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (goals.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
          <i className="bi bi-trophy text-3xl text-white"></i>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">No Goals Set Yet</h3>
        <p className="text-gray-300 mb-6 max-w-md">
          Start by creating your first savings goal to track your progress towards financial dreams
        </p>
        <button
          className="px-6 py-3 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] hover:from-[#ff6b6b] hover:to-[#ff9e6b] text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center mx-auto hover:scale-105 transform border border-orange-400/30 hover:shadow-xl hover:shadow-orange-500/20"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-circle text-lg mr-2"></i>
          Create First Goal
        </button>
        <AddGoalModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Savings Goals</h2>
        <button
          className="px-5 py-2.5 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] hover:from-[#ff6b6b] hover:to-[#ff9e6b] text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-105 transform border border-orange-400/30 hover:shadow-xl hover:shadow-orange-500/20 group"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg text-lg mr-2 group-hover:scale-110 transition-transform"></i>
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = calculateGoalProgress(goal);
          const progressColor = getProgressColor(progress.percentage, progress.isCompleted);
          const daysRemaining = goal.targetDate ? getDaysRemaining(goal.targetDate) : null;
          
          return (
            <div 
              key={goal.id} 
              className="bg-[#1a2530] p-5 rounded-2xl border border-[#2d3748] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-lg mb-1 truncate">{goal.name}</h4>
                  <p className="text-gray-300 text-sm">
                    ₹{goal.currentAmount.toLocaleString('en-IN')} of ₹{goal.targetAmount.toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 hover:scale-110 transform flex-shrink-0 ml-2"
                  aria-label="Delete goal"
                >
                  <i className="bi bi-trash text-lg"></i>
                </button>
              </div>
              
              {goal.targetDate && (
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Target: {formatDate(goal.targetDate)}
                  </span>
                  {daysRemaining > 0 && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      daysRemaining < 7 
                        ? 'bg-red-800/50 text-red-200' 
                        : daysRemaining < 30
                          ? 'bg-orange-800/50 text-orange-200'
                          : 'bg-blue-800/50 text-blue-200'
                    }`}>
                      {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                    </span>
                  )}
                  {daysRemaining <= 0 && (
                    <span className="text-xs bg-red-800/50 text-red-200 px-2 py-1 rounded-full">
                      Past due
                    </span>
                  )}
                </div>
              )}
              
              <div className="mt-auto">
                <div className="w-full bg-[#2c3e50] rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full ${progressColor} transition-all duration-700 ease-out`}
                    style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">
                    {Math.min(progress.percentage, 100).toFixed(1)}% achieved
                  </span>
                  <span className={`text-xs font-semibold ${
                    progress.isCompleted 
                      ? 'text-green-400' 
                      : 'text-orange-400'
                  }`}>
                    {progress.isCompleted 
                      ? 'Completed!' 
                      : '₹' + progress.remaining.toLocaleString('en-IN') + ' to go'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddGoalModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />
    </div>
  );
}

export default GoalTracker;