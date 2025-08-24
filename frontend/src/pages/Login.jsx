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
        <Card className="shadow-2xl border-2 border-red-600 bg-gray-800">
          <Card.Body className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h1 className="text-2xl font-bold text-red-400 mb-2">Welcome Back</h1>
              <p className="text-gray-300">Sign in to manage your finances</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="danger" className="mb-6 bg-red-900 border-red-700 text-red-200 rounded-lg">
                ⚠️ {error}
              </Alert>
            )}

            {/* Login Form */}
            <Form onSubmit={handleSubmit}>
              {/* Email Field */}
              <Form.Group className="mb-5">
                <Form.Label className="block text-sm font-semibold text-gray-200 mb-3">
                  📧 Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-4 border-2 border-gray-600 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-200"
                  disabled={isLoading}
                />
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-6">
                <Form.Label className="block text-sm font-semibold text-gray-200 mb-3">
                  🔒 Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="p-4 border-2 border-gray-600 rounded-l-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 border-r-0 transition-all duration-200"
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={togglePasswordVisibility}
                    className="bg-gray-700 border-2 border-gray-600 border-l-0 text-gray-300 hover:bg-gray-600 rounded-r-xl px-4 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </Button>
                </InputGroup>
              </Form.Group>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="danger"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg transition-all duration-200 transform hover:scale-105 border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin inline-block mr-2">⏳</span>
                    Signing In...
                  </>
                ) : (
                  '🚀 Sign In'
                )}
              </Button>
            </Form>

            {/* Signup Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-200 underline"
                >
                  Create Account
                </Link>
              </p>
            </div>

            {/* Demo Hint */}
            <div className="mt-6 p-4 bg-gray-700 rounded-xl border border-gray-600">
              <p className="text-gray-300 text-sm text-center">
                💡 <strong>Demo:</strong> Use any email and password to login
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;