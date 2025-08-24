// src/components/Finance/AddGoalModal.jsx
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
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
    <Modal show={show} onHide={handleClose} className="shadow-xl">
      <Modal.Header closeButton className="border-b border-maroon bg-white">
        <Modal.Title className="text-xl font-semibold text-black">
          <i className="bi bi-trophy me-2"></i>
          Create New Goal
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
              <i className="bi bi-bullseye me-2"></i>
              Goal Name
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., New Laptop, Vacation, Emergency Fund"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-black mb-2">
              <i className="bi bi-currency-rupee me-2"></i>
              Target Amount (₹)
            </Form.Label>
            <Form.Control
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              placeholder="Enter target amount"
              step="0.01"
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-black mb-2">
              <i className="bi bi-calendar me-2"></i>
              Target Date (Optional)
            </Form.Label>
            <Form.Control
              type="date"
              name="targetDate"
              value={formData.targetDate}
              onChange={handleChange}
              min={getMinDate()}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black focus:border-maroon focus:ring-2 focus:ring-maroon"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="block text-sm font-semibold text-black mb-2">
              <i className="bi bi-text-paragraph me-2"></i>
              Description (Optional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your goal..."
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon"
            />
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
            Create Goal
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddGoalModal;