import { useState, useEffect } from 'react';
import SummaryCards from '../components/Finance/SummaryCards.jsx';
import MonthlyChart from '../components/Finance/MonthlyChart.jsx';
import BudgetTracker from '../components/Finance/BudgetTracker.jsx';
import GoalTracker from '../components/Finance/GoalTracker.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { useNotificationTriggers } from '../hooks/useNotificationTriggers.js';
import { formatIndianCurrency } from '../utils/storage.js';
import NotificationScheduler from '../components/UI/NotificationScheduler.jsx';
import './Dashboard.css';

function Dashboard() {
  const { transactions, totals } = useFinance();
  const [isVisible, setIsVisible] = useState(false);
  const [hasCritical, setHasCritical] = useState(false);
  const [hasHighPriority, setHasHighPriority] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  
  useNotificationTriggers();

  useEffect(() => {
    setIsVisible(true);
    
    const checkNotifications = () => {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      setHasCritical(notifications.some(n => !n.read && n.priority === 'critical'));
      setHasHighPriority(notifications.some(n => !n.read && (n.priority === 'critical' || n.priority === 'high')));
    };
    
    checkNotifications();
    
    const interval = setInterval(checkNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const recentTransactions = showAllTransactions 
    ? transactions.slice(0, 10) 
    : transactions.slice(0, 5);

  const toggleShowTransactions = () => {
    setShowAllTransactions(!showAllTransactions);
  };

  const getCategoryIcon = (category, amount) => {
    if (amount > 0) return 'bi-arrow-down-left text-green-400';
    
    const categoryIcons = {
      'food': 'bi-egg-fried',
      'shopping': 'bi-bag',
      'transport': 'bi-car-front',
      'entertainment': 'bi-controller',
      'bills': 'bi-receipt',
      'health': 'bi-heart-pulse',
      'education': 'bi-book',
      'travel': 'bi-airplane',
      'housing': 'bi-house',
      'salary': 'bi-cash-coin',
      'freelance': 'bi-laptop',
      'investment': 'bi-graph-up',
      'gift': 'bi-gift',
      'default': 'bi-wallet'
    };
    
    return categoryIcons[category?.toLowerCase()] || categoryIcons.default;
  };

  return (
    <div className="dashboard min-h-screen text-gray-50">
      <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto">
        <NotificationScheduler />
        
        {/* Header Section */}
        <div className={`dashboard-header animate-fade-in ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
          <div className="flex items-center">
            <div className="section-icon-oval shadow-lg animate-pulse-slow">
              <i className="bi bi-speedometer2 text-xl text-white"></i>
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white">
              Dashboard
              {hasCritical && (
                <span className="ml-2 md:ml-3 px-2 py-1 md:px-3 md:py-1 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] rounded-full text-xs md:text-sm font-semibold animate-pulse inline-flex items-center">
                  <i className="bi bi-exclamation-triangle me-1 text-white"></i>
                  <span className="hidden sm:inline">Attention Needed</span>
                  <span className="sm:hidden">Alert</span>
                </span>
              )}
            </h1>
          </div>
          
          <a 
            href="/notifications" 
            className="mt-4 md:mt-0 px-3 py-2 md:px-4 md:py-2 bg-[#0a192f] hover:bg-[#112240] rounded-lg transition-all duration-200 flex items-center border border-[#112240] hover:border-[#ff7b46] shadow-md hover:shadow-lg hover:shadow-orange-500/20 font-semibold group"
          >
            <i className="bi bi-bell-fill mr-3 text-white group-hover:animate-bell"></i>
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Alerts</span>
          </a>
        </div>
        
        {/* Alert Banner */}
        {hasHighPriority && (
          <div className={`alert-banner animate-fade-in ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700 delay-100`}>
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex items-center mb-2 sm:mb-0">
                <i className="bi bi-exclamation-triangle-fill text-xl md:text-2xl text-white mr-4"></i>
                <span className="text-white font-semibold text-sm md:text-base">
                  You have important notifications requiring attention.
                </span>
              </div>
              <a href="/notifications" className="ml-auto px-3 py-1 bg-white text-[#ff5252] rounded-md text-sm font-semibold hover:bg-gray-100 transition-colors shadow-md sm:mt-0 mt-2 sm:w-auto w-full text-center">
                View Now
              </a>
            </div>
          </div>
        )}
        
        {/* Summary Cards */}
        <div className={`summary-cards-container animate-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-700 delay-200`}>
          <SummaryCards 
            balance={totals.balance} 
            income={totals.income} 
            expenses={totals.expenses} 
          />
        </div>
        
        {/* Charts and Trackers Grid */}
        <div className={`dashboard-grid animate-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-700 delay-300`}>
          {/* Monthly Chart */}
          <div className="monthly-chart-container">
            <div className="chart-header">
              <div className="chart-title-section">
                <div className="chart-title-icon">
                  <i className="bi bi-graph-up text-xl text-white"></i>
                </div>
                <div className="chart-title-text">
                  <h2 className="chart-title">Monthly Overview</h2>
                  <p className="chart-subtitle">Income vs Expenses Analysis</p>
                </div>
              </div>
            </div>
            <MonthlyChart transactions={transactions} />
          </div>
          
          <div className="dashboard-right-column">
            {/* Budget Tracker */}
            <div className="budget-tracker-container">
              <div className="budget-header">
                <div className="budget-title-section">
                  <div className="budget-title-icon">
                    <i className="bi bi-piggy-bank text-xl text-white"></i>
                  </div>
                  <div className="budget-title-text">
                    <h2 className="budget-title">Budget Tracker</h2>
                    <p className="budget-subtitle">Manage your spending limits</p>
                  </div>
                </div>
              </div>
              <BudgetTracker />
            </div>
            
            {/* Goal Tracker */}
            <div className="goal-tracker-container">
              <div className="goal-header">
                <div className="goal-title-section">
                  <div className="goal-title-icon">
                    <i className="bi bi-bullseye text-xl text-white"></i>
                  </div>
                  <div className="goal-title-text">
                    <h2 className="goal-title">Goal Tracker</h2>
                    <p className="goal-subtitle">Achieve your financial goals</p>
                  </div>
                </div>
              </div>
              <GoalTracker />
            </div>
          </div>
        </div>
        
        {/* Recent Activity Section */}
        <div className={`recent-activity animate-fade-in-up ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-700 delay-400`}>
          <div className="recent-activity-header">
            <div className="recent-activity-title">
              <div className="section-icon-oval">
                <i className="bi bi-clock-history text-xl text-white"></i>
              </div>
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            </div>
            <div className="transaction-count">
              <i className="bi bi-list-check text-white mr-2"></i>
              <span className="text-sm text-gray-200">
                <span className="font-semibold text-white">{transactions.length}</span> total transaction{transactions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          {/* Transaction Summary Bar */}
          <div className="transaction-summary">
            <div className="transaction-summary-icon">
              <i className="bi bi-graph-up text-white text-xl"></i>
            </div>
            <div className="transaction-summary-content">
              <div className="transaction-summary-item">
                <i className="bi bi-arrow-up-circle text-green-400 mr-2"></i>
                <span className="text-gray-200 text-sm">Income:</span>
                <span className="text-green-400 font-semibold ml-1">{formatIndianCurrency(totals.income)}</span>
              </div>
              <div className="transaction-summary-item">
                <i className="bi bi-arrow-down-circle text-red-400 mr-2"></i>
                <span className="text-gray-200 text-sm">Expenses:</span>
                <span className="text-red-400 font-semibold ml-1">{formatIndianCurrency(totals.expenses)}</span>
              </div>
              <div className="transaction-summary-item">
                <i className="bi bi-wallet2 text-blue-400 mr-2"></i>
                <span className="text-gray-200 text-sm">Balance:</span>
                <span className={`font-semibold ml-1 ${totals.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatIndianCurrency(totals.balance)}
                </span>
              </div>
            </div>
            <div className="transaction-summary-button">
              <a 
                href="/transactions" 
                className="px-4 py-2 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] hover:from-[#ff6b6b] hover:to-[#ff9e6b] rounded-lg text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-orange-500/30 flex items-center justify-center"
              >
                <span>View All</span>
                <i className="bi bi-arrow-right ml-3 text-white"></i>
              </a>
            </div>
          </div>
          
          {/* Transactions List */}
          <div className="transactions-list">
            {recentTransactions.length > 0 ? (
              <>
                {recentTransactions.map((transaction, index) => (
                  <div 
                    key={transaction.id || index} 
                    className="transaction-item"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="transaction-content">
                      {/* Icon Container */}
                      <div className={`transaction-icon-container ${
                        transaction.amount > 0 
                          ? 'bg-green-600/90' 
                          : 'bg-red-600/90'
                      }`}>
                        <i className={`bi ${getCategoryIcon(transaction.category, transaction.amount)} text-white text-md`}></i>
                      </div>
                      
                      <div className="transaction-details">
                        <p className="transaction-title">{transaction.description || 'Unknown Transaction'}</p>
                        <div className="transaction-meta">
                          <span className="transaction-category">{transaction.category || 'Uncategorized'}</span>
                          <span className="transaction-date">
                            <i className="bi bi-calendar3 mr-2 opacity-70 text-white"></i>
                            {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'No date'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="transaction-amount">
                        <p className={`transaction-value ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatIndianCurrency(Math.abs(transaction.amount))}
                        </p>
                        <span className={`transaction-type ${
                          transaction.amount > 0 
                            ? 'bg-green-800/40 text-green-300' 
                            : 'bg-red-800/40 text-red-300'
                        }`}>
                          {transaction.amount > 0 ? 'Income' : 'Expense'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Show More/Less Button */}
                {transactions.length > 5 && (
                  <button 
                    onClick={toggleShowTransactions}
                    className="show-more-button group"
                  >
                    <span>{showAllTransactions ? 'Show Less' : `Show ${transactions.length - 5} More Transactions`}</span>
                    <i className={`bi ml-3 transition-transform duration-300 ${
                      showAllTransactions ? 'bi-chevron-up' : 'bi-chevron-down'
                    } text-white group-hover:scale-125`}></i>
                  </button>
                )}
              </>
            ) : (
              <div className="empty-state">
                <i className="bi bi-receipt text-white empty-state-icon"></i>
                <p className="empty-state-text">No transactions yet</p>
                <a href="/transactions" className="empty-state-link group">
                  Add your first transaction <i className="bi bi-arrow-right ml-3 text-white group-hover:translate-x-1 transition-transform"></i>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;