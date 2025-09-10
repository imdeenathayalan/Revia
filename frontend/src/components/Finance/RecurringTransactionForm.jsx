import { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useRecurring } from '../../context/RecurringContext';
import { indianCategories } from '../../utils/storage';

function RecurringTransactionForm({ show, handleClose }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    frequency: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });
  const [error, setError] = useState('');
  const { addRecurringTransaction } = useRecurring();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount) {
      setError('Please fill in description and amount');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    addRecurringTransaction({
      description: formData.description,
      amount: formData.type === 'income' ? amount : -amount,
      category: formData.category || 'Other Expense',
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || null
    });

    handleClose();
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="shadow-xl w-full px-4 xl:px-6 2xl:px-8 mx-auto">
      <Modal.Header closeButton className="border-b border-[#3a506b] bg-[#2c3e50]">
        <Modal.Title className="text-xl font-semibold text-white font-poppins">
          <i className="bi bi-arrow-repeat me-2"></i>
          Add Recurring Transaction
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="p-6 bg-[#2c3e50]">
          {error && (
            <Alert variant="danger" className="mb-4 rounded-lg bg-red-100 border-red-400 text-red-800 font-poppins">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-semibold text-white mb-2 font-poppins">
                  <i className="bi bi-text-paragraph me-2"></i>
                  Description
                </Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="e.g., Rent, Salary, Netflix"
                  className="w-full p-3 border border-[#3a506b] rounded-lg bg-[#243447] text-white font-poppins focus:border-[#ff5252] focus:ring-2 focus:ring-[#ff5252]"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-semibold text-white mb-2 font-poppins">
                  <i className="bi bi-currency-rupee me-2"></i>
                  Amount (₹)
                </Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  step="0.01"
                  min="1"
                  className="w-full p-3 border border-[#3a506b] rounded-lg bg-[#243447] text-white font-poppins focus:border-[#ff5252] focus:ring-2 focus:ring-[#ff5252]"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-semibold text-white mb-2 font-poppins">
                  <i className="bi bi-arrow-left-right me-2"></i>
                  Type
                </Form.Label>
                <Form.Select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="w-full p-3 border border-[#3a506b] rounded-lg bg-[#243447] text-white font-poppins focus:border-[#ff5252] focus:ring-2 focus:ring-[#ff5252]"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-semibold text-white mb-2 font-poppins">
                  <i className="bi bi-tag me-2"></i>
                  Category
                </Form.Label>
                <Form.Select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full p-3 border border-[#3a506b] rounded-lg bg-[#243447] text-white font-poppins focus:border-[#ff5252] focus:ring-2 focus:ring-[#ff5252]"
                >
                  <option value="">Select category</option>
                  {indianCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-semibold text-white mb-2 font-poppins">
                  <i className="bi bi-calendar me-2"></i>
                  Frequency
                </Form.Label>
                <Form.Select 
                  name="frequency" 
                  value={formData.frequency} 
                  onChange={handleChange}
                  className="w-full p-3 border border-[#3a506b] rounded-lg bg-[#243447] text-white font-poppins focus:border-[#ff5252] focus:ring-2 focus:ring-[#ff5252]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-semibold text-white mb-2 font-poppins">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Start Date
                </Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-[#3a506b] rounded-lg bg-[#243447] text-white font-poppins focus:border-[#ff5252] focus:ring-2 focus:ring-[#ff5252]"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-white mb-2 font-poppins">
              <i className="bi bi-calendar-minus me-2"></i>
              End Date (Optional)
            </Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate}
              className="w-full p-3 border border-[#3a506b] rounded-lg bg-[#243447] text-white font-poppins focus:border-[#ff5252] focus:ring-2 focus:ring-[#ff5252]"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-t border-[#3a506b] px-6 py-4 bg-[#2c3e50]">
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border border-[#3a506b] text-gray-300 hover:bg-[#3a506b] transition-colors font-poppins font-semibold"
          >
            <i className="bi bi-x-circle me-2"></i>
            Cancel
          </Button>
          <Button 
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff5252] to-[#ff7b46] hover:from-[#ff7b46] hover:to-[#ff5252] text-white border-0 transition-colors font-poppins font-semibold"
            type="submit"
          >
            <i className="bi bi-check-circle me-2"></i>
            Add Recurring
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default RecurringTransactionForm;