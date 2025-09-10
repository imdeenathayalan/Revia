import { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
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
    <Modal show={show} onHide={handleClose} size="lg" centered className="border-0">
      <Modal.Header closeButton className="bg-gray-800 border-b border-maroon-600 p-4">
        <Modal.Title className="text-white font-semibold text-xl">
          <i className="bi bi-piggy-bank-fill me-2 text-maroon-400"></i>
          Create New Budget
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-gray-800 text-white p-5">
          {error && (
            <Alert variant="danger" className="bg-red-900 border border-red-700 text-red-200 rounded-lg mb-4">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}
          
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-tag-fill text-maroon-400 me-2"></i>
                  Category *
                </Form.Label>
                <div className="relative">
                  <Form.Select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {expenseCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                  <i className="bi bi-tag-fill text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-currency-rupee text-maroon-400 me-2"></i>
                  Budget Amount (₹) *
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="1"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                    required
                  />
                  <i className="bi bi-currency-rupee text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-calendar-week text-maroon-400 me-2"></i>
                  Budget Period
                </Form.Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['weekly', 'monthly', 'yearly'].map(period => (
                    <div key={period} className="relative">
                      <Form.Check
                        type="radio"
                        id={`period-${period}`}
                        name="period"
                        value={period}
                        checked={formData.period === period}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <label
                        htmlFor={`period-${period}`}
                        className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                          formData.period === period
                            ? 'bg-maroon-900 border-maroon-500 text-white'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <i className={`bi bi-calendar-week me-2 ${
                          formData.period === period ? 'text-maroon-300' : 'text-gray-400'
                        }`}></i>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer className="bg-gray-800 border-t border-gray-700 p-4">
          <Button 
            variant="outline-secondary" 
            onClick={handleClose} 
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 rounded-lg bg-maroon-600 border-maroon-600 hover:bg-maroon-700 hover:border-maroon-700 transition-colors"
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
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