// src/components/UI/NotificationTester.jsx
import { Button, Card } from 'react-bootstrap';
import { useNotification } from '../../context/NotificationContext';
import { scheduleNotification } from './NotificationScheduler';

function NotificationTester() {
  const { addNotification } = useNotification();

  const testImmediateNotification = () => {
    addNotification({
      type: 'test',
      icon: 'bi-bell',
      message: 'This is an immediate test notification!',
      priority: 'medium'
    });
    console.log('✅ Immediate notification sent');
  };

  const testScheduledNotification = () => {
    const notificationId = scheduleNotification({
      type: 'test',
      icon: 'bi-clock',
      message: 'This is a scheduled test notification!',
      priority: 'high'
    }, 10000); // 10 seconds from now
    
    console.log('⏰ Notification scheduled with ID:', notificationId);
  };

  const testMultipleScheduled = () => {
    // Schedule notifications at different times
    scheduleNotification({
      type: 'test',
      icon: 'bi-1-circle',
      message: 'Scheduled notification #1 (30 seconds)',
      priority: 'low'
    }, 30000);

    scheduleNotification({
      type: 'test',
      icon: 'bi-2-circle',
      message: 'Scheduled notification #2 (1 minute)',
      priority: 'medium'
    }, 60000);

    scheduleNotification({
      type: 'test',
      icon: 'bi-3-circle',
      message: 'Scheduled notification #3 (2 minutes)',
      priority: 'high'
    }, 120000);

    console.log('⏰ Multiple notifications scheduled');
  };

  const clearScheduled = () => {
    localStorage.removeItem('scheduledNotifications');
    console.log('🧹 Cleared all scheduled notifications');
  };

  const viewScheduled = () => {
    const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
    console.log('📋 Scheduled notifications:', scheduled);
    alert(`Scheduled notifications: ${scheduled.length}\n${JSON.stringify(scheduled, null, 2)}`);
  };

  return (
    <Card className="bg-grey-medium border border-maroon mb-4">
      <Card.Body className="p-4">
        <h4 className="text-white mb-3">
          <i className="bi bi-gear me-2"></i>
          Notification Tester
        </h4>
        
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Button
            variant="outline-info"
            size="sm"
            onClick={testImmediateNotification}
          >
            <i className="bi bi-bell me-1"></i>
            Test Immediate
          </Button>
          
          <Button
            variant="outline-warning"
            size="sm"
            onClick={testScheduledNotification}
          >
            <i className="bi bi-clock me-1"></i>
            Test Scheduled (10s)
          </Button>
          
          <Button
            variant="outline-primary"
            size="sm"
            onClick={testMultipleScheduled}
          >
            <i className="bi bi-list-check me-1"></i>
            Test Multiple
          </Button>
          
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={viewScheduled}
          >
            <i className="bi bi-eye me-1"></i>
            View Scheduled
          </Button>
          
          <Button
            variant="outline-danger"
            size="sm"
            onClick={clearScheduled}
          >
            <i className="bi bi-trash me-1"></i>
            Clear All
          </Button>
        </div>
        
        <small className="text-maroon-light">
          Open browser console (F12) to see debug messages and verify scheduler is working.
        </small>
      </Card.Body>
    </Card>
  );
}

export default NotificationTester;