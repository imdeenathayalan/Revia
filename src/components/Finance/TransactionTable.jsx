import { Button, Badge, Table } from 'react-bootstrap';

function TransactionTable({ transactions, deleteTransaction }) {
  const formatAmount = (amount) => {
    const isIncome = amount > 0;
    const color = isIncome ? 'success' : 'danger';
    const sign = isIncome ? '+' : '-';
    return (
      <Badge 
        bg={color} 
        className="px-3 py-2 rounded-full text-sm font-medium" // Tailwind
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
      <div className="text-center py-12 text-gray-500"> {/* Tailwind */}
        <div className="text-6xl mb-4">📊</div> {/* Tailwind */}
        <p className="text-lg mb-2">No transactions yet</p> {/* Tailwind */}
        <p className="text-gray-400">Add your first transaction to get started!</p> {/* Tailwind */}
      </div>
    );
  }

  return (
    <Table striped bordered hover responsive className="shadow-lg rounded-lg overflow-hidden"> {/* Tailwind */}
      <thead className="bg-gray-50"> {/* Tailwind */}
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th> {/* Tailwind */}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th> {/* Tailwind */}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th> {/* Tailwind */}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th> {/* Tailwind */}
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> {/* Tailwind */}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200"> {/* Tailwind */}
        {transactions.map(transaction => (
          <tr key={transaction.id} className="hover:bg-gray-50 transition-colors"> {/* Tailwind */}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> {/* Tailwind */}
              {formatDate(transaction.date)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"> {/* Tailwind */}
              {transaction.description}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge 
                bg="secondary" 
                className="px-2 py-1 rounded-full text-xs" // Tailwind
              >
                {transaction.category}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"> {/* Tailwind */}
              {formatAmount(transaction.amount)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm"> {/* Tailwind */}
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={() => deleteTransaction(transaction.id)}
                className="px-3 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors" // Tailwind
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