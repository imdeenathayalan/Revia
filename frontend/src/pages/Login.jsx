import { useState } from 'react';
import { Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formValidations, setFormValidations] = useState({
    email: false,
    password: false
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
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        break;
      case 'password':
        isValid = value.length >= 6;
        break;
      default:
        break;
    }
    
    setFormValidations({
      ...formValidations,
      [name]: isValid
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.email && formData.password) {
        const userData = {
          id: 1,
          name: 'User',
          email: formData.email
        };
        
        login(userData);
        navigate('/');
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if all fields are valid
  const isFormValid = Object.values(formValidations).every(valid => valid);

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <Card className="login-card">
          <Card.Body className="login-card-body">
            <div className="login-header">
              <div className="login-icon">
                <span>
                  <i className="bi bi-currency-rupee"></i>
                </span>
              </div>
              <h1>Welcome to Revia</h1>
              <p>Sign in to manage your finances</p>
            </div>

            {error && (
              <Alert variant="danger" className="error-alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            <div className="login-form-container">
              <Form onSubmit={handleSubmit}>
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
                      placeholder="Enter your password"
                      className={formValidations.password ? 'is-valid' : formData.password ? 'is-warning' : ''}
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
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
                          <i className="bi bi-check-circle-fill me-1"></i> Valid password
                        </small>
                      ) : (
                        <small className="text-warning">
                          <i className="bi bi-exclamation-circle-fill me-1"></i> Password must be at least 6 characters
                        </small>
                      )}
                    </div>
                  )}
                </Form.Group>

                <Button
                  type="submit"
                  className={`login-btn ${isFormValid ? '' : 'disabled'}`}
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </>
                  )}
                </Button>
              </Form>
            </div>

            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="signup-link"
                >
                  Create Account
                </Link>
              </p>
            </div>

            <div className="demo-info">
              <p>
                <i className="bi bi-info-circle me-2"></i>
                Demo: Use any email and password to explore features
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default Login;