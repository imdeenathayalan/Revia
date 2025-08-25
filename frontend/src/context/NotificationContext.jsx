import { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
    // Update browser tab title with unread count
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Revia - Finance Tracker`;
    } else {
      document.title = 'Revia - Finance Tracker';
    }
  }, [notifications, unreadCount]);

  const loadNotifications = () => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      try {
        const parsedNotifications = JSON.parse(saved);
        // Ensure all notifications have proper structure
        const enhancedNotifications = parsedNotifications.map(notification => ({
          ...notification,
          priority: notification.priority || 'medium',
          read: notification.read || false,
          timestamp: notification.timestamp || new Date().toISOString()
        }));
        setNotifications(enhancedNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
        localStorage.removeItem('notifications');
        setNotifications([]);
      }
    }
    setIsLoading(false);
  };

  const saveNotifications = (updatedNotifications) => {
    // Keep only last 100 notifications to prevent storage bloat
    const trimmedNotifications = updatedNotifications.slice(-100);
    localStorage.setItem('notifications', JSON.stringify(trimmedNotifications));
    setNotifications(trimmedNotifications);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
      priority: notification.priority || 'medium'
    };
    const updated = [newNotification, ...notifications];
    saveNotifications(updated);
    
    // Play sound if enabled and notification is important
    const settings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
    if (settings.soundEnabled && ['high', 'critical'].includes(newNotification.priority)) {
      playNotificationSound();
    }
    
    return newNotification;
  };

  const playNotificationSound = () => {
    // Simple notification sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio context not supported:', error);
    }
  };

  const markAsRead = (id) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const getNotificationsByType = (type) => {
    return notifications.filter(n => n.type === type);
  };

  const getNotificationsByPriority = (priority) => {
    return notifications.filter(n => n.priority === priority);
  };

  const getUnreadNotifications = () => {
    return notifications.filter(n => !n.read);
  };

  const getRecentNotifications = (limit = 10) => {
    return notifications.slice(0, limit);
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    getNotificationsByType,
    getNotificationsByPriority,
    getUnreadNotifications,
    getRecentNotifications,
    refreshNotifications: loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;