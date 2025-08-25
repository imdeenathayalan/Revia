// src/components/UI/NotificationList.jsx
import { Card } from 'react-bootstrap';
import { useNotification } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';
import { formatDisplayDate } from '../../utils/storage';

function NotificationList({ notifications }) {
  const { markAsRead } = useNotification();

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 text-maroon-light">
          <i className="bi bi-bell-slash"></i>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No Notifications</h3>
        <p className="text-white">
          You're all caught up! New notifications will appear here.
        </p>
      </div>
    );
  }

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toLocaleDateString('en-IN');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">
        <i className="bi bi-list-ul me-2"></i>
        Notifications
      </h2>
      
      <div className="space-y-6">
        {Object.entries(groupedNotifications).map(([date, dayNotifications]) => (
          <div key={date}>
            <h3 className="text-maroon-light font-semibold mb-3 border-b border-maroon pb-2">
              {date}
            </h3>
            <div className="space-y-3">
              {dayNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationList;