import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Navigation from './components/Layout/Navigation.jsx';
import Footer from './components/Layout/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import PublicRoute from './components/Auth/PublicRoute.jsx';
import './App.css';

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null
  });

  // Check initial auth state on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(userData)
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const updateAuthState = (isAuthenticated, userData = null) => {
    setAuthState({ isAuthenticated, user: userData });
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 bg-gray-900 text-white">
        <Navigation authState={authState} updateAuthState={updateAuthState} />
        <Container className="my-4 flex-grow-1">
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login updateAuthState={updateAuthState} />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup updateAuthState={updateAuthState} />
              </PublicRoute>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/transactions" element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;