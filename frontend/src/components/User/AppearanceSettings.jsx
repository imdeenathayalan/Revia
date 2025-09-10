import { useState, useEffect } from 'react';
import { Form, Card, Button } from 'react-bootstrap';

const AppearanceSettings = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Load saved dark mode setting from localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode !== null) {
      const isDarkMode = savedDarkMode === 'true';
      setDarkMode(isDarkMode);
      applyDarkMode(isDarkMode);
    }
  }, []);

  // Apply dark/light mode
  const applyDarkMode = (isDarkMode) => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  };

  const handleDarkModeChange = (checked) => {
    setDarkMode(checked);
    applyDarkMode(checked);
    localStorage.setItem('darkMode', checked);
  };

  const resetToDefault = () => {
    setDarkMode(true);
    applyDarkMode(true);
    localStorage.setItem('darkMode', 'true');
  };

  return (
    <Card className="bg-grey-dark border-maroon">
      <Card.Body className="p-4">
        <h4 className="text-white mb-4">
          <i className="bi bi-palette me-2"></i>
          Appearance Settings
        </h4>
        
        {/* Dark Mode Toggle */}
        <Form.Group className="mb-4">
          <Form.Label className="text-white">
            <i className="bi bi-moon me-2"></i>
            Theme Mode
          </Form.Label>
          <div className="d-flex align-items-center">
            <Form.Check
              type="switch"
              id="dark-mode-switch"
              checked={darkMode}
              onChange={(e) => handleDarkModeChange(e.target.checked)}
              className="me-2"
            />
            <span className="text-white">
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </div>
          <Form.Text className="text-maroon-light">
            Toggle between dark and light theme
          </Form.Text>
        </Form.Group>

        {/* Reset Button */}
        <Button 
          variant="maroon" 
          onClick={resetToDefault}
          className="mt-3"
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reset to Default
        </Button>

        <div className="mt-4 p-3 bg-grey-medium rounded border border-maroon">
          <p className="text-white mb-0 small">
            <i className="bi bi-info-circle me-2"></i>
            Changes will apply immediately across the application
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default AppearanceSettings;