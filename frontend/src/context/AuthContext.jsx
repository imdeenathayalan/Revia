import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true
  });

  useEffect(() => {
    // Check existing auth on app load
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(userData),
          isLoading: false
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (userData) => {
    // Remove currency from user data if it exists
    const { currency, ...userWithoutCurrency } = userData;
    
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(userWithoutCurrency));
    setAuthState({
      isAuthenticated: true,
      user: userWithoutCurrency,
      isLoading: false
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false
    });
  };

  const updateUser = (updatedUserData) => {
    // Remove currency if it's being passed
    const { currency, ...cleanUserData } = updatedUserData;
    const userData = { ...authState.user, ...cleanUserData };
    
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthState(prev => ({
      ...prev,
      user: userData
    }));
  };

  const value = {
    ...authState,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;