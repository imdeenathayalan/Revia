// src/components/UI/NotificationBell.jsx
import { useState } from 'react';
import { Dropdown, Badge } from 'react-bootstrap';
import { useNotification } from '../../context/NotificationContext';

function NotificationBell() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();

  return (
    <Dropdown show={showDropdown} onToggle={setShowDropdown}>
      <Dropdown.Toggle 
        variant="outline-light" 
        className="border-maroon text-white bg-transparent hover:bg-maroon-dark hover:border-maroon-dark position-relative"
      >
        <i className="bi bi-bell"></i>
        {unreadCount > 0 && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 start-100 translate-middle rounded-pill"
            style={{ fontSize: '0.6rem' }}
          >
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu className="bg-grey-dark border border-maroon p-0 mt-2 rounded-lg" style={{ width: '350px' }}>
        <div className="p-3 border-bottom border-maroon">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="text-white mb-0">Notifications</h6>
            {unreadCount > 0 && (
              <button 
                className="btn btn-sm btn-outline-light"
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
        
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-white">
              <i className="bi bi-bell-slash display-6 d-block mb-2"></i>
              No notifications
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification.id}
                className={`p-3 border-bottom border-maroon ${!notification.read ? 'bg-grey-medium' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <i className={`bi ${notification.icon} text-${notification.type} me-2`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <p className="text-white mb-1">{notification.message}</p>
                    <small className="text-maroon-light">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                  {!notification.read && (
                    <span className="ms-2">
                      <span className="badge bg-danger rounded-pill">•</span>
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NotificationBell;