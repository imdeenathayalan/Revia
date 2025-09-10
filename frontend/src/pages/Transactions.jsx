import { useState, useMemo } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { useFinance } from '../context/FinanceContext';
import { useSearch } from '../context/SearchContext';
import ReportFilters from '../components/Finance/ReportFilters';
import TransactionTable from '../components/Finance/TransactionTable';
import AddTransactionModal from '../components/Finance/AddTransactionModal';
import AdvancedSearchModal from '../components/Finance/AdvancedSearchModal';
import ConfirmationModal from '../components/UI/ConfirmationModal';
import { formatIndianCurrency, calculateTotals } from '../utils/storage';
import './Transactions.css'; 

function Transactions() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [activeFilters, setActiveFilters] = useState(null);
  
  const { transactions, addTransaction, deleteTransaction } = useFinance();
  const { searchTransactions } = useSearch();

  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    categories: [],
    type: 'all'
  });

  const displayedTransactions = searchResults || transactions;

  const filteredTransactions = useMemo(() => {
    let filtered = displayedTransactions;

    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= filters.startDate && 
               transactionDate <= filters.endDate;
      });
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(transaction => 
        filters.categories.includes(transaction.category)
      );
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(transaction => 
        filters.type === 'income' ? transaction.amount > 0 : transaction.amount < 0
      );
    }

    return filtered;
  }, [displayedTransactions, filters]);

  const totals = useMemo(() => calculateTotals(filteredTransactions), [filteredTransactions]);

  const handleSearchResults = (results, filters) => {
    setSearchResults(results);
    setActiveFilters(filters);
  };

  const clearSearch = () => {
    setSearchResults(null);
    setActiveFilters(null);
  };

  const requestDelete = (id) => {
    const transaction = transactions.find(t => t.id === id);
    setTransactionToDelete(transaction);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (transactionToDelete) {
      setIsDeleting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
      setIsDeleting(false);
    }
    setShowConfirmModal(false);
  };

  const cancelDelete = () => {
    setTransactionToDelete(null);
    setShowConfirmModal(false);
    setIsDeleting(false);
  };

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto min-h-screen bg-gradient-to-br from-[#0a192f] to-[#020c1b] py-6">
      {/* Header Section with Search */}
      <div className="w-full mb-8 animate-slide-down">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-poppins font-semibold text-white mb-2 flex items-center">
              <i className="bi bi-currency-exchange me-3 text-[#ff7b46]"></i>
              Transactions
            </h1>
            {activeFilters && (
              <div className="flex items-center animate-fade-in mt-2 flex-wrap gap-2">
                <Badge className="bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 text-white font-poppins font-semibold px-3 py-2">
                  <i className="bi bi-search me-1"></i>
                  Search Results
                </Badge>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={clearSearch}
                  className="border-[#3a506b] text-gray-200 hover:bg-[#3a506b] font-poppins font-semibold"
                >
                  <i className="bi bi-x me-1"></i>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <Button 
              variant="outline-info"
              onClick={() => setShowAdvancedSearch(true)}
              className="border-[#3a506b] text-gray-200 hover:bg-[#3a506b] font-poppins font-semibold flex items-center justify-center"
            >
              <i className="bi bi-search me-2"></i>
              Advanced Search
            </Button>
            
            <Button 
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 font-poppins font-semibold hover:brightness-110 flex items-center justify-center"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Transaction
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full mb-8">
        <ReportFilters filters={filters} setFilters={setFilters} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <div className="summary-card animate-fade-in">
          <div className="text-[#ff7b46] mb-3 flex justify-center">
            <i className="bi bi-list-check text-3xl"></i>
          </div>
          <h3 className="font-poppins font-semibold text-gray-200 mb-2 text-lg">Total Transactions</h3>
          <p className="font-poppins font-semibold text-white text-2xl">
            {filteredTransactions.length}
          </p>
        </div>
        
        <div className="summary-card animate-fade-in delay-100">
          <div className="text-green-400 mb-3 flex justify-center">
            <i className="bi bi-arrow-up-circle text-3xl"></i>
          </div>
          <h3 className="font-poppins font-semibold text-gray-200 mb-2 text-lg">Income</h3>
          <p className="font-poppins font-semibold text-green-400 text-2xl">
            {formatIndianCurrency(totals.income)}
          </p>
        </div>
        
        <div className="summary-card animate-fade-in delay-200">
          <div className="text-red-400 mb-3 flex justify-center">
            <i className="bi bi-arrow-down-circle text-3xl"></i>
          </div>
          <h3 className="font-poppins font-semibold text-gray-200 mb-2 text-lg">Expenses</h3>
          <p className="font-poppins font-semibold text-red-400 text-2xl">
            {formatIndianCurrency(totals.expenses)}
          </p>
        </div>
        
        <div className="summary-card animate-fade-in delay-300">
          <div className="text-blue-400 mb-3 flex justify-center">
            <i className="bi bi-wallet2 text-3xl"></i>
          </div>
          <h3 className="font-poppins font-semibold text-gray-200 mb-2 text-lg">Balance</h3>
          <p className={`font-poppins font-semibold text-2xl ${totals.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatIndianCurrency(totals.balance)}
          </p>
        </div>
      </div>

      <div className="w-full animate-fade-in">
        <TransactionTable 
          transactions={filteredTransactions} 
          deleteTransaction={requestDelete} 
        />
      </div>

      <AddTransactionModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        addTransaction={addTransaction}
      />

      <AdvancedSearchModal
        show={showAdvancedSearch}
        handleClose={() => setShowAdvancedSearch(false)}
        onSearchResults={handleSearchResults}
      />

      <ConfirmationModal
        show={showConfirmModal}
        onHide={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message={transactionToDelete ? `Are you sure you want to delete "${transactionToDelete.description}"? This action cannot be undone.` : "Are you sure you want to delete this transaction?"}
        confirmText="Delete"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default Transactions;