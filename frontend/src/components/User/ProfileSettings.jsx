// src/components/User/ProfileSettings.jsx
import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currency: 'INR',
    language: 'en'
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser({ name: formData.name, email: formData.email });
      setMessage('Profile updated successfully!');
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        <i className="bi bi-person me-2"></i>
        Profile Settings
      </h2>

      {message && (
        <Alert variant={message.includes('Error') ? 'danger' : 'success'} className="mb-4">
          <i className={`bi ${message.includes('Error') ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
          {message}
        </Alert>
      )}

      <Card className="bg-grey-medium border border-maroon mb-4">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="text-white">Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-grey-dark border-maroon text-white"
                placeholder="Enter your full name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="text-white">Email Address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-grey-dark border-maroon text-white"
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-white">Preferred Currency</Form.Label>
              <Form.Select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="bg-grey-dark border-maroon text-white"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="text-white">Language</Form.Label>
              <Form.Select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="bg-grey-dark border-maroon text-white"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
              </Form.Select>
            </Form.Group>

            <Button
              type="submit"
              className="bg-maroon hover:bg-maroon-dark border-maroon"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Update Profile
                </>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="bg-grey-medium border border-maroon">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-shield me-2"></i>
            Account Security
          </h3>
          <div className="space-y-3"> {/* Added space-y-3 for vertical spacing */}
            <Button variant="outline-warning" className="w-100 text-start d-flex align-items-center">
              <i className="bi bi-key me-3"></i>
              Change Password
            </Button>
            <div className="my-2"></div> {/* Added spacing div between buttons */}
            <Button variant="outline-info" className="w-100 text-start d-flex align-items-center">
              <i className="bi bi-device-phone me-3"></i>
              Two-Factor Authentication
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ProfileSettings;