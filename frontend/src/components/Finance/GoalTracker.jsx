// src/components/Finance/GoalTracker.jsx
import { useState } from 'react';
import { Card, Button, ProgressBar, Badge } from 'react-bootstrap';
import { useGoal } from '../../context/GoalContext';
import AddGoalModal from './AddGoalModal';

function GoalTracker() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { goals, calculateGoalProgress, deleteGoal } = useGoal();

  const getProgressVariant = (percentage, isCompleted) => {
    if (isCompleted) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 50) return 'warning';
    return 'primary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (goals.length === 0) {
    return (
      <Card className="mt-6 shadow-xl border border-maroon bg-grey-dark">
        <Card.Body className="p-8 text-center">
          <div className="text-6xl mb-4 text-maroon-light">
            <i className="bi bi-trophy"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Goals Set</h3>
          <p className="text-white mb-4">
            Create savings goals to track your progress and achieve your dreams
          </p>
          <Button
            className="px-6 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white font-semibold border border-maroon"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create First Goal
          </Button>
        </Card.Body>
        <AddGoalModal
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
            <i className="bi bi-trophy me-2"></i>
            Savings Goals
          </h3>
          <Button
            className="px-4 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white border border-maroon"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus me-2"></i>
            New Goal
          </Button>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = calculateGoalProgress(goal);
            
            return (
              <div key={goal.id} className="p-4 bg-grey-medium rounded-lg border border-maroon">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-semibold">{goal.name}</h4>
                    <p className="text-sm text-white">
                      ₹{goal.currentAmount.toLocaleString('en-IN')} saved of ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </p>
                    {goal.targetDate && (
                      <p className="text-xs text-maroon-light">
                        Target: {formatDate(goal.targetDate)}
                      </p>
                    )}
                  </div>
                  <Badge 
                    bg={progress.isCompleted ? 'success' : 'primary'} 
                    className="px-3 py-1"
                  >
                    {progress.isCompleted ? 'Completed!' : '₹' + progress.remaining.toLocaleString('en-IN') + ' to go'}
                  </Badge>
                </div>
                
                <ProgressBar 
                  now={progress.percentage} 
                  variant={getProgressVariant(progress.percentage, progress.isCompleted)}
                  className="mb-3"
                  animated={!progress.isCompleted}
                />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white">
                    {progress.percentage.toFixed(1)}% achieved
                  </span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteGoal(goal.id)}
                    className="px-3 py-1"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <AddGoalModal
          show={showAddModal}
          handleClose={() => setShowAddModal(false)}
        />
      </Card.Body>
    </Card>
  );
}

export default GoalTracker;