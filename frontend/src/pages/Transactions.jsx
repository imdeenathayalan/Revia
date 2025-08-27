import { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';
import { useFinance } from '../context/FinanceContext';
import { useSearch } from '../context/SearchContext';
import ReportFilters from '../components/Finance/ReportFilters';
import TransactionTable from '../components/Finance/TransactionTable';
import AddTransactionModal from '../components/Finance/AddTransactionModal';
import AdvancedSearchModal from '../components/Finance/AdvancedSearchModal';
import ConfirmationModal from '../components/UI/ConfirmationModal';
import { formatIndianCurrency, calculateTotals } from '../utils/storage';

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
    <Container>
      {/* Header Section with Search */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4 p-4 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <div>
          <h1 className="text-2xl font-bold text-white m-0">
            <i className="bi bi-currency-exchange me-3"></i>
            Transactions
          </h1>
          {activeFilters && (
            <div className="mt-2">
              <Badge bg="info" className="me-2">
                <i className="bi bi-search me-1"></i>
                Search Results
              </Badge>
              <Button
                variant="outline-light"
                size="sm"
                onClick={clearSearch}
              >
                <i className="bi bi-x me-1"></i>
                Clear Search
              </Button>
            </div>
          )}
        </div>
        
        <div className="d-flex gap-2">
          <Button 
            variant="outline-info"
            onClick={() => setShowAdvancedSearch(true)}
            className="px-4 py-2 rounded-lg border-2 border-info text-white hover:bg-info hover:border-info transition-colors"
          >
            <i className="bi bi-search me-2"></i>
            Advanced Search
          </Button>
          
          <Button 
            variant="maroon"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white border border-maroon"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Transaction
          </Button>
        </div>
      </div>

      <ReportFilters filters={filters} setFilters={setFilters} />

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon">
            <Card.Body className="p-3">
              <div className="text-2xl mb-2 text-white">
                <i className="bi bi-list-check"></i>
              </div>
              <Card.Title className="text-white text-sm mb-1">Total</Card.Title>
              <Card.Text className="text-xl font-bold text-white">
                {filteredTransactions.length}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon">
            <Card.Body className="p-3">
              <div className="text-2xl mb-2 text-success">
                <i className="bi bi-arrow-up-circle"></i>
              </div>
              <Card.Title className="text-white text-sm mb-1">Income</Card.Title>
              <Card.Text className="text-xl font-bold text-success">
                {formatIndianCurrency(totals.income)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon">
            <Card.Body className="p-3">
              <div className="text-2xl mb-2 text-danger">
                <i className="bi bi-arrow-down-circle"></i>
              </div>
              <Card.Title className="text-white text-sm mb-1">Expenses</Card.Title>
              <Card.Text className="text-xl font-bold text-danger">
                {formatIndianCurrency(totals.expenses)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 text-center border-0 shadow-lg bg-grey-dark border-maroon">
            <Card.Body className="p-3">
              <div className="text-2xl mb-2 text-white">
                <i className="bi bi-wallet2"></i>
              </div>
              <Card.Title className="text-white text-sm mb-1">Balance</Card.Title>
              <Card.Text className={`text-xl font-bold ${totals.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                {formatIndianCurrency(totals.balance)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <TransactionTable 
        transactions={filteredTransactions} 
        deleteTransaction={requestDelete} 
      />

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
    </Container>
  );
}

export default Transactions;