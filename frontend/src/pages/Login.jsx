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
          name: 'User',
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
    <Container className="d-flex align-items-center justify-content-center min-vh-100 bg-dark-grey">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-maroon bg-grey-dark">
          <Card.Body className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-maroon rounded-full flex items-center justify-center mx-auto mb-4 border border-maroon-light">
                <span className="text-2xl text-white">
                  <i className="bi bi-currency-rupee"></i>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome to Revia</h1>
              <p className="text-white">Sign in to manage your finances</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-6 bg-maroon-dark border-maroon text-white rounded-lg">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </Alert>
            )}

            <div className="bg-white rounded-lg p-6 border border-grey-light">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-5">
                  <Form.Label className="block text-sm font-semibold text-black mb-3">
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

                <Form.Group className="mb-6">
                  <Form.Label className="block text-sm font-semibold text-black mb-3">
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
                      className="p-3 border border-gray-300 rounded-l-lg bg-white text-black placeholder-gray-500 focus:border-maroon focus:ring-2 focus:ring-maroon border-r-0"
                      disabled={isLoading}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
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
                </Form.Group>

                <Button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-maroon hover:bg-maroon-dark text-white font-semibold border border-maroon shadow-lg disabled:opacity-50 disabled: cursor-not-allowed"
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
            </div>

            <div className="text-center mt-6 pt-6 border-t border-grey-medium">
              <p className="text-white">
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  className="text-maroon-light hover:text-maroon font-medium transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>

            <div className="mt-6 p-4 bg-grey-medium rounded-lg border border-grey-medium">
              <p className="text-white text-sm text-center">
                <i className="bi bi-info-circle me-2"></i>
                Demo: Use any email and password to explore features
              </p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Login;