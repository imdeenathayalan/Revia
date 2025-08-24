import { Button, Badge, Table } from 'react-bootstrap';
import { formatIndianCurrency, formatDisplayDate } from '../../utils/storage.js';

function TransactionTable({ transactions, deleteTransaction }) {
  const formatAmount = (amount) => {
    const isIncome = amount > 0;
    const color = isIncome ? 'success' : 'danger';
    return (
      <Badge 
        bg={color} 
        className="px-3 py-2 rounded-pill text-sm font-medium d-inline-flex align-items-center"
      >
        <i className={`bi ${isIncome ? 'bi-arrow-up' : 'bi-arrow-down'} me-1`}></i>
        {formatIndianCurrency(Math.abs(amount))}
      </Badge>
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-dark">
        <div className="text-6xl mb-4">
          <i className="bi bi-receipt"></i>
        </div>
        <p className="text-lg mb-2">No transactions yet</p>
        <p className="text-muted d-flex align-items-center justify-content-center">
          <i className="bi bi-plus-circle me-2"></i>
          Add your first transaction to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded overflow-hidden">
      <Table responsive className="mb-0">
        <thead className="bg-light">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-dark uppercase border-bottom border-end">
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar me-2"></i>
                Date
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-dark uppercase border-bottom border-end">
              <div className="d-flex align-items-center">
                <i className="bi bi-text-paragraph me-2"></i>
                Description
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-dark uppercase border-bottom border-end">
              <div className="d-flex align-items-center">
                <i className="bi bi-tag me-2"></i>
                Category
              </div>
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-dark uppercase border-bottom border-end">
              <div className="d-flex align-items-center">
                <i className="bi bi-currency-rupee me-2"></i>
                Amount
              </div>
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-dark uppercase border-bottom">
              <div className="d-flex align-items-center justify-content-center">
                <i className="bi bi-gear me-2"></i>
                Actions
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={transaction.id} className={index < transactions.length - 1 ? 'border-bottom' : ''}>
              <td className="px-4 py-3 align-middle border-end">
                <div className="text-sm text-dark">
                  {formatDisplayDate(transaction.date)}
                </div>
              </td>
              <td className="px-4 py-3 align-middle border-end">
                <div className="text-sm font-medium text-dark">
                  {transaction.description}
                </div>
              </td>
              <td className="px-4 py-3 align-middle border-end">
                <Badge 
                  bg="secondary" 
                  className="px-3 py-2 rounded-pill text-xs d-inline-flex align-items-center"
                >
                  {transaction.category}
                </Badge>
              </td>
              <td className="px-4 py-3 align-middle border-end">
                {formatAmount(transaction.amount)}
              </td>
              <td className="px-4 py-3 text-center align-middle">
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => deleteTransaction(transaction.id)}
                  className="px-3 py-2 rounded-pill d-inline-flex align-items-center"
                >
                  <i className="bi bi-trash me-2"></i>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default TransactionTable;