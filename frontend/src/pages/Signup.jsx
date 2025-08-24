import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Signup({ updateAuthState }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate form
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

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }

      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email
      };
      
      // Store auth data
      localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update global auth state
      updateAuthState(true, userData);
      
      // Show success message and redirect
      console.log('Signup successful:', userData);
      
      // Redirect to dashboard
      navigate('/');

    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-red-700 bg-gray-800 text-white">
          <Card.Body className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-red-400 mb-2">Create Account</h1>
              <p className="text-gray-400">Join Finance Tracker to manage your finances</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4 bg-red-900 border-red-700 text-red-200">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-red-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 border border-red-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min. 6 characters)"
                  className="w-full p-3 border border-red-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <Form.Text className="text-gray-400 text-xs">
                  Must be at least 6 characters long
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-6">
                <Form.Label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full p-3 border border-red-700 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="danger"
                className="w-full py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors border border-red-700 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin inline-block mr-2">⏳</span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </Form>

            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                By creating an account, you agree to our{' '}
                <span className="text-red-300 cursor-pointer hover:underline">Terms of Service</span>
              </p>
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-red-400 hover:text-red-300 transition-colors font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Demo credentials hint */}
            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-red-800">
              <h4 className="text-red-300 text-sm font-semibold mb-2">💡 Demo Information</h4>
              <p className="text-gray-400 text-xs">
                For demo purposes, you can use any valid email and password (min. 6 characters).
                The data is stored locally in your browser.
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Signup;