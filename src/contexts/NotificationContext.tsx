import React, { createContext, useContext, useEffect, useState } from 'react';

export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

type NotificationContextType = {
  notifications: Notification[];
  getUserNotifications: (userId: string) => Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const getUserNotifications = (userId: string) =>
    notifications.filter(n => n.userId === userId);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    setNotifications(prev => [
      {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <NotificationContext.Provider value={{ notifications, getUserNotifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification debe usarse dentro de NotificationProvider');
  return ctx;
}; 