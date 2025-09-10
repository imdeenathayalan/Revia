import { useState, useEffect } from 'react';
import { Form, Card, Button, Alert, Row, Col, InputGroup } from 'react-bootstrap';

function NotificationSettings() {
  const [settings, setSettings] = useState({
    billReminders: true,
    budgetAlerts: true,
    goalUpdates: true,
    lowBalanceWarnings: true,
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true,
    budgetWarningThreshold: 80,
    budgetCriticalThreshold: 95,
    lowBalanceThreshold: 5000,
    goalMilestones: [25, 50, 75, 100]
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load saved settings on component mount
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (setting, value = null) => {
    const newValue = value !== null ? value : !settings[setting];
    setSettings(prev => ({
      ...prev,
      [setting]: newValue
    }));
  };

  const handleThresholdChange = (setting, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      setSettings(prev => ({
        ...prev,
        [setting]: numValue
      }));
    }
  };

  const handleMilestoneChange = (index, value) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      const newMilestones = [...settings.goalMilestones];
      newMilestones[index] = numValue;
      setSettings(prev => ({
        ...prev,
        goalMilestones: newMilestones
      }));
    }
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    setMessage('Notification settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      billReminders: true,
      budgetAlerts: true,
      goalUpdates: true,
      lowBalanceWarnings: true,
      emailNotifications: false,
      pushNotifications: true,
      soundEnabled: true,
      budgetWarningThreshold: 80,
      budgetCriticalThreshold: 95,
      lowBalanceThreshold: 5000,
      goalMilestones: [25, 50, 75, 100]
    };
    setSettings(defaultSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(defaultSettings));
    setMessage('Settings reset to defaults!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto">
      <h2 className="text-xl font-semibold text-white mb-4">
        <i className="bi bi-gear me-2 text-[#ff7b46]"></i>
        Notification Settings
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
            <i className="bi bi-bell me-2 text-[#ff7b46]"></i>
            Alert Types
          </h3>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="bill-reminders"
              label={<span className="text-[#e0e7ff]">Bill Reminders</span>}
              checked={settings.billReminders}
              onChange={() => handleSettingChange('billReminders')}
              className="mb-2"
            />
            <Form.Text className="text-[#a0aec0]">
              Get reminders for upcoming bills and subscriptions
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="budget-alerts"
              label={<span className="text-[#e0e7ff]">Budget Alerts</span>}
              checked={settings.budgetAlerts}
              onChange={() => handleSettingChange('budgetAlerts')}
              className="mb-2"
            />
            <Form.Text className="text-[#a0aec0]">
              Notifications when approaching or exceeding budget limits
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="goal-updates"
              label={<span className="text-[#e0e7ff]">Goal Updates</span>}
              checked={settings.goalUpdates}
              onChange={() => handleSettingChange('goalUpdates')}
              className="mb-2"
            />
            <Form.Text className="text-[#a0e7ff]">
              Progress updates and achievements for your savings goals
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="balance-warnings"
              label={<span className="text-[#e0e7ff]">Low Balance Warnings</span>}
              checked={settings.lowBalanceWarnings}
              onChange={() => handleSettingChange('lowBalanceWarnings')}
            />
            <Form.Text className="text-[#a0aec0]">
              Alerts when your balance falls below set thresholds
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="w-full mb-4 bg-[#2c3e50] border-[#3a506b] shadow-lg">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-[#e0e7ff] mb-3">
            <i className="bi bi-sliders me-2 text-[#ff7b46]"></i>
            Alert Thresholds
          </h3>
          
          <Row className="mb-3">
            <Col md={6} className="mb-3 md:mb-0">
              <Form.Group>
                <Form.Label className="text-[#e0e7ff]">Budget Warning Threshold (%)</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min="1"
                    max="100"
                    value={settings.budgetWarningThreshold}
                    onChange={(e) => handleThresholdChange('budgetWarningThreshold', e.target.value)}
                    className="bg-[rgba(44,62,80,0.8)] border-[#3a506b] text-white"
                  />
                  <InputGroup.Text className="bg-[rgba(44,62,80,0.8)] border-[#3a506b] text-white">%</InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-[#a0aec0]">
                  Send warning when budget usage reaches this percentage
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="text-[#e0e7ff]">Budget Critical Threshold (%)</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min="1"
                    max="100"
                    value={settings.budgetCriticalThreshold}
                    onChange={(e) => handleThresholdChange('budgetCriticalThreshold', e.target.value)}
                    className="bg-[rgba(44,62,80,0.8)] border-[#3a506b] text-white"
                  />
                  <InputGroup.Text className="bg-[rgba(44,62,80,0.8)] border-[#3a506b] text-white">%</InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-[#a0aec0]">
                  Send critical alert when budget usage reaches this percentage
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label className="text-[#e0e7ff]">Low Balance Threshold (₹)</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-[rgba(44,62,80,0.8)] border-[#3a506b] text-white">₹</InputGroup.Text>
              <Form.Control
                type="number"
                min="0"
                value={settings.lowBalanceThreshold}
                onChange={(e) => handleThresholdChange('lowBalanceThreshold', e.target.value)}
                className="bg-[rgba(44,62,80,0.8)] border-[#3a506b] text-white"
              />
            </InputGroup>
            <Form.Text className="text-[#a0aec0]">
              Send low balance warning when amount falls below this value
            </Form.Text>
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-[#e0e7ff]">Goal Milestones (%)</Form.Label>
            <Row>
              {settings.goalMilestones.map((milestone, index) => (
                <Col key={index} xs={6} md={3} className="mb-2">
                  <InputGroup size="sm">
                    <Form.Control
                      type="number"
                      min="1"
                      max="100"
                      value={milestone}
                      onChange={(e) => handleMilestoneChange(index, e.target.value)}
                      className="bg-[rgba(44,62,80,0.8)] border-[#3a506b] text-white"
                    />
                    <InputGroup.Text className="bg-[rgba(44,62,80,0.8)] border-[#3a506b] text-white">%</InputGroup.Text>
                  </InputGroup>
                </Col>
              ))}
            </Row>
            <Form.Text className="text-[#a0aec0]">
              Percentage milestones for goal progress notifications
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="w-full mb-4 bg-[#2c3e50] border-[#3a506b] shadow-lg">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-[#e0e7ff] mb-3">
            <i className="bi bi-devices me-2 text-[#ff7b46]"></i>
            Notification Channels
          </h3>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="push-notifications"
              label={<span className="text-[#e0e7ff]">Push Notifications</span>}
              checked={settings.pushNotifications}
              onChange={() => handleSettingChange('pushNotifications')}
              className="mb-2"
            />
            <Form.Text className="text-[#a0aec0]">
              Show notifications within the app
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="email-notifications"
              label={<span className="text-[#e0e7ff]">Email Notifications</span>}
              checked={settings.emailNotifications}
              onChange={() => handleSettingChange('emailNotifications')}
              className="mb-2"
            />
            <Form.Text className="text-[#a0aec0]">
              Receive notifications via email (requires email setup)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="sound-enabled"
              label={<span className="text-[#e0e7ff]">Notification Sound</span>}
              checked={settings.soundEnabled}
              onChange={() => handleSettingChange('soundEnabled')}
            />
            <Form.Text className="text-[#a0aec0]">
              Play sound when new notifications arrive
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      <div className="d-flex gap-3 flex-wrap">
        <Button 
          className="bg-gradient-to-r from-[#ff5252] to-[#ff7b46] border-0 text-white font-semibold hover:opacity-90 transition-opacity"
          onClick={handleSave}
        >
          <i className="bi bi-check-circle me-2"></i>
          Save Settings
        </Button>

        <Button 
          variant="outline-secondary"
          className="border-[#3a506b] text-[#e0e7ff] hover:bg-[#3a506b] transition-colors"
          onClick={handleReset}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}

export default NotificationSettings;