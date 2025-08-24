import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

function PublicRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      setIsAuthenticated(!!(token && user));
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </Container>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

export default PublicRoute;