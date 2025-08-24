// src/App.jsx (Updated imports)
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Layout/Navigation.jsx';
import Footer from './components/Layout/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import PublicRoute from './components/Auth/PublicRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';  // Changed to .jsx
import { FinanceProvider } from './context/FinanceContext.jsx';  // Changed to .jsx
import './App.css';

function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100 bg-gray-900 text-white">
            <Navigation />
            <Container className="my-4 flex-grow-1">
              <Routes>
                <Route path="/login" element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } />
                <Route path="/signup" element={
                  <PublicRoute>
                    <Signup />
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
      </FinanceProvider>
    </AuthProvider>
  );
}

export default App;