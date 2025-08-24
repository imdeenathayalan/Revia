// src/pages/Settings.jsx
import { useState } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import ProfileSettings from '../components/User/ProfileSettings';
import AppearanceSettings from '../components/User/AppearanceSettings';
import DataManagement from '../components/User/DataManagement';
import AboutSection from '../components/User/AboutSection';

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'bi-person' },
    { id: 'appearance', label: 'Appearance', icon: 'bi-palette' },
    { id: 'data', label: 'Data', icon: 'bi-database' },
    { id: 'about', label: 'About', icon: 'bi-info-circle' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'data':
        return <DataManagement />;
      case 'about':
        return <AboutSection />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <Container>
      <div className="mb-6 p-4 bg-grey-dark rounded-lg shadow-lg border border-maroon">
        <h1 className="text-2xl font-bold text-white m-0">
          <i className="bi bi-gear me-3"></i>
          Settings
        </h1>
      </div>

      <Row>
        {/* Sidebar Navigation */}
        <Col lg={3} className="mb-4">
          <Card className="shadow-lg border border-maroon bg-grey-dark">
            <Card.Body className="p-4">
              <Nav variant="pills" className="flex-column">
                {tabs.map((tab) => (
                  <Nav.Item key={tab.id} className="mb-2">
                    <Nav.Link
                      active={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`d-flex align-items-center px-3 py-2 rounded-lg border border-maroon ${
                        activeTab === tab.id
                          ? 'bg-maroon text-white'
                          : 'bg-grey-medium text-white hover:bg-maroon-dark'
                      } transition-colors`}
                    >
                      <i className={`${tab.icon} me-3`}></i>
                      {tab.label}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={9}>
          <Card className="shadow-lg border border-maroon bg-grey-dark">
            <Card.Body className="p-6">
              {renderContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Settings;