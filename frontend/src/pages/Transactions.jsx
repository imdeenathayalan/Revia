import { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import AddTransactionModal from '../components/Finance/AddTransactionModal.jsx';
import TransactionTable from '../components/Finance/TransactionTable.jsx';
import ConfirmationModal from '../components/UI/ConfirmationModal.jsx';
import { getTransactions, saveTransactions } from '../utils/storage.js';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setTransactions(getTransactions());
  }, []);

  const addTransaction = (newTransaction) => {
    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
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
      const updatedTransactions = transactions.filter(t => t.id !== transactionToDelete.id);
      setTransactions(updatedTransactions);
      saveTransactions(updatedTransactions);
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
      <div className="d-flex justify-content-between align-items-center mb-6 p-4 bg-gray-800 rounded-lg shadow-lg border border-red-700">
        <h1 className="text-2xl font-bold text-red-400 m-0">
          <i className="bi bi-currency-exchange me-3"></i>
          Transactions
        </h1>
        <Button 
          variant="danger" 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors border border-red-700"
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
        message={transactionToDelete ? `Are you sure you want to delete "${transactionToDelete.description}"?` : "Are you sure you want to delete this transaction?"}
        confirmText="Delete"
        variant="danger"
      />
    </Container>
  );
}

export default Transactions;