// src/components/Finance/CreateSharedAccountModal.jsx
import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useShared } from '../../context/SharedContext';
import { useAuth } from '../../context/AuthContext';

function CreateSharedAccountModal({ show, handleClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'INR',
    type: 'household'
  });
  const [error, setError] = useState('');
  const { createSharedAccount } = useShared();
  const { user } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      setError('Please enter an account name');
      return;
    }

    createSharedAccount({
      name: formData.name,
      description: formData.description,
      currency: formData.currency,
      type: formData.type,
      ownerId: user.id,
      ownerEmail: user.email
    });

    // Reset form and close
    setFormData({
      name: '',
      description: '',
      currency: 'INR',
      type: 'household'
    });
    setError('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="bg-grey-dark border-maroon">
        <Modal.Title className="text-white">
          <i className="bi bi-people me-2"></i>
          Create Shared Account
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-grey-dark text-white">
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>Account Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Family Budget, Roommate Expenses"
              required
              className="bg-grey-medium border-maroon text-white"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the purpose of this shared account..."
              className="bg-grey-medium border-maroon text-white"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Account Type</Form.Label>
            <Form.Select 
              name="type" 
              value={formData.type} 
              onChange={handleChange}
              className="bg-grey-medium border-maroon text-white"
            >
              <option value="household">Household/Family</option>
              <option value="roommate">Roommates</option>
              <option value="couple">Couple</option>
              <option value="project">Project</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Currency</Form.Label>
            <Form.Select 
              name="currency" 
              value={formData.currency} 
              onChange={handleChange}
              className="bg-grey-medium border-maroon text-white"
            >
              <option value="INR">Indian Rupee (₹)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        
        <Modal.Footer className="bg-grey-dark border-maroon">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="maroon" type="submit">
            Create Account
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default CreateSharedAccountModal;