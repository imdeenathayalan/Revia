import { useState } from 'react';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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
      
      localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userData));
      updateAuthState(true, userData);
      navigate('/');

    } catch (err) {
      setError('Registration failed. Please try again.');
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
                <span className="text-2xl">✨</span>
              </div>
              <h1 className="text-2xl font-bold text-red-400 mb-2">Create Account</h1>
              <p className="text-gray-300">Join us to manage your finances</p>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="danger" className="mb-6 bg-red-900 border-red-700 text-red-200 rounded-lg">
                ⚠️ {error}
              </Alert>
            )}

            {/* Signup Form */}
            <Form onSubmit={handleSubmit}>
              {/* Name Field */}
              <Form.Group className="mb-5">
                <Form.Label className="block text-sm font-semibold text-gray-200 mb-3">
                  👤 Full Name
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-4 border-2 border-gray-600 rounded-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-all duration-200"
                  disabled={isLoading}
                />
              </Form.Group>

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
              <Form.Group className="mb-5">
                <Form.Label className="block text-sm font-semibold text-gray-200 mb-3">
                  🔒 Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password (min. 6 characters)"
                    className="p-4 border-2 border-gray-600 rounded-l-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 border-r-0 transition-all duration-200"
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => togglePasswordVisibility('password')}
                    className="bg-gray-700 border-2 border-gray-600 border-l-0 text-gray-300 hover:bg-gray-600 rounded-r-xl px-4 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </Button>
                </InputGroup>
                <Form.Text className="text-gray-400 text-xs mt-2">
                  Must be at least 6 characters long
                </Form.Text>
              </Form.Group>

              {/* Confirm Password Field */}
              <Form.Group className="mb-6">
                <Form.Label className="block text-sm font-semibold text-gray-200 mb-3">
                  🔒 Confirm Password
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="p-4 border-2 border-gray-600 rounded-l-xl bg-gray-700 text-gray-100 placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 border-r-0 transition-all duration-200"
                    disabled={isLoading}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="bg-gray-700 border-2 border-gray-600 border-l-0 text-gray-300 hover:bg-gray-600 rounded-r-xl px-4 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
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
                    Creating Account...
                  </>
                ) : (
                  '🎉 Create Account'
                )}
              </Button>
            </Form>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-700">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-200 underline"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Terms */}
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-xs">
                By creating an account, you agree to our{' '}
                <span className="text-red-300 cursor-pointer hover:underline">Terms</span> and{' '}
                <span className="text-red-300 cursor-pointer hover:underline">Privacy Policy</span>
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Signup;