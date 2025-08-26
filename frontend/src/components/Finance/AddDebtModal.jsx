// src/components/Finance/AddDebtModal.jsx
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
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton className="bg-grey-dark border-maroon">
        <Modal.Title className="text-white">
          <i className="bi bi-plus-circle me-2"></i>
          Add Debt/Loan
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-grey-dark text-white">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Debt Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Home Loan, Car Loan"
                  required
                  className="bg-grey-medium border-maroon text-white"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Debt Type</Form.Label>
                <Form.Select 
                  name="type" 
                  value={formData.type} 
                  onChange={handleChange}
                  className="bg-grey-medium border-maroon text-white"
                >
                  {Object.entries(DEBT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Loan Amount (₹) *</Form.Label>
                <Form.Control
                  type="number"
                  name="originalAmount"
                  value={formData.originalAmount}
                  onChange={handleChange}
                  placeholder="100000"
                  step="0.01"
                  min="0.01"
                  required
                  className="bg-grey-medium border-maroon text-white"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Interest Rate (%)</Form.Label>
                <Form.Control
                  type="number"
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  placeholder="8.5"
                  step="0.1"
                  min="0"
                  className="bg-grey-medium border-maroon text-white"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tenure (Months)</Form.Label>
                <Form.Control
                  type="number"
                  name="tenureMonths"
                  value={formData.tenureMonths}
                  onChange={handleChange}
                  placeholder="60"
                  min="1"
                  className="bg-grey-medium border-maroon text-white"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Monthly Payment (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="monthlyPayment"
                  value={formData.monthlyPayment}
                  onChange={handleChange}
                  placeholder="Calculated automatically"
                  step="0.01"
                  min="0"
                  className="bg-grey-medium border-maroon text-white"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="bg-grey-medium border-maroon text-white"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Lender/Bank</Form.Label>
                <Form.Control
                  type="text"
                  name="lender"
                  value={formData.lender}
                  onChange={handleChange}
                  placeholder="e.g., SBI, HDFC Bank"
                  className="bg-grey-medium border-maroon text-white"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes about this debt..."
              className="bg-grey-medium border-maroon text-white"
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer className="bg-grey-dark border-maroon">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="maroon" type="submit">
            Add Debt
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddDebtModal;