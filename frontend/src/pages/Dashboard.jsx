import { Container } from 'react-bootstrap';
import SummaryCards from '../components/Finance/SummaryCards.jsx';
import MonthlyChart from '../components/Finance/MonthlyChart.jsx';
import BudgetTracker from '../components/Finance/BudgetTracker.jsx';
import GoalTracker from '../components/Finance/GoalTracker.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { useNotificationTriggers } from '../hooks/useNotificationTriggers.js';
import { formatIndianCurrency } from '../utils/storage.js';
import NotificationScheduler from '../components/UI/NotificationScheduler.jsx';

function Dashboard() {
  const { transactions, totals } = useFinance();
  useNotificationTriggers(); // Notification triggers added here

  // Check for important notifications to show on dashboard
  const hasCriticalNotifications = () => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifications.some(n => !n.read && n.priority === 'critical');
  };

  const hasHighPriorityNotifications = () => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifications.some(n => !n.read && (n.priority === 'critical' || n.priority === 'high'));
  };

  return (
    <Container>
      <NotificationScheduler />
      
      <h1 className="mb-6 text-3xl font-bold text-white">
        <i className="bi bi-speedometer2 me-3"></i>
        Dashboard
        {hasCriticalNotifications() && (
          <span className="ms-3 badge bg-danger">
            <i className="bi bi-exclamation-triangle me-1"></i>
            Attention Needed
          </span>
        )}
      </h1>
      
      {hasHighPriorityNotifications() && (
        <div className="mb-4 p-3 bg-danger rounded-lg border border-red-400">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2 text-white"></i>
            <span className="text-white">
              You have important notifications requiring your attention. 
            </span>
            <a href="/notifications" className="ms-2 text-white text-decoration-underline">
              View notifications
            </a>
          </div>
        </div>
      )}
      
      <SummaryCards 
        balance={totals.balance} 
        income={totals.income} 
        expenses={totals.expenses} 
      />
      
      <MonthlyChart transactions={transactions} />
      
      <BudgetTracker />
      
      <GoalTracker />
      
      <div className="mt-8 p-6 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <h2 className="text-xl font-semibold text-white mb-3">
          <i className="bi bi-clock-history me-2"></i>
          Recent Activity
        </h2>
        <p className="text-white">
          <i className="bi bi-list-check me-2"></i>
          You have {transactions.length} total transaction{transactions.length !== 1 ? 's' : ''}. 
          Go to the Transactions page to manage them.
        </p>
        {transactions.length > 0 && (
          <div className="mt-4 p-4 bg-grey-medium rounded-lg border border-maroon">
            <p className="text-sm text-white">
              <i className="bi bi-arrow-up-right me-2"></i>
              <strong>Latest transaction:</strong> {transactions[0]?.description} - 
              {formatIndianCurrency(Math.abs(transactions[0]?.amount))}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}

export default Dashboard;