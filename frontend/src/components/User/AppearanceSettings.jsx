import { useState, useEffect } from 'react';
import { Form, Card, Button, Row, Col } from 'react-bootstrap';

const AppearanceSettings = () => {
  const [primaryColor, setPrimaryColor] = useState('#800000');
  const [darkMode, setDarkMode] = useState(true);

  // Preset color options
  const presetColors = [
    { name: 'Maroon', value: '#800000' },
    { name: 'Blue', value: '#007bff' },
    { name: 'Green', value: '#28a745' },
    { name: 'Purple', value: '#6f42c1' },
    { name: 'Orange', value: '#fd7e14' },
    { name: 'Teal', value: '#20c997' }
  ];

  useEffect(() => {
    // Load saved settings from localStorage
    const savedColor = localStorage.getItem('primaryColor');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedColor) {
      setPrimaryColor(savedColor);
      applyColor(savedColor);
    }
    
    if (savedDarkMode !== null) {
      const isDarkMode = savedDarkMode === 'true';
      setDarkMode(isDarkMode);
      applyDarkMode(isDarkMode);
    }
  }, []);

  // Function to darken a color
  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = Math.max(0, Math.min(255, (num >> 16) - amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) - amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) - amt));
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  };

  // Function to lighten a color
  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
  };

  // Apply color changes to CSS variables
  const applyColor = (color) => {
    const darkColor = darkenColor(color, 20);
    const lightColor = lightenColor(color, 20);

    document.documentElement.style.setProperty('--color-maroon', color);
    document.documentElement.style.setProperty('--color-maroon-dark', darkColor);
    document.documentElement.style.setProperty('--color-maroon-light', lightColor);
  };

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

  const handleColorChange = (color) => {
    setPrimaryColor(color);
    applyColor(color);
    localStorage.setItem('primaryColor', color);
  };

  const handleDarkModeChange = (checked) => {
    setDarkMode(checked);
    applyDarkMode(checked);
    localStorage.setItem('darkMode', checked);
  };

  const resetToDefault = () => {
    setPrimaryColor('#800000');
    setDarkMode(true);
    applyColor('#800000');
    applyDarkMode(true);
    localStorage.setItem('primaryColor', '#800000');
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

        {/* Primary Color Selection */}
        <Form.Group className="mb-4">
          <Form.Label className="text-white">
            <i className="bi bi-paint-bucket me-2"></i>
            Primary Color
          </Form.Label>
          <Form.Select 
            value={primaryColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="bg-grey-medium text-white border-maroon"
          >
            {presetColors.map(color => (
              <option key={color.value} value={color.value}>
                {color.name}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-maroon-light">
            Choose your primary accent color
          </Form.Text>
        </Form.Group>

        {/* Color Preview */}
        <Form.Group className="mb-4">
          <Form.Label className="text-white">Preview</Form.Label>
          <Row className="g-2">
            <Col xs={4}>
              <div 
                className="p-3 rounded border"
                style={{ 
                  backgroundColor: `var(--color-maroon-dark)`,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                Dark
              </div>
            </Col>
            <Col xs={4}>
              <div 
                className="p-3 rounded border"
                style={{ 
                  backgroundColor: `var(--color-maroon)`,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                Primary
              </div>
            </Col>
            <Col xs={4}>
              <div 
                className="p-3 rounded border"
                style={{ 
                  backgroundColor: `var(--color-maroon-light)`,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                Light
              </div>
            </Col>
          </Row>
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