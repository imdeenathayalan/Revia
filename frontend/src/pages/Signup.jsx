import { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
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

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-dark-grey">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-maroon bg-grey-dark">
          <Card.Body className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4 border border-maroon-light">
                <span className="text-2xl text-white">
                  <i className="bi bi-person-plus"></i>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-white">Join Revia to manage your finances</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-6 bg-maroon-dark border-maroon text-white rounded-lg">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            <div className="bg-white rounded-lg p-6 border border-grey-light">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="block text-sm font-semibold text-black mb-2">
                    <i className="bi bi-person me-2"></i>
                    Full Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon"
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="block text-sm font-semibold text-black mb-2">
                    <i className="bi bi-envelope me-2"></i>
                    Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon"
                    disabled={isLoading}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="block text-sm font-semibold text-black mb-2">
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
                      className="p-3 border border-gray-300 rounded-l-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon border-r-0"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => togglePasswordVisibility('password')}
                      className="bg-white border border-gray-300 border-l-0 text-black hover:bg-gray-100 rounded-r-lg px-4"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-gray-500 text-xs mt-1">
                    Must be at least 6 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-6">
                  <Form.Label className="block text-sm font-semibold text-black mb-2">
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
                      className="p-3 border border-gray-300 rounded-l-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon border-r-0"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="bg-white border border-gray-300 border-l-0 text-black hover:bg-gray-100 rounded-r-lg px-4"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-maroon hover:bg-maroon-dark text-white font-semibold border border-maroon shadow-lg disabled:opacity-50 disabled: cursor-not-allowed"
                  disabled={isLoading}
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

            <div className="text-center mt-6 pt-6 border-t border-grey-medium">
              <p className="text-white">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-maroon-light hover:text-maroon font-medium transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Signup;