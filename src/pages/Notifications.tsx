import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { Bell } from 'lucide-react';

type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

// Simulación: en un proyecto real, esto vendría de un contexto global o API
const mockNotifications: Notification[] = [
  // Ejemplo de notificaciones
  // { id: '1', userId: '123', title: 'Paquete entregado', message: 'Tu paquete ha sido entregado.', createdAt: new Date().toISOString(), read: false },
];

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const userNotifications = notifications.filter(n => n.userId === user?.id);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Bell size={24} /> Notificaciones
      </h1>
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Tus notificaciones</span>
          <span className="text-xs text-primary-600 font-bold">{userNotifications.filter(n => !n.read).length} sin leer</span>
        </div>
        <div className="space-y-3">
          {userNotifications.length === 0 ? (
            <div className="text-gray-500">No tienes notificaciones.</div>
          ) : (
            userNotifications.map(n => (
              <div key={n.id} className={`p-4 rounded-md ${n.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-400'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{n.title}</span>
                    <p className="text-sm text-gray-700">{n.message}</p>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  {!n.read && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(n.id)}>Marcar como leída</Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default Notifications; 