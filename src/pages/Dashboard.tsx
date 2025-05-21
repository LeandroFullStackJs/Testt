import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Package, ArrowRight, Clock, Truck, BarChart3, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useFreight } from '../hooks/useFreight';
import FreightCard from '../components/freight/FreightCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { freightRequests, isLoading } = useFreight();
  const [notifications, setNotifications] = useState<any[]>([]); // Simulación, reemplazar por contexto global si lo tienes
  const isCustomer = user?.role === 'customer';
  const isTransporter = user?.role === 'transporter';
  
  // Get recent freight requests (last 3)
  const recentFreights = freightRequests
    .filter(fr => {
      if (isCustomer) return fr.customerId === user?.id;
      if (isTransporter) return fr.transporterId === user?.id || fr.transporterId === undefined;
      return false;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Get active freight (in transit, confirmed)
  const activeFreights = freightRequests.filter(fr => {
    const isActive = fr.status === 'in_transit' || fr.status === 'confirmed';
    if (isCustomer) return isActive && fr.customerId === user?.id;
    if (isTransporter) return isActive && fr.transporterId === user?.id;
    return false;
  });
  
  // Calcula la cantidad de fletes compartidos disponibles para unirse
  const sharedFreightsAvailable = freightRequests.filter(fr =>
    fr.isShared &&
    fr.customerId !== user?.id &&
    fr.currentPackages < fr.maxPackages &&
    !(fr.packages || []).some(pkg => pkg.ownerId === user?.id)
  ).length;
  
  return (
    <div className="space-y-8 pb-16 md:pb-0">
      {/* Welcome section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenido, {user?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              {isCustomer && '¿Necesitas enviar algo hoy?'}
              {isTransporter && '¿Listo para aceptar nuevos fletes?'}
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4">
            {isCustomer && (
              <>
                <Link to="/freight/new">
                  <Button variant="primary" icon={<Plus size={18} />}>Solicitar nuevo flete</Button>
                </Link>
                <Link to="/freight">
                  <Button variant="outline" icon={<Users size={18} />}>
                    Unirse a un flete compartido{sharedFreightsAvailable > 0 ? ` (${sharedFreightsAvailable})` : ''}
                  </Button>
                </Link>
              </>
            )}
            {isTransporter && (
              <Link to="/freight">
                <Button variant="primary" icon={<Package size={18} />}>Ver solicitudes disponibles</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fletes Activos</h3>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Truck className="text-primary-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeFreights.length}</p>
          <p className="text-gray-500 mt-1">en progreso</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Completados</h3>
            <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
              <Package className="text-success-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {freightRequests.filter(fr => {
              if (isCustomer) return fr.status === 'delivered' && fr.customerId === user?.id;
              if (isTransporter) return fr.status === 'delivered' && fr.transporterId === user?.id;
              return false;
            }).length}
          </p>
          <p className="text-gray-500 mt-1">fletes completados</p>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {isCustomer ? 'Total Gastado' : 'Total Ganado'}
            </h3>
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
              <BarChart3 className="text-warning-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${freightRequests
              .filter(fr => {
                if (isCustomer) return fr.status === 'delivered' && fr.customerId === user?.id;
                if (isTransporter) return fr.status === 'delivered' && fr.transporterId === user?.id;
                return false;
              })
              .reduce((acc, fr) => acc + fr.price, 0)
              .toFixed(2)}
          </p>
          <p className="text-gray-500 mt-1">en fletes completados</p>
        </Card>
      </div>
      
      {/* Active freights section */}
      {activeFreights.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Fletes Activos</h2>
            <Link to="/freight" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
              Ver todos
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeFreights.map(freight => (
              <FreightCard key={freight.id} freight={freight} />
            ))}
          </div>
        </div>
      )}
      
      {/* Recent freights section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isCustomer ? 'Mis Solicitudes Recientes' : 'Fletes Recientes'}
          </h2>
          <Link to="/freight" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
            Ver todos
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : recentFreights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentFreights.map(freight => (
              <FreightCard key={freight.id} freight={freight} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">
              {isCustomer 
                ? 'Aún no has creado ninguna solicitud de flete.' 
                : 'No tienes fletes recientes.'}
            </p>
            {isCustomer && (
              <Link to="/freight/new">
                <Button variant="primary" icon={<Plus size={18} />}>
                  Solicitar nuevo flete
                </Button>
              </Link>
            )}
            {isTransporter && (
              <Link to="/freight">
                <Button variant="primary" icon={<Package size={18} />}>
                  Ver solicitudes disponibles
                </Button>
              </Link>
            )}
          </Card>
        )}
      </div>
      
      {/* Quick access section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Accesos rápidos</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center transition-transform hover:scale-[1.02] cursor-pointer">
            <Link to="/freight" className="flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                <Package className="text-primary-600" size={24} />
              </div>
              <p className="font-medium text-gray-900">Fletes</p>
            </Link>
          </Card>
          
          <Card className="p-4 text-center transition-transform hover:scale-[1.02] cursor-pointer">
            <Link to="/profile" className="flex flex-col items-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-2">
                <MapPin className="text-secondary-600" size={24} />
              </div>
              <p className="font-medium text-gray-900">Mi Perfil</p>
            </Link>
          </Card>
          
          <Card className="p-4 text-center transition-transform hover:scale-[1.02] cursor-pointer">
            <Link to="/chat" className="flex flex-col items-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-2">
                <Clock className="text-accent-600" size={24} />
              </div>
              <p className="font-medium text-gray-900">Mensajes</p>
            </Link>
          </Card>
          
          <Card className="p-4 text-center transition-transform hover:scale-[1.02] cursor-pointer">
            <Link to="/support" className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                <Truck className="text-gray-600" size={24} />
              </div>
              <p className="font-medium text-gray-900">Soporte</p>
            </Link>
          </Card>
          
          <Link to="/freight" className="block">
            <div className="bg-blue-50 hover:bg-blue-100 transition rounded-lg p-4 flex flex-col items-center justify-center h-full">
              <Users size={32} className="text-blue-600 mb-2" />
              <span className="font-medium text-blue-900">Fletes Compartidos</span>
              <span className="text-xs text-blue-700 mt-1">Ver y unirte a fletes de otros</span>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Notifications section */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Notificaciones</h2>
          <span className="text-xs text-primary-600 font-bold">{notifications.filter(n => !n.read && n.userId === user?.id).length} sin leer</span>
        </div>
        <div className="space-y-2">
          {notifications.filter(n => n.userId === user?.id).length === 0 ? (
            <div className="text-gray-500">No tienes notificaciones.</div>
          ) : (
            notifications.filter(n => n.userId === user?.id).map(n => (
              <div key={n.id} className={`p-3 rounded-md ${n.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-400'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">{n.title}</span>
                    <p className="text-sm text-gray-700">{n.message}</p>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  {!n.read && (
                    <Button size="xs" variant="outline" onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}>Marcar como leída</Button>
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

export default Dashboard;