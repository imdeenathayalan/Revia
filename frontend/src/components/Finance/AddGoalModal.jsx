import { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { useGoal } from '../../context/GoalContext';

function AddGoalModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
    description: ''
  });
  const [error, setError] = useState('');
  const { createGoal } = useGoal();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount) {
      setError('Please fill in goal name and target amount');
      return;
    }

    const targetAmount = parseFloat(formData.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      setError('Please enter a valid target amount');
      return;
    }

    if (formData.targetDate && new Date(formData.targetDate) < new Date()) {
      setError('Target date cannot be in the past');
      return;
    }

    createGoal({
      name: formData.name,
      targetAmount: targetAmount,
      targetDate: formData.targetDate || null,
      description: formData.description || ''
    });

    setFormData({ name: '', targetAmount: '', targetDate: '', description: '' });
    handleClose();
    setError('');
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="border-0">
      <Modal.Header closeButton className="bg-gray-800 border-b border-maroon-600 p-4">
        <Modal.Title className="text-white font-semibold text-xl">
          <i className="bi bi-trophy me-2 text-maroon-400"></i>
          Create New Goal
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
                  <i className="bi bi-bullseye text-maroon-400 me-2"></i>
                  Goal Name *
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., New Laptop, Vacation, Emergency Fund"
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-bullseye text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-currency-rupee text-maroon-400 me-2"></i>
                  Target Amount (₹) *
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="number"
                    name="targetAmount"
                    value={formData.targetAmount}
                    onChange={handleChange}
                    placeholder="Enter target amount"
                    step="0.01"
                    min="1"
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
                  <i className="bi bi-calendar text-maroon-400 me-2"></i>
                  Target Date (Optional)
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    type="date"
                    name="targetDate"
                    value={formData.targetDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-calendar text-maroon-400 absolute left-3 top-1/2 transform -translate-y-1/2"></i>
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-4">
                <Form.Label className="flex items-center text-gray-300 mb-2 font-medium">
                  <i className="bi bi-text-paragraph text-maroon-400 me-2"></i>
                  Description (Optional)
                </Form.Label>
                <div className="relative">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your goal..."
                    className="bg-gray-700 border border-gray-600 text-white rounded-lg pl-10 pr-4 py-3 w-full focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  />
                  <i className="bi bi-text-paragraph text-maroon-400 absolute left-3 top-4"></i>
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
            Create Goal
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddGoalModal;