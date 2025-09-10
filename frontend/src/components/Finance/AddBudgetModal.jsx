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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.category || !formData.amount) {
      setError('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      setIsSubmitting(false);
      return;
    }

    // Check if budget already exists for this category
    if (budgets.some(b => b.category === formData.category)) {
      setError('Budget already exists for this category');
      setIsSubmitting(false);
      return;
    }

    try {
      await createBudget({
        category: formData.category,
        amount: amount,
        period: formData.period
      });

      setFormData({ category: '', amount: '', period: 'monthly' });
      handleClose();
      setError('');
    } catch (err) {
      setError('Failed to create budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      centered
      className="rounded-lg shadow-2xl"
      size="lg"
    >
      <Modal.Header 
        closeButton 
        className="border-b border-navy bg-white px-6 py-4 rounded-t-lg"
      >
        <Modal.Title className="text-xl font-bold text-navy flex items-center">
          <i className="bi bi-piggy-bank-fill text-gold mr-2 text-xl"></i>
          Create New Budget
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-6 bg-grey-lighter">
          {error && (
            <Alert 
              variant="danger" 
              className="mb-4 rounded-lg bg-red-50 border border-danger-light text-danger flex items-center"
            >
              <i className="bi bi-exclamation-triangle-fill mr-2"></i>
              {error}
            </Alert>
          )}
          
          <div className="space-y-4">
            <Form.Group className="mb-4">
              <Form.Label className="block text-sm font-semibold text-navy mb-2 flex items-center">
                <i className="bi bi-tag-fill text-gold mr-2"></i>
                Category
              </Form.Label>
              <Form.Select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                className="w-full p-3 border border-grey-medium rounded-lg bg-white text-navy focus:border-gold focus:ring-2 focus:ring-gold-light transition-colors duration-200"
                required
              >
                <option value="">Select a category</option>
                {expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="block text-sm font-semibold text-navy mb-2 flex items-center">
                <i className="bi bi-currency-rupee text-gold mr-2"></i>
                Budget Amount (₹)
              </Form.Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-grey-medium">
                  ₹
                </span>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  className="w-full pl-8 p-3 border border-grey-medium rounded-lg bg-white text-navy placeholder-grey-medium focus:border-gold focus:ring-2 focus:ring-gold-light transition-colors duration-200"
                  required
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="block text-sm font-semibold text-navy mb-2 flex items-center">
                <i className="bi bi-calendar-week text-gold mr-2"></i>
                Budget Period
              </Form.Label>
              <div className="grid grid-cols-3 gap-2">
                {['weekly', 'monthly', 'yearly'].map(period => (
                  <div key={period} className="relative">
                    <input
                      type="radio"
                      id={period}
                      name="period"
                      value={period}
                      checked={formData.period === period}
                      onChange={handleChange}
                      className="hidden peer"
                    />
                    <label 
                      htmlFor={period}
                      className={`flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer transition-all duration-200
                        ${formData.period === period 
                          ? 'border-gold bg-gold-light/10 text-navy font-medium' 
                          : 'border-grey-medium bg-white text-grey-medium hover:border-gold-light'
                        }`}
                    >
                      <span className="text-sm capitalize">{period}</span>
                    </label>
                  </div>
                ))}
              </div>
            </Form.Group>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="border-t border-grey-light px-6 py-4 bg-white rounded-b-lg">
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-grey-medium text-navy hover:bg-grey-lighter transition-colors duration-200 flex items-center"
            disabled={isSubmitting}
          >
            <i className="bi bi-x-circle mr-2"></i>
            Cancel
          </Button>
          <Button 
            className="px-4 py-2 rounded-lg bg-navy hover:bg-navy/90 text-white border border-navy transition-colors duration-200 flex items-center disabled:opacity-75 disabled:cursor-not-allowed"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle mr-2"></i>
                Create Budget
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddBudgetModal;