// src/components/User/NotificationSettings.jsx
import { useState } from 'react';
import { Form, Card, Button, Alert } from 'react-bootstrap';

function NotificationSettings() {
  const [settings, setSettings] = useState({
    billReminders: true,
    budgetAlerts: true,
    goalUpdates: true,
    lowBalanceWarnings: true,
    emailNotifications: false,
    pushNotifications: true,
    soundEnabled: true
  });

  const [message, setMessage] = useState('');

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    setMessage('Notification settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        <i className="bi bi-gear me-2"></i>
        Notification Settings
      </h2>

      {message && (
        <Alert variant="success" className="mb-4 bg-green-600 border-green-700 text-white">
          <i className="bi bi-check-circle me-2"></i>
          {message}
        </Alert>
      )}

      <Card className="bg-grey-medium border border-maroon mb-4">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-bell me-2"></i>
            Alert Types
          </h3>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="bill-reminders"
              label="Bill Reminders"
              checked={settings.billReminders}
              onChange={() => handleSettingChange('billReminders')}
              className="text-white mb-2"
            />
            <Form.Text className="text-maroon-light">
              Get reminders for upcoming bills and subscriptions
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="budget-alerts"
              label="Budget Alerts"
              checked={settings.budgetAlerts}
              onChange={() => handleSettingChange('budgetAlerts')}
              className="text-white mb-2"
            />
            <Form.Text className="text-maroon-light">
              Notifications when approaching or exceeding budget limits
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="goal-updates"
              label="Goal Updates"
              checked={settings.goalUpdates}
              onChange={() => handleSettingChange('goalUpdates')}
              className="text-white mb-2"
            />
            <Form.Text className="text-maroon-light">
              Progress updates and achievements for your savings goals
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="balance-warnings"
              label="Low Balance Warnings"
              checked={settings.lowBalanceWarnings}
              onChange={() => handleSettingChange('lowBalanceWarnings')}
              className="text-white"
            />
            <Form.Text className="text-maroon-light">
              Alerts when your balance falls below set thresholds
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="bg-grey-medium border border-maroon">
        <Card.Body className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3">
            <i className="bi bi-devices me-2"></i>
            Notification Channels
          </h3>
          
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="push-notifications"
              label="Push Notifications"
              checked={settings.pushNotifications}
              onChange={() => handleSettingChange('pushNotifications')}
              className="text-white mb-2"
            />
            <Form.Text className="text-maroon-light">
              Show notifications within the app
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="email-notifications"
              label="Email Notifications"
              checked={settings.emailNotifications}
              onChange={() => handleSettingChange('emailNotifications')}
              className="text-white mb-2"
            />
            <Form.Text className="text-maroon-light">
              Receive notifications via email (requires email setup)
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="sound-enabled"
              label="Notification Sound"
              checked={settings.soundEnabled}
              onChange={() => handleSettingChange('soundEnabled')}
              className="text-white"
            />
            <Form.Text className="text-maroon-light">
              Play sound when new notifications arrive
            </Form.Text>
          </Form.Group>
        </Card.Body>
      </Card>

      <Button 
        className="mt-4 px-6 py-2 rounded-lg bg-maroon hover:bg-maroon-dark text-white border border-maroon"
        onClick={handleSave}
      >
        <i className="bi bi-check-circle me-2"></i>
        Save Settings
      </Button>
    </div>
  );
}

export default NotificationSettings;