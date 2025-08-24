import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { indianCategories } from '../../utils/storage.js';

function AddTransactionModal({ show, handleClose, addTransaction }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: ''
  });
  const [error, setError] = useState('');

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
      category: formData.category || 'Other Expense',
      date: new Date().toLocaleDateString('en-IN')
    };

    addTransaction(transaction);
    handleClose();
    setFormData({ description: '', amount: '', type: 'expense', category: '' });
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} className="shadow-xl">
      <Modal.Header closeButton className="border-b border-maroon bg-white">
        <Modal.Title className="text-xl font-semibold text-black">
          <i className="bi bi-plus-circle me-2"></i>
          Add New Transaction
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-6 bg-white">
          {error && (
            <Alert variant="danger" className="mb-4 rounded-lg bg-red-100 border-maroon text-red-800">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}
          
          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-black mb-2">
              <i className="bi bi-text-paragraph me-2"></i>
              Description
            </Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description (e.g., Groceries, Salary, etc.)"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-black mb-2">
              <i className="bi bi-currency-rupee me-2"></i>
              Amount (₹)
            </Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount in rupees"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-black mb-2">
              <i className="bi bi-arrow-left-right me-2"></i>
              Type
            </Form.Label>
            <Form.Select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:border-maroon focus:ring-2 focus:ring-maroon"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-black mb-2">
              <i className="bi bi-tag me-2"></i>
              Category
            </Form.Label>
            <Form.Select 
              name="category" 
              value={formData.category} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:border-maroon focus:ring-2 focus:ring-maroon"
            >
              <option value="">Select category</option>
              {indianCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-t border-maroon px-6 py-4 bg-white">
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-gray-400 text-black hover:bg-gray-100 transition-colors"
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancel
          </Button>
          <Button 
            className="px-4 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white border border-maroon transition-colors"
            type="submit"
          >
            <i className="bi bi-check-circle me-2"></i>
            Add Transaction
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddTransactionModal;