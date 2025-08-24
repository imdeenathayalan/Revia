import { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import AddTransactionModal from '../components/Finance/AddTransactionModal.jsx';
import TransactionTable from '../components/Finance/TransactionTable.jsx';
import ConfirmationModal from '../components/UI/ConfirmationModal.jsx';
import { useFinance } from '../context/FinanceContext.jsx';

function Transactions() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { transactions, addTransaction, deleteTransaction } = useFinance();

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
      <div className="d-flex justify-content-between align-items-center mb-6 p-4 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <h1 className="text-2xl font-bold text-white m-0">
          <i className="bi bi-currency-exchange me-3"></i>
          Transactions
        </h1>
        <Button 
          className="px-6 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white font-semibold transition-colors border border-maroon"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Transaction
        </Button>
      </div>

      <TransactionTable 
        transactions={transactions} 
        deleteTransaction={requestDelete} 
      />

      <AddTransactionModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        addTransaction={addTransaction}
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