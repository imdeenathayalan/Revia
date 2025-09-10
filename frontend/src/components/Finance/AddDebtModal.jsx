import { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useDebt } from '../../context/DebtContext';
import { DEBT_TYPES, DEBT_TYPE_LABELS } from '../../utils/debtTypes';
import { formatIndianCurrency } from '../../utils/storage';

function AddDebtModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    type: DEBT_TYPES.PERSONAL_LOAN,
    originalAmount: '',
    interestRate: '',
    tenureMonths: '',
    startDate: new Date().toISOString().split('T')[0],
    lender: '',
    monthlyPayment: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const { addDebt, calculateEMI } = useDebt();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-calculate EMI if all required fields are filled
    if (name === 'originalAmount' || name === 'interestRate' || name === 'tenureMonths') {
      if (formData.originalAmount && formData.interestRate && formData.tenureMonths) {
        const emi = calculateEMI(
          parseFloat(formData.originalAmount),
          parseFloat(formData.interestRate),
          parseInt(formData.tenureMonths)
        );
        setFormData(prev => ({ ...prev, monthlyPayment: emi.toFixed(2) }));
      }
    }
    
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.originalAmount) {
      setError('Please fill in required fields');
      return;
    }

    const amount = parseFloat(formData.originalAmount);
    const interestRate = parseFloat(formData.interestRate) || 0;
    const tenureMonths = parseInt(formData.tenureMonths) || 0;

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    addDebt({
      name: formData.name,
      type: formData.type,
      originalAmount: amount,
      interestRate: interestRate,
      tenureMonths: tenureMonths,
      monthlyPayment: parseFloat(formData.monthlyPayment) || 0,
      startDate: formData.startDate,
      lender: formData.lender,
      notes: formData.notes
    });

    // Reset form
    setFormData({
      name: '',
      type: DEBT_TYPES.PERSONAL_LOAN,
      originalAmount: '',
      interestRate: '',
      tenureMonths: '',
      startDate: new Date().toISOString().split('T')[0],
      lender: '',
      monthlyPayment: '',
      notes: ''
    });
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="border-0">
      <Modal.Header closeButton className="bg-gray-800 border-b border-maroon-600 p-4">
        <Modal.Title className="text-white font-semibold text-xl">
          <i className="bi bi-plus-circle me-2 text-maroon-400"></i>
          Add Debt/Loan
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
                  Debt Name *
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Home Loan, Car Loan"
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
                  Debt Type
                </Form.Label>
                <div className="relative">
                  <Form.Select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  >
                    {Object.entries(DEBT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
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
                  Loan Amount (₹) *
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="originalAmount"
                    value={formData.originalAmount}
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
                  <i className="bi bi-percent text-maroon-400 me-2"></i>
                  Interest Rate (%)
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleChange}
                    placeholder="8.5"
                    step="0.1"
                    min="0"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-percent text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-calendar-month text-maroon-400 me-2"></i>
                  Tenure (Months)
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="tenureMonths"
                    value={formData.tenureMonths}
                    onChange={handleChange}
                    placeholder="60"
                    min="1"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-calendar-month text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-wallet2 text-maroon-400 me-2"></i>
                  Monthly Payment (₹)
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="monthlyPayment"
                    value={formData.monthlyPayment}
                    onChange={handleChange}
                    placeholder="Calculated automatically"
                    step="0.01"
                    min="0"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-wallet2 text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-calendar-date text-maroon-400 me-2"></i>
                  Start Date
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-calendar-date text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-building text-maroon-400 me-2"></i>
                  Lender/Bank
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="text"
                    name="lender"
                    value={formData.lender}
                    onChange={handleChange}
                    placeholder="e.g., SBI, HDFC Bank"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-building text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
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
                placeholder="Any additional notes about this debt..."
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
            Add Debt
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddDebtModal;