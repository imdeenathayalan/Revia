import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import SummaryCards from '../components/Finance/SummaryCards.jsx';
import MonthlyChart from '../components/Finance/MonthlyChart.jsx';
import { getTransactions, calculateTotals } from '../utils/storage.js';

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
      <h1 className="mb-6 text-3xl font-bold text-gray-800">Dashboard</h1> {/* Tailwind */}
      <SummaryCards 
        balance={totals.balance} 
        income={totals.income} 
        expenses={totals.expenses} 
      />
      
      <MonthlyChart transactions={transactions} />
      
      <div className="mt-8 p-6 bg-white rounded-lg shadow-lg"> {/* Tailwind */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent Activity</h2> {/* Tailwind */}
        <p className="text-gray-600"> {/* Tailwind */}
          You have {transactions.length} total transaction{transactions.length !== 1 ? 's' : ''}. 
          Go to the Transactions page to manage them.
        </p>
        {transactions.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg"> {/* Tailwind */}
            <p className="text-sm text-gray-500"> {/* Tailwind */}
              <strong>Latest transaction:</strong> {transactions[0]?.description} - 
              ${Math.abs(transactions[0]?.amount).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}

export default Dashboard;