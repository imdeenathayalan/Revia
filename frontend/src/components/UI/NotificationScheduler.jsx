import { useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';

function NotificationScheduler() {
  const { addNotification } = useNotification();

  useEffect(() => {
    // Check for scheduled notifications every minute
    const interval = setInterval(() => {
      checkScheduledNotifications();
    }, 60000); // 1 minute

    // Initial check
    checkScheduledNotifications();

    return () => clearInterval(interval);
  }, [addNotification]);

  const checkScheduledNotifications = () => {
    const now = new Date();
    const scheduledNotifications = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
    
    const notificationsToSend = scheduledNotifications.filter(
      scheduled => new Date(scheduled.time) <= now && !sentNotifications.has(scheduled.id)
    );

    notificationsToSend.forEach(notification => {
      addNotification({
        type: notification.type,
        icon: notification.icon,
        message: notification.message,
        priority: notification.priority
      });
      
      // Mark as sent
      markNotificationAsSent(notification.id);
    });
  };

  const markNotificationAsSent = (id) => {
    const sent = JSON.parse(localStorage.getItem('sentNotifications') || '[]');
    localStorage.setItem('sentNotifications', JSON.stringify([...sent, id]));
  };

  const sentNotifications = new Set(JSON.parse(localStorage.getItem('sentNotifications') || '[]'));

  return null; // This is a utility component, no UI
}

// Helper function to schedule notifications from other components
export const scheduleNotification = (notification, delayMs) => {
  const scheduledTime = new Date(Date.now() + delayMs);
  const scheduledNotification = {
    id: Date.now(),
    ...notification,
    time: scheduledTime.toISOString()
  };

  const scheduled = JSON.parse(localStorage.getItem('scheduledNotifications') || '[]');
  localStorage.setItem('scheduledNotifications', JSON.stringify([...scheduled, scheduledNotification]));

  return scheduledNotification.id;
};

export default NotificationScheduler;