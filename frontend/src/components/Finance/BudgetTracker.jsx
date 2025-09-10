import { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { useFinance } from '../../context/FinanceContext';
import AddBudgetModal from './AddBudgetModal';

function BudgetTracker() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { budgets, calculateBudgetProgress, deleteBudget } = useBudget();
  const { getTransactionsByCategory } = useFinance();

  const getCategorySpending = (category) => {
    const categoryTransactions = getTransactionsByCategory(category);
    return categoryTransactions
      .filter(t => t.amount < 0)
      .reduce((total, t) => total + Math.abs(t.amount), 0);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'bg-gradient-to-r from-[#ff5252] to-[#ff7b46]';
    if (percentage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (budgets.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
          <i className="bi bi-piggy-bank text-3xl text-white"></i>
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">No Budgets Set Yet</h3>
        <p className="text-gray-300 mb-6 max-w-md">
          Create budgets to track your spending and manage your finances more effectively
        </p>
        <button
          className="px-6 py-3 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] hover:from-[#ff6b6b] hover:to-[#ff9e6b] text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center mx-auto hover:scale-105 transform border border-orange-400/30 hover:shadow-xl hover:shadow-orange-500/20"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-circle text-lg mr-2"></i>
          Create First Budget
        </button>
        <AddBudgetModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Budget Tracking</h2>
        <button
          className="px-5 py-2.5 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] hover:from-[#ff6b6b] hover:to-[#ff9e6b] text-white font-medium rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center hover:scale-105 transform border border-orange-400/30 hover:shadow-xl hover:shadow-orange-500/20 group"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-lg text-lg mr-2 group-hover:scale-110 transition-transform"></i>
          Add Budget
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const spent = getCategorySpending(budget.category);
          const progress = calculateBudgetProgress(budget, spent);
          const progressColor = getProgressColor(progress.percentage);
          
          return (
            <div 
              key={budget.id} 
              className="bg-[#1a2530] p-5 rounded-2xl border border-[#2d3748] shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-lg mb-1 truncate">{budget.category}</h4>
                  <p className="text-gray-300 text-sm">
                    ₹{spent.toLocaleString('en-IN')} of ₹{budget.amount.toLocaleString('en-IN')}
                  </p>
                </div>
                <button
                  onClick={() => deleteBudget(budget.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 hover:scale-110 transform flex-shrink-0 ml-2"
                  aria-label="Delete budget"
                >
                  <i className="bi bi-trash text-lg"></i>
                </button>
              </div>
              
              <div className="mt-auto">
                <div className="w-full bg-[#2c3e50] rounded-full h-2.5 mb-2">
                  <div 
                    className={`h-2.5 rounded-full ${progressColor} transition-all duration-700 ease-out`}
                    style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">
                    {Math.min(progress.percentage, 100).toFixed(1)}% used
                  </span>
                  <span className={`text-xs font-semibold ${
                    progress.isOverBudget 
                      ? 'text-red-400' 
                      : 'text-green-400'
                  }`}>
                    {progress.isOverBudget 
                      ? 'Over Budget' 
                      : '₹' + progress.remaining.toLocaleString('en-IN') + ' left'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddBudgetModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
      />
    </div>
  );
}

export default BudgetTracker;