import { Button, Badge, Table } from 'react-bootstrap';
import { formatIndianCurrency } from '../../utils/storage.js';

function TransactionTable({ transactions, deleteTransaction }) {
  const formatAmount = (amount) => {
    const isIncome = amount > 0;
    const color = isIncome ? 'success' : 'danger';
    return (
      <Badge 
        bg={color} 
        className="px-3 py-2 rounded-full text-sm font-medium border border-gray-400"
      >
        <i className={`bi ${isIncome ? 'bi-arrow-up' : 'bi-arrow-down'} me-1`}></i>
        {formatIndianCurrency(Math.abs(amount))}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <div className="text-6xl mb-4">
          <i className="bi bi-receipt"></i>
        </div>
        <p className="text-lg mb-2 text-black">No transactions yet</p>
        <p className="text-gray-500">
          <i className="bi bi-plus-circle me-1"></i>
          Add your first transaction to get started!
        </p>
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive className="shadow-lg rounded-lg overflow-hidden bg-white">
      <thead className="bg-red-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-red-600">
            <i className="bi bi-calendar me-1"></i>
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-red-600">
            <i className="bi bi-text-paragraph me-1"></i>
            Description
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-red-600">
            <i className="bi bi-tag me-1"></i>
            Category
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-red-600">
            <i className="bi bi-currency-rupee me-1"></i>
            Amount
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider border-red-600">
            <i className="bi bi-gear me-1"></i>
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-red-600">
        {transactions.map(transaction => (
          <tr key={transaction.id} className="hover:bg-red-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black border-red-600">
              {formatDate(transaction.date)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black border-red-600">
              {transaction.description}
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-red-600">
              <Badge 
                bg="secondary" 
                className="px-2 py-1 rounded-full text-xs bg-gray-600 text-white border border-gray-500"
              >
                {transaction.category}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-red-600">
              {formatAmount(transaction.amount)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm border-red-600">
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => deleteTransaction(transaction.id)}
                className="px-3 py-1 rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
              >
                <i className="bi bi-trash me-1"></i>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default TransactionTable;