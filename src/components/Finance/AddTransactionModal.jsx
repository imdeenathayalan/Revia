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
    <Modal show={show} onHide={handleClose} className="shadow-xl"> {/* Tailwind */}
      <Modal.Header closeButton className="border-b border-gray-200"> {/* Tailwind */}
        <Modal.Title className="text-xl font-semibold text-gray-800"> {/* Tailwind */}
          Add New Transaction
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-6"> {/* Tailwind */}
          {error && (
            <Alert variant="danger" className="mb-4 rounded-lg"> {/* Tailwind */}
              {error}
            </Alert>
          )}
          
          <Form.Group className="mb-4"> {/* Tailwind */}
            <Form.Label className="block text-sm font-medium text-gray-700 mb-2"> {/* Tailwind */}
              Description
            </Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Tailwind
            />
          </Form.Group>

          <Form.Group className="mb-4"> {/* Tailwind */}
            <Form.Label className="block text-sm font-medium text-gray-700 mb-2"> {/* Tailwind */}
              Amount
            </Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Tailwind
            />
          </Form.Group>

          <Form.Group className="mb-4"> {/* Tailwind */}
            <Form.Label className="block text-sm font-medium text-gray-700 mb-2"> {/* Tailwind */}
              Type
            </Form.Label>
            <Form.Select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Tailwind
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4"> {/* Tailwind */}
            <Form.Label className="block text-sm font-medium text-gray-700 mb-2"> {/* Tailwind */}
              Category
            </Form.Label>
            <Form.Select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" // Tailwind
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-200 px-6 py-4"> {/* Tailwind */}
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors" // Tailwind
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors" // Tailwind
          >
            Add Transaction
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddTransactionModal;