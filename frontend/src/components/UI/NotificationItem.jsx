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
      case 'spending': return 'bi-graph-up-arrow';
      case 'system': return 'bi-info-circle';
      case 'security': return 'bi-shield';
      default: return 'bi-bell';
    }
  };

  const getColor = (type, priority = 'medium') => {
    const colorMap = {
      high: {
        bill: 'warning',
        budget: 'danger',
        goal: 'success',
        balance: 'danger',
        spending: 'warning',
        system: 'info',
        security: 'danger'
      },
      medium: {
        bill: 'warning',
        budget: 'warning',
        goal: 'info',
        balance: 'warning',
        spending: 'info',
        system: 'info',
        security: 'warning'
      },
      low: {
        bill: 'info',
        budget: 'info',
        goal: 'success',
        balance: 'info',
        spending: 'info',
        system: 'info',
        security: 'info'
      },
      critical: {
        balance: 'danger',
        security: 'danger'
      }
    };

    return colorMap[priority]?.[type] || 'secondary';
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      critical: { text: 'Critical', variant: 'danger' },
      high: { text: 'High', variant: 'warning' },
      medium: { text: 'Medium', variant: 'info' },
      low: { text: 'Low', variant: 'success' }
    };
    
    const priorityInfo = priorityMap[priority] || { text: 'Normal', variant: 'secondary' };
    return (
      <Badge bg={priorityInfo.variant} className="ms-2">
        {priorityInfo.text}
      </Badge>
    );
  };

  return (
    <Card className={`border-maroon ${notification.read ? 'bg-grey-medium' : 'bg-grey-dark'} transition-colors`}>
      <Card.Body className="p-4">
        <div className="d-flex justify-between items-start">
          <div className="flex items-start space-x-3 flex-grow">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${getColor(notification.type, notification.priority)}`}>
              <i className={`${getIcon(notification.type)} text-white`}></i>
            </div>
            <div className="flex-grow">
              <div className="d-flex align-items-center mb-1">
                <p className="text-white mb-0 me-2">{notification.message}</p>
                {notification.priority && getPriorityBadge(notification.priority)}
              </div>
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