import { useState, useEffect } from 'react';
import { Dropdown, Badge, Button } from 'react-bootstrap';
import { useNotification } from '../../context/NotificationContext';

function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, getRecentNotifications } = useNotification();
  const [recentNotifications, setRecentNotifications] = useState([]);

  useEffect(() => {
    setRecentNotifications(getRecentNotifications(5));
  }, [notifications, getRecentNotifications]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setShowDropdown(false);
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return 'bi-exclamation-triangle-fill text-danger';
      case 'high': return 'bi-exclamation-circle-fill text-warning';
      case 'medium': return 'bi-info-circle-fill text-info';
      case 'low': return 'bi-check-circle-fill text-success';
      default: return 'bi-bell-fill text-secondary';
    }
  };

  return (
    <Dropdown show={showDropdown} onToggle={setShowDropdown} align="end">
      <Dropdown.Toggle 
        variant="outline-light" 
        className="border-maroon text-white bg-transparent hover:bg-maroon-dark hover:border-maroon-dark position-relative p-2"
        style={{ borderRadius: '8px', transition: 'all 0.3s ease' }}
      >
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 start-100 translate-middle rounded-pill"
            style={{ 
              fontSize: '0.6rem', 
              minWidth: '18px', 
              height: '18px',
              zIndex: 1035 // Higher than dropdown
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu 
        className="bg-grey-dark border border-maroon p-0 mt-2 rounded-lg shadow-lg" 
        style={{ 
          width: '380px', 
          maxHeight: '500px', 
          overflow: 'hidden',
          zIndex: 1032, // Higher than navbar
          transform: 'translateZ(0)' // Force GPU rendering
        }}
      >
        <div className="p-3 border-bottom border-maroon bg-grey-medium">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-white mb-0">
              <i className="bi bi-bell me-2"></i>
              Notifications
              {unreadCount > 0 && (
                <Badge bg="danger" className="ms-2">
                  {unreadCount}
                </Badge>
              )}
            </h6>
            {unreadCount > 0 && (
              <Button
                variant="outline-light"
                size="sm"
                onClick={markAllAsRead}
                className="px-2 py-1"
                style={{ fontSize: '0.75rem' }}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
        
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {recentNotifications.length === 0 ? (
            <div className="p-4 text-center text-white">
              <i className="bi bi-bell-slash display-6 d-block mb-2 text-maroon-light"></i>
              <p className="mb-1">No notifications</p>
              <small className="text-maroon-light">You're all caught up!</small>
            </div>
          ) : (
            recentNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 border-bottom border-maroon cursor-pointer notification-item ${
                  !notification.read ? 'bg-grey-medium' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
                style={{ transition: 'background-color 0.2s ease' }}
              >
                <div className="d-flex align-items-start">
                  <div className="flex-shrink-0 me-3">
                    <i className={`bi ${getPriorityIcon(notification.priority)} fs-5`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <p className="text-white mb-0 me-2 small">{notification.message}</p>
                      {!notification.read && (
                        <span className="badge bg-danger rounded-pill">•</span>
                      )}
                    </div>
                    <small className="text-maroon-light">
                      {new Date(notification.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Delete notification logic would go here
                    }}
                    className="ms-2 opacity-0 notification-delete-btn"
                    style={{ transition: 'opacity 0.2s ease' }}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {recentNotifications.length > 0 && (
          <div className="p-3 border-top border-maroon bg-grey-medium">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-maroon-light">
                Showing {recentNotifications.length} of {notifications.length}
              </small>
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => {
                  // Navigate to full notifications page
                  window.location.href = '/notifications';
                }}
                style={{ fontSize: '0.75rem' }}
              >
                View All
              </Button>
            </div>
          </div>
        )}
      </Dropdown.Menu>
      
      <style>
        {`
          .notification-item:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
          .notification-item:hover .notification-delete-btn {
            opacity: 1 !important;
          }
        `}
      </style>
    </Dropdown>
  );
}

export default NotificationBell;