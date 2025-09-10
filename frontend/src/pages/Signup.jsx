import { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formValidations, setFormValidations] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate field in real-time
    validateField(name, value);
    
    if (error) setError('');
  };

  const validateField = (name, value) => {
    let isValid = false;
    
    switch (name) {
      case 'name':
        isValid = value.trim().length >= 2;
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        break;
      case 'password':
        isValid = value.length >= 6;
        break;
      case 'confirmPassword':
        isValid = value === formData.password && value.length >= 6;
        break;
      default:
        break;
    }
    
    setFormValidations({
      ...formValidations,
      [name]: isValid
    });
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Simulate API call with animation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email
      };
      
      login(userData);
      navigate('/');

    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if all fields are valid
  const isFormValid = Object.values(formValidations).every(valid => valid);

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <Card className="signup-card">
          <Card.Body className="signup-card-body">
            <div className="signup-header">
              <div className="signup-icon">
                <span>
                  <i className="bi bi-person-plus"></i>
                </span>
              </div>
              <h1>Create Account</h1>
              <p>Join Revia to manage your finances</p>
            </div>

            {error && (
              <Alert variant="danger" className="error-alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            <div className="signup-form-container">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="form-group-animate">
                  <Form.Label>
                    <i className="bi bi-person me-2"></i>
                    Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={formValidations.name ? 'is-valid' : formData.name ? 'is-warning' : ''}
                    disabled={isLoading}
                  />
                  {formData.name && (
                    <div className="validation-feedback">
                      {formValidations.name ? (
                        <small className="text-success">
                          <i className="bi bi-check-circle-fill me-1"></i> Valid name
                        </small>
                      ) : (
                        <small className="text-warning">
                          <i className="bi bi-exclamation-circle-fill me-1"></i> Name should be at least 2 characters
                        </small>
                      )}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="form-group-animate">
                  <Form.Label>
                    <i className="bi bi-envelope me-2"></i>
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={formValidations.email ? 'is-valid' : formData.email ? 'is-warning' : ''}
                    disabled={isLoading}
                  />
                  {formData.email && (
                    <div className="validation-feedback">
                      {formValidations.email ? (
                        <small className="text-success">
                          <i className="bi bi-check-circle-fill me-1"></i> Valid email
                        </small>
                      ) : (
                        <small className="text-warning">
                          <i className="bi bi-exclamation-circle-fill me-1"></i> Please enter a valid email
                        </small>
                      )}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="form-group-animate">
                  <Form.Label>
                    <i className="bi bi-lock me-2"></i>
                    Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password (min. 6 characters)"
                      className={formValidations.password ? 'is-valid' : formData.password ? 'is-warning' : ''}
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => togglePasswordVisibility('password')}
                      className="password-toggle"
                      disabled={isLoading}
                      type="button"
                    >
                      {showPassword ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </Button>
                  </InputGroup>
                  {formData.password && (
                    <div className="validation-feedback">
                      {formValidations.password ? (
                        <small className="text-success">
                          <i className="bi bi-check-circle-fill me-1"></i> Strong password
                        </small>
                      ) : (
                        <small className="text-warning">
                          <i className="bi bi-exclamation-circle-fill me-1"></i> Password must be at least 6 characters
                        </small>
                      )}
                    </div>
                  )}
                </Form.Group>

                <Form.Group className="form-group-animate">
                  <Form.Label>
                    <i className="bi bi-lock-fill me-2"></i>
                    Confirm Password
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className={formValidations.confirmPassword ? 'is-valid' : formData.confirmPassword ? 'is-warning' : ''}
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="password-toggle"
                      disabled={isLoading}
                      type="button"
                    >
                      {showConfirmPassword ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </Button>
                  </InputGroup>
                  {formData.confirmPassword && (
                    <div className="validation-feedback">
                      {formValidations.confirmPassword ? (
                        <small className="text-success">
                          <i className="bi bi-check-circle-fill me-1"></i> Passwords match
                        </small>
                      ) : (
                        <small className="text-warning">
                          <i className="bi bi-exclamation-circle-fill me-1"></i> Passwords do not match
                        </small>
                      )}
                    </div>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  className={`signup-btn ${isFormValid ? '' : 'disabled'}`}
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Create Account
                    </>
                  )}
                </Button>
              </Form>
            </div>

            <div className="signup-footer">
              <p>
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="login-link"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Signup;