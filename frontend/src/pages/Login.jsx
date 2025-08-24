import { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Login({ updateAuthState }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
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
          name: 'John Doe',
          email: formData.email
        };
        
        localStorage.setItem('authToken', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(userData));
        updateAuthState(true, userData);
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

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-gray-900">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-red-800 bg-gray-800">
          <Card.Body className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-700">
                <span className="text-2xl text-white">
                  <i className="bi bi-wallet2"></i>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-red-400 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your Finance Tracker</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="danger" className="mb-6 bg-red-900 border-red-800 text-red-200 rounded-lg">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Form onSubmit={handleSubmit}>
              {/* Email Field */}
              <Form.Group className="mb-5">
                <Form.Label className="block text-sm font-semibold text-black mb-3 bg-gray-200 px-2 py-1 rounded">
                  <i className="bi bi-envelope me-2"></i>
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-gray-600 rounded-lg bg-white text-black placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600"
                  disabled={isLoading}
                />
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-6">
                <Form.Label className="block text-sm font-semibold text-black mb-3 bg-gray-200 px-2 py-1 rounded">
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
                    className="p-3 border border-gray-600 rounded-l-lg bg-white text-black placeholder-gray-500 focus:border-red-600 focus:ring-2 focus:ring-red-600 border-r-0"
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={togglePasswordVisibility}
                    className="bg-gray-200 border border-gray-600 border-l-0 text-black hover:bg-gray-300 rounded-r-lg px-4"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </Button>
                </InputGroup>
              </Form.Group>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="danger"
                className="w-full py-3 rounded-lg bg-red-700 hover:bg-red-600 text-white font-semibold border border-red-600 shadow-lg disabled:opacity-50"
                disabled={isLoading}
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

            {/* Signup Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-red-400 hover:text-red-300 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Demo Hint */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <p className="text-gray-400 text-sm text-center">
                <i className="bi bi-info-circle me-2"></i>
                Demo: Use any email and password
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;