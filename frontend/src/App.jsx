import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Layout/Navigation.jsx';
import Footer from './components/Layout/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import RecurringTransactions from './pages/RecurringTransactions.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import Notifications from './pages/Notifications.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx';
import PublicRoute from './components/Auth/PublicRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FinanceProvider } from './context/FinanceContext.jsx';
import { BudgetProvider } from './context/BudgetContext.jsx';
import { GoalProvider } from './context/GoalContext.jsx';
import { RecurringProvider } from './context/RecurringContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <FinanceProvider>
          <BudgetProvider>
            <GoalProvider>
              <RecurringProvider>
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
                        <Route path="/recurring" element={
                          <ProtectedRoute>
                            <RecurringTransactions />
                          </ProtectedRoute>
                        } />
                        <Route path="/reports" element={
                          <ProtectedRoute>
                            <Reports />
                          </ProtectedRoute>
                        } />
                        <Route path="/notifications" element={
                          <ProtectedRoute>
                            <Notifications />
                          </ProtectedRoute>
                        } />
                        <Route path="/settings" element={
                          <ProtectedRoute>
                            <Settings />
                          </ProtectedRoute>
                        } />
                        
                        <Route path="*" element={<Navigate to="/login" replace />} />
                      </Routes>
                    </Container>
                    <Footer />
                  </div>
                </Router>
              </RecurringProvider>
            </GoalProvider>
          </BudgetProvider>
        </FinanceProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;