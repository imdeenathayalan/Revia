import { useState, useEffect } from 'react';
import { Form, Card, Button, Alert } from 'react-bootstrap';

const AppearanceSettings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load saved theme setting from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDarkMode = savedTheme === 'dark';
    setDarkMode(isDarkMode);
    applyTheme(isDarkMode ? 'dark' : 'light');
  }, []);

  // Apply theme to document
  const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const handleThemeChange = (isDark) => {
    setDarkMode(isDark);
    applyTheme(isDark ? 'dark' : 'light');
    setMessage(`Theme changed to ${isDark ? 'Dark' : 'Light'} mode`);
    setTimeout(() => setMessage(''), 3000);
  };

  const resetToDefault = () => {
    handleThemeChange(true);
    setMessage('Reset to default theme');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto">
      <h2 className="text-xl font-semibold text-white mb-4">
        <i className="bi bi-palette me-2 text-[#ff7b46]"></i>
        Appearance Settings
      </h2>

      {message && (
        <Alert variant="success" className="mb-4 bg-[rgba(72,187,120,0.2)] border-[#48bb78] text-[#48bb78]">
          <i className="bi bi-check-circle me-2"></i>
          {message}
        </Alert>
      )}

      <Card className="w-full mb-4 bg-[#2c3e50] border-[#3a506b] shadow-lg">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-[#e0e7ff] mb-3">
            <i className="bi bi-paint-bucket me-2 text-[#ff7b46]"></i>
            Theme Selection
          </h3>
          
          <div className="theme-options grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div 
              className={`theme-option cursor-pointer p-3 rounded-lg border-2 transition-all ${darkMode ? 'border-[#ff5252] bg-[rgba(255,82,82,0.1)]' : 'border-[#3a506b] bg-transparent'}`}
              onClick={() => handleThemeChange(true)}
            >
              <div className="theme-preview dark-preview h-20 rounded-md bg-gradient-to-br from-[#243447] to-[#141d26] mb-2 overflow-hidden">
                <div className="preview-header h-4 bg-[#3a506b]"></div>
                <div className="preview-content p-2">
                  <div className="preview-line h-2 bg-[#3a506b] rounded mb-1"></div>
                  <div className="preview-line short h-2 bg-[#3a506b] rounded w-3/4"></div>
                </div>
              </div>
              <span className="theme-name text-[#e0e7ff]">Dark Theme</span>
            </div>
            
            <div 
              className={`theme-option cursor-pointer p-3 rounded-lg border-2 transition-all ${!darkMode ? 'border-[#ff5252] bg-[rgba(255,82,82,0.1)]' : 'border-[#3a506b] bg-transparent'}`}
              onClick={() => handleThemeChange(false)}
            >
              <div className="theme-preview light-preview h-20 rounded-md bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] mb-2 overflow-hidden">
                <div className="preview-header h-4 bg-[#dee2e6]"></div>
                <div className="preview-content p-2">
                  <div className="preview-line h-2 bg-[#dee2e6] rounded mb-1"></div>
                  <div className="preview-line short h-2 bg-[#dee2e6] rounded w-3/4"></div>
                </div>
              </div>
              <span className="theme-name text-[#e0e7ff]">Light Theme</span>
            </div>
          </div>

          <Form.Group className="mb-4">
            <Form.Label className="text-[#e0e7ff] font-semibold">
              <i className="bi bi-moon me-2 text-[#ff7b46]"></i>
              Dark Mode
            </Form.Label>
            <div className="d-flex align-items-center">
              <Form.Check
                type="switch"
                id="dark-mode-switch"
                checked={darkMode}
                onChange={(e) => handleThemeChange(e.target.checked)}
                className="me-2"
              />
              <span className="text-[#e0e7ff]">
                {darkMode ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <Form.Text className="text-[#a0aec0]">
              Toggle between dark and light theme
            </Form.Text>
          </Form.Group>

          <Button 
            className="reset-button bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 text-white font-semibold hover:opacity-90 transition-opacity"
            onClick={resetToDefault}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reset to Default
          </Button>

          <div className="info-box mt-4 p-3 bg-[rgba(58,80,107,0.3)] rounded-lg">
            <p className="text-[#a0aec0] mb-0 text-sm">
              <i className="bi bi-info-circle me-2 text-[#ff7b46]"></i>
              Changes will apply immediately across the application
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AppearanceSettings;