import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function AddTransactionModal({ show, handleClose, addTransaction }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: ''
  });
  const [error, setError] = useState('');

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Salary', 'Other'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount) {
      setError('Please fill in all fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount)) {
      setError('Please enter a valid amount');
      return;
    }

    const transaction = {
      id: Date.now(),
      description: formData.description,
      amount: formData.type === 'income' ? amount : -amount,
      category: formData.category || 'Other',
      date: new Date().toISOString().split('T')[0]
    };

    addTransaction(transaction);
    handleClose();
    setFormData({ description: '', amount: '', type: 'expense', category: '' });
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} className="shadow-2xl" contentClassName="bg-gray-800 text-white"> {/* Dark theme */}
      <Modal.Header closeButton className="border-b border-red-700 bg-gray-900"> {/* Dark header */}
        <Modal.Title className="text-xl font-semibold text-red-400"> {/* Dark red title */}
          Add New Transaction
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-6 bg-gray-800"> {/* Dark background */}
          {error && (
            <Alert variant="danger" className="mb-4 rounded-lg bg-red-900 border-red-700 text-red-200"> {/* Dark red alert */}
              {error}
            </Alert>
          )}
          
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-gray-300 mb-2"> {/* Light gray text */}
              Description
            </Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full p-3 border border-red-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent" // Dark inputs
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              className="w-full p-3 border border-red-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </Form.Label>
            <Form.Select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full p-3 border border-red-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </Form.Label>
            <Form.Select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full p-3 border border-red-700 rounded-lg bg-gray-700 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-t border-red-700 px-6 py-4 bg-gray-900"> {/* Dark footer */}
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            type="submit"
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors border border-red-700"
          >
            Add Transaction
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddTransactionModal;