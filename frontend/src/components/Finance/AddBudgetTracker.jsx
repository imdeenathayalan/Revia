// src/components/Finance/AddBudgetModal.jsx
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useBudget } from '../../context/BudgetContext';
import { indianCategories } from '../../utils/storage';

function AddBudgetModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  const [error, setError] = useState('');
  const { createBudget, budgets } = useBudget();

  const expenseCategories = indianCategories.filter(cat => 
    !cat.toLowerCase().includes('income') && cat !== 'Other Income'
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) {
      setError('Please fill in all fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Check if budget already exists for this category
    if (budgets.some(b => b.category === formData.category)) {
      setError('Budget already exists for this category');
      return;
    }

    createBudget({
      category: formData.category,
      amount: amount,
      period: formData.period
    });

    setFormData({ category: '', amount: '', period: 'monthly' });
    handleClose();
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} className="shadow-xl">
      <Modal.Header closeButton className="border-b border-maroon bg-white">
        <Modal.Title className="text-xl font-semibold text-black">
          <i className="bi bi-piggy-bank me-2"></i>
          Create New Budget
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
              {expenseCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-black mb-2">
              <i className="bi bi-currency-rupee me-2"></i>
              Budget Amount (₹)
            </Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter budget amount"
              step="0.01"
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-black mb-2">
              <i className="bi bi-calendar me-2"></i>
              Budget Period
            </Form.Label>
            <Form.Select 
              name="period" 
              value={formData.period} 
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:border-maroon focus:ring-2 focus:ring-maroon"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
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
            Create Budget
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddBudgetModal;