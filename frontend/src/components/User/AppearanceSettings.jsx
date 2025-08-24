// src/components/User/AppearanceSettings.jsx
import { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

function AppearanceSettings() {
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    fontSize: 'medium',
    compactMode: false,
    animations: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppearance(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const themes = [
    { id: 'dark', name: 'Dark', description: 'Default dark theme' },
    { id: 'light', name: 'Light', description: 'Light theme' },
    { id: 'auto', name: 'Auto', description: 'Follow system preference' }
  ];

  const fontSizes = [
    { id: 'small', name: 'Small' },
    { id: 'medium', name: 'Medium' },
    { id: 'large', name: 'Large' },
    { id: 'xlarge', name: 'Extra Large' }
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        <i className="bi bi-palette me-2"></i>
        Appearance Settings
      </h2>

      <Card className="bg-grey-medium border border-maroon mb-4">
        <Card.Body className="p-4">
          <Form.Group className="mb-4">
            <Form.Label className="text-white">Theme</Form.Label>
            <Row>
              {themes.map(theme => (
                <Col md={4} key={theme.id} className="mb-3">
                  <div 
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      appearance.theme === theme.id 
                        ? 'border-maroon bg-maroon-dark' 
                        : 'border-grey-light bg-grey-dark hover:border-maroon-light'
                    }`}
                    onClick={() => setAppearance(prev => ({ ...prev, theme: theme.id }))}
                  >
                    <div className="text-center mb-2">
                      <div className={`w-8 h-8 rounded-full mx-auto ${
                        theme.id === 'dark' ? 'bg-gray-800' : 
                        theme.id === 'light' ? 'bg-gray-200' : 'bg-gradient-to-r from-gray-800 to-gray-200'
                      }`}></div>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium">{theme.name}</div>
                      <div className="text-gray-400 text-sm">{theme.description}</div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-white">Font Size</Form.Label>
            <Form.Select
              name="fontSize"
              value={appearance.fontSize}
              onChange={handleChange}
              className="bg-grey-dark border-maroon text-white"
            >
              {fontSizes.map(size => (
                <option key={size.id} value={size.id}>{size.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="switch"
              id="compact-mode"
              name="compactMode"
              label="Compact Mode"
              checked={appearance.compactMode}
              onChange={handleChange}
              className="text-white"
            />
            <Form.Text className="text-gray-400">
              Reduce spacing for a more compact layout
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Check
              type="switch"
              id="animations"
              name="animations"
              label="Enable Animations"
              checked={appearance.animations}
              onChange={handleChange}
              className="text-white"
            />
            <Form.Text className="text-gray-400">
              Enable smooth transitions and animations
            </Form.Text>
          </Form.Group>

          <Button className="bg-maroon hover:bg-maroon-dark border-maroon">
            <i className="bi bi-check-circle me-2"></i>
            Save Appearance Settings
          </Button>
        </Card.Body>
      </Card>

      <Card className="bg-grey-medium border border-maroon">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-eyedropper me-2"></i>
            Custom Colors
          </h3>
          <div className="text-gray-400 mb-3">
            Customize the color scheme of your application
          </div>
          <Button variant="outline-info" className="w-100">
            <i className="bi bi-palette2 me-2"></i>
            Customize Colors
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default AppearanceSettings;