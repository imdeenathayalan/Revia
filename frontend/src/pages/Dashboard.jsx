import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import SummaryCards from '../components/Finance/SummaryCards.jsx';
import MonthlyChart from '../components/Finance/MonthlyChart.jsx';
import { getTransactions, calculateTotals, formatIndianCurrency } from '../utils/storage.js';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({ balance: 0, income: 0, expenses: 0 });

  useEffect(() => {
    const loadedTransactions = getTransactions();
    setTransactions(loadedTransactions);
    setTotals(calculateTotals(loadedTransactions));
  }, []);

  return (
    <Container>
      <h1 className="mb-6 text-3xl font-bold text-red-400">
        <i className="bi bi-speedometer2 me-3"></i>
        Dashboard
      </h1>
      <SummaryCards 
        balance={totals.balance} 
        income={totals.income} 
        expenses={totals.expenses} 
      />
      
      <MonthlyChart transactions={transactions} />
      
      <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg border border-red-700">
        <h2 className="text-xl font-semibold text-red-400 mb-3">
          <i className="bi bi-clock-history me-2"></i>
          Recent Activity
        </h2>
        <p className="text-gray-300">
          <i className="bi bi-list-check me-2"></i>
          You have {transactions.length} total transaction{transactions.length !== 1 ? 's' : ''}. 
          Go to the Transactions page to manage them.
        </p>
        {transactions.length > 0 && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg border border-red-800">
            <p className="text-sm text-gray-400">
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