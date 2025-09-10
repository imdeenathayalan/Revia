import { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useInvestment } from '../../context/InvestmentContext';
import { INVESTMENT_TYPES } from '../../utils/investmentTypes';

function AddInvestmentModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    type: INVESTMENT_TYPES.STOCKS,
    amount: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: '',
    purchasePrice: '',
    currentValue: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const { addInvestment } = useInvestment();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount) {
      setError('Please fill in required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    addInvestment({
      name: formData.name,
      type: formData.type,
      amount: amount,
      purchaseDate: formData.purchaseDate,
      quantity: parseFloat(formData.quantity) || 0,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      currentValue: parseFloat(formData.currentValue) || amount,
      notes: formData.notes
    });

    setFormData({
      name: '',
      type: INVESTMENT_TYPES.STOCKS,
      amount: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      quantity: '',
      purchasePrice: '',
      currentValue: '',
      notes: ''
    });
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="border-0">
      <Modal.Header closeButton className="bg-gray-800 border-b border-maroon-600 p-4">
        <Modal.Title className="text-white font-semibold text-xl">
          <i className="bi bi-graph-up-arrow me-2 text-maroon-400"></i>
          Add Investment
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
                  Investment Name *
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Apple Stocks, Mutual Fund"
                    required
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-tag-fill text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-diagram-3 text-maroon-400 me-2"></i>
                  Investment Type
                </Form.Label>
                <div className="relative">
                  <Form.Select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  >
                    {Object.entries(INVESTMENT_TYPES).map(([key, value]) => (
                      <option key={key} value={value}>{value}</option>
                    ))}
                  </Form.Select>
                  <i className="bi bi-diagram-3 text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-currency-rupee text-maroon-400 me-2"></i>
                  Invested Amount (₹) *
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="100000"
                    step="0.01"
                    min="0.01"
                    required
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-currency-rupee text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-calendar-date text-maroon-400 me-2"></i>
                  Purchase Date
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-calendar-date text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-hash text-maroon-400 me-2"></i>
                  Quantity
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g., 10 shares"
                    step="0.0001"
                    min="0"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-hash text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-currency-rupee text-maroon-400 me-2"></i>
                  Purchase Price (₹)
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    placeholder="Price per unit"
                    step="0.01"
                    min="0"
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
                  <i className="bi bi-graph-up text-maroon-400 me-2"></i>
                  Current Value (₹)
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="currentValue"
                    value={formData.currentValue}
                    onChange={handleChange}
                    placeholder="Current market value"
                    step="0.01"
                    min="0"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-graph-up text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
              <i className="bi bi-text-paragraph text-maroon-400 me-2"></i>
              Notes
            </Form.Label>
            <div className="relative">
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes about this investment..."
                className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
              />
              <i className="bi bi-text-paragraph text-maroon-400 absolute left-3 top-4"></i>
            </div>
          </Form.Group>
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
            Add Investment
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddInvestmentModal;