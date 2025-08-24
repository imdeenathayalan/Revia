// src/components/Finance/RecurringTransactionsList.jsx
import { Card, Badge, Button } from 'react-bootstrap';
import { useRecurring } from '../../context/RecurringContext';
import { formatIndianCurrency, formatDisplayDate } from '../../utils/storage';

function RecurringTransactionsList({ transactions }) {
  const { deleteRecurringTransaction } = useRecurring();

  const getFrequencyBadge = (frequency) => {
    const variants = {
      daily: 'primary',
      weekly: 'info',
      monthly: 'success',
      yearly: 'warning'
    };
    return variants[frequency] || 'secondary';
  };

  const getStatusBadge = (isActive, endDate) => {
    if (!isActive) return 'danger';
    if (endDate && new Date(endDate) < new Date()) return 'warning';
    return 'success';
  };

  if (transactions.length === 0) {
    return (
      <Card className="shadow-xl border border-maroon bg-grey-dark">
        <Card.Body className="p-8 text-center">
          <div className="text-6xl mb-4 text-maroon-light">
            <i className="bi bi-arrow-repeat"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Recurring Transactions</h3>
          <p className="text-white">
            Set up recurring transactions for bills, subscriptions, or regular income
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border border-maroon bg-grey-dark">
      <Card.Body className="p-6">
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 bg-grey-medium rounded-lg border border-maroon">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-semibold">{transaction.description}</h4>
                  <p className="text-white text-sm">
                    {formatIndianCurrency(Math.abs(transaction.amount))} • {transaction.category}
                  </p>
                  <p className="text-maroon-light text-sm">
                    Starts: {formatDisplayDate(new Date(transaction.startDate))}
                    {transaction.endDate && ` • Ends: ${formatDisplayDate(new Date(transaction.endDate))}`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge bg={getFrequencyBadge(transaction.frequency)} className="px-3 py-1">
                    {transaction.frequency}
                  </Badge>
                  <Badge bg={getStatusBadge(transaction.isActive, transaction.endDate)} className="px-3 py-1">
                    {transaction.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-white text-sm">
                  Next: {formatDisplayDate(new Date(transaction.nextDate))}
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteRecurringTransaction(transaction.id)}
                  className="px-3 py-1"
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

export default RecurringTransactionsList;