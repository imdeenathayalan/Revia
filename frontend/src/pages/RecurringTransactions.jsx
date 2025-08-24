// src/pages/RecurringTransactions.jsx
import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import RecurringTransactionForm from '../components/Finance/RecurringTransactionForm';
import RecurringTransactionsList from '../components/Finance/RecurringTransactionsList';
import { useRecurring } from '../context/RecurringContext';

function RecurringTransactions() {
  const [showForm, setShowForm] = useState(false);
  const { recurringTransactions } = useRecurring();

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-6 p-4 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <h1 className="text-2xl font-bold text-white m-0">
          <i className="bi bi-arrow-repeat me-3"></i>
          Recurring Transactions
        </h1>
        <Button 
          className="px-6 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white font-semibold border border-maroon"
          onClick={() => setShowForm(true)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Recurring Transaction
        </Button>
      </div>

      <RecurringTransactionsList transactions={recurringTransactions} />
      
      <RecurringTransactionForm 
        show={showForm}
        handleClose={() => setShowForm(false)}
      />
    </Container>
  );
}

export default RecurringTransactions;