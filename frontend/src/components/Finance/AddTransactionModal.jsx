import { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
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
    if (error) setError('');
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
      date: new Date()
    };

    addTransaction(transaction);
    handleClose();
    setFormData({ description: '', amount: '', type: 'expense', category: '' });
    setError('');
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="border-0">
      <Modal.Header closeButton className="bg-gray-800 border-b border-maroon-600 p-4">
        <Modal.Title className="text-white font-semibold text-xl">
          <i className="bi bi-plus-circle me-2 text-maroon-400"></i>
          Add New Transaction
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
                  <i className="bi bi-text-paragraph text-maroon-400 me-2"></i>
                  Description *
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description (e.g., Groceries, Salary, etc.)"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-text-paragraph text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-currency-rupee text-maroon-400 me-2"></i>
                  Amount (₹) *
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount in rupees"
                    step="0.01"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-currency-rupee text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-arrow-left-right text-maroon-400 me-2"></i>
                  Type
                </Form.Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Form.Check
                      type="radio"
                      id="type-expense"
                      name="type"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="type-expense"
                      className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.type === 'expense'
                          ? 'bg-red-900/20 border-red-700 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <i className={`bi bi-arrow-up-right me-2 ${
                        formData.type === 'expense' ? 'text-red-400' : 'text-gray-400'
                      }`}></i>
                      Expense
                    </label>
                  </div>
                  <div className="relative">
                    <Form.Check
                      type="radio"
                      id="type-income"
                      name="type"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="type-income"
                      className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                        formData.type === 'income'
                          ? 'bg-green-900/20 border-green-700 text-white'
                          : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <i className={`bi bi-arrow-down-left me-2 ${
                        formData.type === 'income' ? 'text-green-400' : 'text-gray-400'
                      }`}></i>
                      Income
                    </label>
                  </div>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-tag text-maroon-400 me-2"></i>
                  Category
                </Form.Label>
                <div className="relative">
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {indianCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Form.Select>
                  <i className="bi bi-tag text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        
        <Modal.Footer className="bg-gray-800 border-t border-gray-700 p-4">
          <Button 
            variant="outline-secondary" 
            onClick={handleClose}
            className="px-4 py-2 rounded-lg border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            className="flex items-center px-4 py-2 rounded-lg bg-maroon-600 border-maroon-600 hover:bg-maroon-700 hover:border-maroon-700 transition-colors"
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