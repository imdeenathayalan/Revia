// src/components/Finance/AddInvestmentModal.jsx
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useInvestment } from '../../context/InvestmentContext';
import { INVESTMENT_TYPES, INVESTMENT_TYPE_LABELS } from '../../utils/investmentTypes';

function AddInvestmentModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    type: INVESTMENT_TYPES.STOCK,
    investedAmount: '',
    quantity: '1',
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const { addInvestment } = useInvestment();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.investedAmount) {
      setError('Please fill in name and invested amount');
      return;
    }

    const amount = parseFloat(formData.investedAmount);
    const quantity = parseFloat(formData.quantity) || 1;

    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    addInvestment({
      name: formData.name,
      type: formData.type,
      investedAmount: amount,
      quantity: quantity,
      purchaseDate: formData.purchaseDate
    });

    // Reset form and close
    setFormData({
      name: '',
      type: INVESTMENT_TYPES.STOCK,
      investedAmount: '',
      quantity: '1',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="bg-grey-dark border-maroon">
        <Modal.Title className="text-white">
          <i className="bi bi-plus-circle me-2"></i>
          Add Investment
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-grey-dark text-white">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>Investment Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Reliance Industries"
              required
              className="bg-grey-medium border-maroon text-white"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Investment Type</Form.Label>
            <Form.Select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="bg-grey-medium border-maroon text-white"
            >
              {Object.entries(INVESTMENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Invested Amount (₹) *</Form.Label>
            <Form.Control
              type="number"
              name="investedAmount"
              value={formData.investedAmount}
              onChange={handleChange}
              placeholder="10000"
              step="0.01"
              min="0.01"
              required
              className="bg-grey-medium border-maroon text-white"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Number of units"
              step="0.001"
              min="0.001"
              className="bg-grey-medium border-maroon text-white"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleChange}
              className="bg-grey-medium border-maroon text-white"
            />
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer className="bg-grey-dark border-maroon">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="maroon" type="submit">
            Add Investment
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddInvestmentModal;