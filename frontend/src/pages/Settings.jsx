// src/pages/Settings.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Nav } from 'react-bootstrap';
import ProfileSettings from '../components/User/ProfileSettings';
import AppearanceSettings from '../components/User/AppearanceSettings';
import DataManagement from '../components/User/DataManagement';
import AboutSection from '../components/User/AboutSection';
import NotificationSettings from '../components/User/NotificationSettings';
import NotificationTester from '../components/UI/NotificationTester.jsx';
import './Settings.css'; // Import our custom CSS

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'bi-person' },
    { id: 'appearance', label: 'Appearance', icon: 'bi-palette' },
    { id: 'notifications', label: 'Notifications', icon: 'bi-bell' },
    { id: 'data', label: 'Data', icon: 'bi-database' },
    { id: 'about', label: 'About', icon: 'bi-info-circle' }
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="settings-loading">
          <div className="spinner-border text-white" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-gray-200">Loading your settings...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'data':
        return <DataManagement />;
      case 'about':
        return <AboutSection />;
      case 'notifications':
        return (
          <div className="notification-settings-container">
            <NotificationSettings />
            <NotificationTester />
          </div>
        );
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto">
      <div className="settings-header mb-6 p-4 bg-gradient-to-br from-[#243447] to-[#141d26] rounded-lg shadow-lg border border-[#3a506b]">
        <h1 className="text-2xl font-semibold text-white m-0">
          <i className="bi bi-gear me-3 animated-rotate"></i>
          Settings
        </h1>
        <p className="text-gray-200 mt-2 mb-0">Manage your account preferences and settings</p>
      </div>

      <Row>
        {/* Sidebar Navigation */}
        <Col lg={3} className="mb-4">
          <Card className="settings-sidebar shadow-lg border border-[#3a506b] bg-[#2c3e50]">
            <Card.Body className="p-4">
              <Nav variant="pills" className="flex-column">
                {tabs.map((tab) => (
                  <Nav.Item key={tab.id} className="mb-2">
                    <Nav.Link
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`d-flex align-items-center px-3 py-2 rounded-lg border border-[#3a506b] settings-tab-link ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#ff5252] to-[#ff7b46] text-white active-tab'
                          : 'bg-[#2c3e50] text-white hover-tab'
                      }`}
                    >
                      <i className={`${tab.icon} me-3 tab-icon`}></i>
                      {tab.label}
                      {activeTab === tab.id && <i className="bi bi-chevron-right ms-auto tab-indicator"></i>}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={9}>
          <Card className="settings-content-card shadow-lg border border-[#3a506b] bg-[#2c3e50]">
            <Card.Body className="p-6 content-transition">
              {renderContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Settings;