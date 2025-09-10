import { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { useRecurring } from '../../context/RecurringContext';
import './RecurringTransactionsList.css'; // Import our enhanced CSS

function RecurringTransactionsList({ transactions }) {
  const [expandedId, setExpandedId] = useState(null);
  const { deleteRecurringTransaction } = useRecurring();

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format frequency to be more readable
  const formatFrequency = (frequency) => {
    const frequencyMap = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly'
    };
    return frequencyMap[frequency] || frequency;
  };

  if (transactions.length === 0) {
    return (
      <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto">
        <Card className="recurring-empty-state bg-gradient-to-br from-[#243447] to-[#141d26] border-[#3a506b]">
          <Card.Body className="empty-state-content">
            <i className="bi bi-arrow-repeat empty-state-icon"></i>
            <h3 className="font-poppins font-semibold text-white">No Recurring Transactions Yet</h3>
            <p className="font-poppins font-medium text-gray-300">Set up your first recurring transaction to automate your finances</p>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto recurring-list">
      {transactions.map((transaction, index) => (
        <Card 
          key={transaction.id} 
          className={`recurring-item ${expandedId === transaction.id ? 'expanded' : ''} bg-gradient-to-br from-[#243447] to-[#141d26] border-[#3a506b] shadow-lg`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Card.Body className="recurring-item-body">
            <div className="recurring-item-header">
              <div className="recurring-item-info">
                <div className={`icon-container ${transaction.amount >= 0 ? 'income' : 'expense'}`}>
                  <i className={`bi ${transaction.amount >= 0 ? 'bi-arrow-down-right' : 'bi-arrow-up-right'}`}></i>
                </div>
                <div className="recurring-details">
                  <h5 className="recurring-title font-poppins font-semibold text-white">{transaction.description}</h5>
                  <div className="recurring-meta">
                    <span className={`amount-badge ${transaction.amount >= 0 ? 'income' : 'expense'} font-poppins font-semibold`}>
                      {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <span className="frequency-badge font-poppins font-medium text-blue-300">
                      <i className="bi bi-arrow-repeat me-1"></i>
                      {formatFrequency(transaction.frequency)}
                    </span>
                    <span className="next-date font-poppins font-medium text-gray-300">
                      <i className="bi bi-calendar me-1"></i>
                      Next: {formatDate(transaction.nextDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="recurring-actions">
                <Button 
                  variant="outline-light" 
                  size="sm"
                  onClick={() => toggleExpand(transaction.id)}
                  className="expand-btn border-[#3a506b] font-poppins font-semibold text-gray-300 hover:text-white"
                >
                  <i className={`bi ${expandedId === transaction.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </Button>
              </div>
            </div>
            
            {expandedId === transaction.id && (
              <div className="expandable-content">
                <div className="expanded-details">
                  <div className="detail-column">
                    <p className="detail-item font-poppins font-medium text-gray-200"><strong className="font-semibold text-gray-300">Category:</strong> {transaction.category}</p>
                    <p className="detail-item font-poppins font-medium text-gray-200"><strong className="font-semibold text-gray-300">Started:</strong> {formatDate(transaction.startDate)}</p>
                  </div>
                  <div className="detail-column">
                    <p className="detail-item font-poppins font-medium text-gray-200"><strong className="font-semibold text-gray-300">Account:</strong> {transaction.account}</p>
                    {transaction.endDate && (
                      <p className="detail-item font-poppins font-medium text-gray-200"><strong className="font-semibold text-gray-300">Ends:</strong> {formatDate(transaction.endDate)}</p>
                    )}
                  </div>
                </div>
                <div className="action-buttons">
                  <Button variant="outline-warning" size="sm" className="edit-btn font-poppins font-semibold text-amber-400 border-amber-400 hover:bg-amber-400/10">
                    <i className="bi bi-pencil me-1"></i> Edit
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => deleteRecurringTransaction(transaction.id)}
                    className="delete-btn font-poppins font-semibold text-rose-400 border-rose-400 hover:bg-rose-400/10"
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default RecurringTransactionsList;