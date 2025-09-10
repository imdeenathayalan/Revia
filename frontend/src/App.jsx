import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Layout/Navigation.jsx';
import Footer from './components/Layout/Footer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions.jsx';
import RecurringTransactions from './pages/RecurringTransactions.jsx';
import Investments from './pages/Investments.jsx';
import Debts from './pages/Debts.jsx';
// Remove SharedAccounts import
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
import { InvestmentProvider } from './context/InvestmentContext.jsx';
import { DebtProvider } from './context/DebtContext.jsx';
// Remove SharedProvider import
import { SearchProvider } from './context/SearchContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import NotificationScheduler from './components/UI/NotificationScheduler.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <FinanceProvider>
          <BudgetProvider>
            <GoalProvider>
              <RecurringProvider>
                <InvestmentProvider>
                  <DebtProvider>
                    {/* Remove SharedProvider wrapper */}
                    <SearchProvider>
                      <NotificationScheduler />
                      <Router>
                        <div className="d-flex flex-column min-vh-100 bg-gray-900 text-white">
                          <Navigation />
                          {/* Removed Container and replaced with custom div for full width */}
                          <main className="flex-grow-1 w-full px-4 xl:px-6 2xl:px-8 mx-auto">
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
                              <Route path="/investments" element={
                                <ProtectedRoute>
                                  <Investments />
                                </ProtectedRoute>
                              } />
                              <Route path="/debts" element={
                                <ProtectedRoute>
                                  <Debts />
                                </ProtectedRoute>
                              } />
                              {/* Remove SharedAccounts route */}
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
                          </main>
                          <Footer />
                        </div>
                      </Router>
                    </SearchProvider>
                    {/* Remove SharedProvider closing tag */}
                  </DebtProvider>
                </InvestmentProvider>
              </RecurringProvider>
            </GoalProvider>
          </BudgetProvider>
        </FinanceProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;