import { Button, Badge, Table } from 'react-bootstrap';

function TransactionTable({ transactions, deleteTransaction }) {
  const formatAmount = (amount) => {
    const isIncome = amount > 0;
    const color = isIncome ? 'success' : 'danger';
    const sign = isIncome ? '+' : '-';
    return (
      <Badge 
        bg={color} 
        className="px-3 py-2 rounded-full text-sm font-medium border border-gray-600"
      >
        {sign}${Math.abs(amount).toFixed(2)}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-lg mb-2 text-gray-300">No transactions yet</p>
        <p className="text-gray-500">Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive className="shadow-lg rounded-lg overflow-hidden bg-gray-800 text-white">
      <thead className="bg-gray-900">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-red-400 uppercase tracking-wider border-red-700">Date</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-red-400 uppercase tracking-wider border-red-700">Description</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-red-400 uppercase tracking-wider border-red-700">Category</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-red-400 uppercase tracking-wider border-red-700">Amount</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-red-400 uppercase tracking-wider border-red-700">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-gray-800 divide-y divide-red-700">
        {transactions.map(transaction => (
          <tr key={transaction.id} className="hover:bg-gray-700 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 border-red-700">
              {formatDate(transaction.date)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 border-red-700">
              {transaction.description}
            </td>
            <td className="px-6 py-4 whitespace-nowrap border-red-700">
              <Badge 
                bg="secondary" 
                className="px-2 py-1 rounded-full text-xs bg-gray-600 text-white border border-gray-500"
              >
                {transaction.category}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-red-700">
              {formatAmount(transaction.amount)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm border-red-700">
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => deleteTransaction(transaction.id)}
                className="px-3 py-1 rounded-lg border border-red-600 text-red-300 hover:bg-red-700 hover:text-white transition-colors"
              >
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