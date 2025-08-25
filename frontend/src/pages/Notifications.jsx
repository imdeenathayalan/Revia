// src/pages/Notifications.jsx - Updated button themes
import { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import NotificationList from '../components/UI/NotificationList';
import NotificationSettings from '../components/User/NotificationSettings';
import { formatDisplayDate } from '../utils/storage';

function Notifications() {
  const [activeTab, setActiveTab] = useState('all');
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotification();

  const tabs = [
    { id: 'all', label: 'All Notifications', icon: 'bi-bell' },
    { id: 'unread', label: 'Unread', icon: 'bi-bell-fill', badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: 'bi-gear' }
  ];

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-6 p-4 bg-maroon rounded-lg shadow-lg border border-maroon-dark">
        <h1 className="text-2xl font-bold text-white m-0">
          <i className="bi bi-bell me-3"></i>
          Notifications
        </h1>
        <div className="d-flex gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline-light"
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-lg border border-white text-white hover:bg-white hover:text-maroon transition-colors"
            >
              <i className="bi bi-check-all me-2"></i>
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button 
              variant="outline-light"
              onClick={clearAll}
              className="px-4 py-2 rounded-lg border border-white text-white hover:bg-red-600 hover:border-red-600 transition-colors"
            >
              <i className="bi bi-trash me-2"></i>
              Clear All
            </Button>
          )}
        </div>
      </div>

      <Row>
        {/* Sidebar Tabs */}
        <Col lg={3} className="mb-4">
          <Card className="shadow-lg border border-maroon bg-grey-dark">
            <Card.Body className="p-4">
              <div className="d-flex flex-column gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'maroon' : 'outline-maroon'}
                    onClick={() => setActiveTab(tab.id)}
                    className={`text-start d-flex align-items-center justify-content-between py-3 border-maroon ${
                      activeTab === tab.id 
                        ? 'text-white' 
                        : 'text-white hover:bg-maroon-dark hover:text-white'
                    } transition-colors`}
                  >
                    <div className="d-flex align-items-center">
                      <i className={`${tab.icon} me-3`}></i>
                      {tab.label}
                    </div>
                    {tab.badge > 0 && (
                      <Badge bg="danger" className="ms-2">
                        {tab.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Stats Card */}
          <Card className="mt-4 shadow-lg border border-maroon bg-maroon">
            <Card.Body className="p-4 text-center">
              <div className="text-white text-4xl mb-2">
                <i className="bi bi-bell"></i>
              </div>
              <h3 className="text-white text-lg font-semibold mb-1">
                {notifications.length}
              </h3>
              <p className="text-white text-sm mb-0">Total Notifications</p>
              <p className="text-white text-sm">
                {unreadCount} unread
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={9}>
          <Card className="shadow-lg border border-maroon bg-grey-dark">
            <Card.Body className="p-6">
              {activeTab === 'settings' ? (
                <NotificationSettings />
              ) : (
                <NotificationList notifications={filteredNotifications} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Notifications;