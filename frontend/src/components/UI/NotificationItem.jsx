// src/components/UI/NotificationItem.jsx
import { Card, Button, Badge } from 'react-bootstrap';
import { useNotification } from '../../context/NotificationContext';
import { formatDisplayDate } from '../../utils/storage';

function NotificationItem({ notification, onMarkAsRead }) {
  const { deleteNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'bill': return 'bi-calendar-check';
      case 'budget': return 'bi-piggy-bank';
      case 'goal': return 'bi-trophy';
      case 'balance': return 'bi-wallet2';
      case 'system': return 'bi-info-circle';
      default: return 'bi-bell';
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'bill': return 'warning';
      case 'budget': return 'danger';
      case 'goal': return 'success';
      case 'balance': return 'info';
      case 'system': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <Card className={`border-maroon ${notification.read ? 'bg-grey-medium' : 'bg-grey-dark'} transition-colors`}>
      <Card.Body className="p-4">
        <div className="d-flex justify-between items-start">
          <div className="flex items-start space-x-3 flex-grow">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${getColor(notification.type)}`}>
              <i className={`${getIcon(notification.type)} text-white`}></i>
            </div>
            <div className="flex-grow">
              <p className="text-white mb-1">{notification.message}</p>
              <p className="text-maroon-light text-sm">
                {formatDisplayDate(new Date(notification.timestamp))}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {!notification.read && (
              <Badge bg="danger" className="px-2 py-1">
                New
              </Badge>
            )}
            <div className="flex space-x-2">
              {!notification.read && (
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={onMarkAsRead}
                  className="px-2 py-1"
                  title="Mark as read"
                >
                  <i className="bi bi-check"></i>
                </Button>
              )}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => deleteNotification(notification.id)}
                className="px-2 py-1"
                title="Delete notification"
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default NotificationItem;