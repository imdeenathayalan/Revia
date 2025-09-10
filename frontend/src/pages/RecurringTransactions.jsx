import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import RecurringTransactionForm from '../components/Finance/RecurringTransactionForm';
import RecurringTransactionsList from '../components/Finance/RecurringTransactionsList';
import { useRecurring } from '../context/RecurringContext';
import './RecurringTransactions.css';

function RecurringTransactions() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { recurringTransactions } = useRecurring();

  // Handle loading and responsiveness
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto" style={{ minHeight: 'calc(100vh - 180px)' }}>
      <div className="recurring-header bg-gradient-to-br from-[#243447] to-[#141d26] shadow-lg border border-[#3a506b] p-4 mb-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
          <div className="flex items-center">
            <div className="icon-container w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mr-2 md:mr-3 bg-[#1a2530] rounded-full">
              <i className="bi bi-arrow-repeat text-[#ff5252] text-base md:text-lg"></i>
            </div>
            <h1 className="text-base md:text-lg font-semibold text-white m-0 font-poppins">
              Recurring Transactions
              {recurringTransactions.length > 0 && (
                <span className="ml-2 md:ml-3 badge bg-gradient-to-r from-[#ff5252] to-[#ff7b46] text-white text-xs font-semibold px-2 py-0.5 rounded-full pulse">
                  {recurringTransactions.length} Active
                </span>
              )}
            </h1>
          </div>
          <Button 
            className="w-full md:w-auto px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-[#ff5252] to-[#ff7b46] hover:from-[#ff7b46] hover:to-[#ff5252] text-white font-semibold border-0 transition-all duration-300 flex items-center justify-center add-recurring-btn font-poppins mt-2 md:mt-0 text-sm md:text-base"
            onClick={handleShowForm}
          >
            <i className="bi bi-plus-circle mr-1 text-sm md:text-base"></i>
            {isMobile ? 'Add New' : 'Add Recurring Transaction'}
          </Button>
        </div>
        <p className="text-gray-200 mt-2 mb-0 font-poppins font-medium text-xs md:text-sm">
          Automate your finances with scheduled transactions that occur regularly. Set it once and forget about it!
        </p>
      </div>

      {isLoading ? (
        <div className="loading-container bg-[#2c3e50] p-4 md:p-5 flex justify-center items-center" style={{ height: '300px' }}>
          <div className="loading-spinner text-center">
            <div className="spinner-grow text-[#ff5252]" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-white text-sm md:text-base font-medium font-poppins">Loading your recurring transactions...</p>
            <p className="text-gray-200 mt-1.5 font-poppins font-medium text-xs md:text-sm">
              This will only take a moment
            </p>
          </div>
        </div>
      ) : (
        <>
          {recurringTransactions.length > 0 ? (
            <div className="transactions-summary bg-[#2c3e50] p-3 md:p-4 mb-4 md:mb-5 border border-[#3a506b]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                <h3 className="text-white font-semibold text-base md:text-lg mb-1 md:mb-0 font-poppins">Your Scheduled Transactions</h3>
                <span className="text-[#ff7b46] text-xs font-medium font-poppins">
                  Sorted by next occurrence
                </span>
              </div>
              <p className="text-gray-200 mb-0 font-poppins font-medium text-xs md:text-sm">
                These transactions will be processed automatically based on their schedule
              </p>
            </div>
          ) : null}
          
          <RecurringTransactionsList transactions={recurringTransactions} />
          
          {recurringTransactions.length === 0 && !isLoading && (
            <div className="empty-state-guide mt-5 md:mt-6 bg-[#2c3e50] p-4 md:p-5 border border-[#3a506b]">
              <h4 className="text-[#ff7b46] font-semibold mb-3 text-base md:text-lg font-poppins">Getting Started with Recurring Transactions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 h-full">
                <div className="guide-item bg-gradient-to-br from-[#243447] to-[#141d26] p-3 md:p-4 h-full transition-all duration-300 border border-[#3a506b] flex flex-col">
                  <div className="icon-container w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-3 bg-gradient-to-br from-[#ff5252]/20 to-[#ff7b46]/20 rounded-full border border-[#ff5252]/30 relative">
                    <i className="bi bi-lightning-charge-fill text-[#ff5252] text-lg md:text-xl"></i>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff5252]/10 to-[#ff7b46]/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </div>
                  <h5 className="text-white font-medium mb-1.5 text-sm md:text-base font-poppins">Save Time</h5>
                  <p className="text-gray-200 text-xs mb-0 font-poppins font-medium flex-grow">
                    Automate regular payments and avoid manual entry each time
                  </p>
                </div>
                <div className="guide-item bg-gradient-to-br from-[#243447] to-[#141d26] p-3 md:p-4 h-full transition-all duration-300 border border-[#3a506b] flex flex-col">
                  <div className="icon-container w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-3 bg-gradient-to-br from-[#00CEC9]/20 to-[#00a6a3]/20 rounded-full border border-[#00CEC9]/30 relative">
                    <i className="bi bi-calendar-check-fill text-[#00CEC9] text-lg md:text-xl"></i>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00CEC9]/10 to-[#00a6a3]/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </div>
                  <h5 className="text-white font-medium mb-1.5 text-sm md:text-base font-poppins">Never Forget</h5>
                  <p className="text-gray-200 text-xs mb-0 font-poppins font-medium flex-grow">
                    Ensure bills and subscriptions are always paid on time
                  </p>
                </div>
                <div className="guide-item bg-gradient-to-br from-[#243447] to-[#141d26] p-3 md:p-4 h-full transition-all duration-300 border border-[#3a506b] flex flex-col">
                  <div className="icon-container w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-3 bg-gradient-to-br from-[#3498db]/20 to-[#2980b9]/20 rounded-full border border-[#3498db]/30 relative">
                    <i className="bi bi-graph-up-arrow text-[#3498db] text-lg md:text-xl"></i>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3498db]/10 to-[#2980b9]/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </div>
                  <h5 className="text-white font-medium mb-1.5 text-sm md:text-base font-poppins">Track Patterns</h5>
                  <p className="text-gray-200 text-xs mb-0 font-poppins font-medium flex-grow">
                    Understand your spending habits with scheduled transactions
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      <RecurringTransactionForm 
        show={showForm}
        handleClose={handleCloseForm}
      />
    </div>
  );
}

export default RecurringTransactions;