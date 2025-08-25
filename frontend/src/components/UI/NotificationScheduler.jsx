import { useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';

function NotificationScheduler() {
  const { addNotification } = useNotification();

  useEffect(() => {
    console.log('🔔 NotificationScheduler mounted - starting interval');
    
    // Check for scheduled notifications every minute
    const interval = setInterval(() => {
      console.log('🔔 NotificationScheduler checking for scheduled notifications...');
      checkScheduledNotifications();
    }, 60000); // 1 minute

    // Initial check
    console.log('🔔 NotificationScheduler performing initial check');
    checkScheduledNotifications();

    return () => {
      console.log('🔔 NotificationScheduler cleaning up interval');
      clearInterval(interval);
    };
  }, [addNotification]);

  const checkScheduledNotifications = () => {
    const now = new Date();
    console.log('🔔 Checking scheduled notifications at:', now.toLocaleTimeString());
    
    const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
    console.log('🔔 Found', scheduledNotifications.length, 'scheduled notifications');
    
    const notificationsToSend = scheduledNotifications.filter(
      scheduled => new Date(scheduled.time) <= now
    );

    console.log('🔔', notificationsToSend.length, 'notifications ready to send');
    
    notificationsToSend.forEach(notification => {
      console.log('🔔 Sending scheduled notification:', notification.message);
      addNotification({
        type: notification.type,
        icon: notification.icon,
        message: notification.message,
        priority: notification.priority
      });
    });
  };

  return null;
}

export const scheduleNotification = (notification, delayMs) => {
  const scheduledTime = new Date(Date.now() + delayMs);
  const scheduledNotification = {
    id: Date.now(),
    ...notification,
    time: scheduledTime.toISOString()
  };

  console.log('🔔 Scheduling notification for:', scheduledTime.toLocaleTimeString());

  const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
  localStorage.setItem('scheduledNotifications', JSON.stringify([...scheduled, scheduledNotification]));

  return scheduledNotification.id;
};

export default NotificationScheduler;