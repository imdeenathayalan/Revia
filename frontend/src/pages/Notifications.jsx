// src/pages/Notifications.jsx - Updated with full width layout and new color scheme
import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useNotification } from '../context/NotificationContext';
import NotificationList from '../components/UI/NotificationList';
import NotificationSettings from '../components/User/NotificationSettings';
import { formatDisplayDate } from '../utils/storage';
import './Notifications.css'; // Import the custom CSS file

function Notifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotification();

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'all', label: 'All Notifications', icon: 'bi-bell' },
    { id: 'unread', label: 'Unread', icon: 'bi-bell-fill', badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: 'bi-gear' }
  ];

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const handleTabChange = (tabId) => {
    setIsLoading(true);
    setActiveTab(tabId);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    // Add a small delay for visual feedback
    setTimeout(() => {
      if (activeTab === 'unread') {
        setActiveTab('all');
      }
    }, 300);
  };

  return (
    <div className="w-full px-4 xl:px-6 2xl:px-8 mx-auto pb-8">
      {/* Header Section */}
      <div className="notification-header mb-6 p-4 rounded-lg shadow-lg border border-[#3a506b] bg-gradient-to-r from-[#ff5252] to-[#ff7b46]">
        <h1 className="text-2xl font-semibold text-white m-0">
          <i className="bi bi-bell me-3"></i>
          Notifications
          {unreadCount > 0 && (
            <Badge bg="light" text="dark" className="ms-2 pulse">
              {unreadCount} New
            </Badge>
          )}
        </h1>
        <div className="d-flex gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline-light"
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 rounded-lg border border-white text-white hover-btn mark-read-btn"
            >
              <i className="bi bi-check-all me-2"></i>
              Mark All Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button 
              variant="outline-light"
              onClick={clearAll}
              className="px-4 py-2 rounded-lg border border-white text-white hover-btn clear-all-btn"
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
          <Card className="sidebar-card shadow-lg border border-[#3a506b] bg-[#2c3e50]">
            <Card.Body className="p-4">
              <div className="d-flex flex-column gap-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'outline-primary'}
                    onClick={() => handleTabChange(tab.id)}
                    className={`tab-button text-start d-flex align-items-center justify-content-between py-3 border-[#3a506b] ${
                      activeTab === tab.id 
                        ? 'text-white active-tab' 
                        : 'text-white'
                    }`}
                  >
                    <div className="d-flex align-items-center">
                      <i className={`${tab.icon} me-3`}></i>
                      {tab.label}
                    </div>
                    {tab.badge > 0 && (
                      <Badge bg="danger" className="ms-2 pulse">
                        {tab.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Stats Card */}
          <Card className="stats-card mt-4 shadow-lg border border-[#3a506b] bg-gradient-to-r from-[#ff5252] to-[#ff7b46]">
            <Card.Body className="p-4 text-center">
              <div className="notification-icon text-white mb-2">
                <i className="bi bi-bell"></i>
              </div>
              <h3 className="text-white text-lg font-semibold mb-1 counter">
                {notifications.length}
              </h3>
              <p className="text-white text-sm mb-0">Total Notifications</p>
              <p className="text-white text-sm">
                <span className="counter">{unreadCount}</span> unread
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={9}>
          <Card className="main-content-card shadow-lg border border-[#3a506b] bg-[#2c3e50]">
            <Card.Body className="p-6">
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner-border text-maroon" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : activeTab === 'settings' ? (
                <NotificationSettings />
              ) : (
                <NotificationList notifications={filteredNotifications} />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Notifications;