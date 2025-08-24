// src/components/Finance/BudgetTracker.jsx
import { useState } from 'react';
import { Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import { useBudget } from '../../context/BudgetContext.jsx';
import { useFinance } from '../../context/FinanceContext.jsx';
import { indianCategories } from '../../utils/storage';
import AddBudgetModal from './AddBudgetModal.jsx';

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

  const getProgressVariant = (percentage) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  if (budgets.length === 0) {
    return (
      <Card className="mt-6 shadow-xl border border-maroon bg-grey-dark">
        <Card.Body className="p-8 text-center">
          <div className="text-6xl mb-4 text-maroon-light">
            <i className="bi bi-piggy-bank"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Budgets Set</h3>
          <p className="text-white mb-4">
            Create budgets to track your spending and save money
          </p>
          <Button
            className="px-6 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white font-semibold border border-maroon"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create First Budget
          </Button>
        </Card.Body>
        <AddBudgetModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
        />
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-xl border border-maroon bg-grey-dark">
      <Card.Body className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">
            <i className="bi bi-piggy-bank me-2"></i>
            Monthly Budgets
          </h3>
          <Button
            className="px-4 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white border border-maroon"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus me-2"></i>
            Add Budget
          </Button>
        </div>

        <div className="space-y-4">
          {budgets.map((budget) => {
            const spent = getCategorySpending(budget.category);
            const progress = calculateBudgetProgress(budget, spent);
            
            return (
              <div key={budget.id} className="p-4 bg-grey-medium rounded-lg border border-maroon">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{budget.category}</h4>
                    <p className="text-sm text-white">
                      ₹{spent.toLocaleString('en-IN')} spent of ₹{budget.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Badge 
                    bg={progress.isOverBudget ? 'danger' : 'success'} 
                    className="px-3 py-1"
                  >
                    {progress.isOverBudget ? 'Over Budget' : '₹' + progress.remaining.toLocaleString('en-IN') + ' left'}
                  </Badge>
                </div>
                
                <ProgressBar 
                  now={progress.percentage} 
                  variant={getProgressVariant(progress.percentage)}
                  className="mb-3"
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white">
                    {progress.percentage.toFixed(1)}% used
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteBudget(budget.id)}
                    className="px-3 py-1"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <AddBudgetModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
        />
      </Card.Body>
    </Card>
  );
}

export default BudgetTracker;