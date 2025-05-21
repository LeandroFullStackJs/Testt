import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, ArrowDownUp, Search, FilterX } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FreightCard from '../../components/freight/FreightCard';
import { useFreight } from '../../hooks/useFreight';
import { useAuth } from '../../hooks/useAuth';
import { FreightStatus, FreightRequest } from '../../types';
import { toast } from 'react-toastify';

type SortOption = 'recent' | 'price-low' | 'price-high' | 'distance';

const FreightRequests: React.FC = () => {
  const { freightRequests, isLoading, joinFreightRequest } = useFreight();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FreightStatus | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);
  
  // Divide los fletes en dos listas para el cliente
  let ownFreights: FreightRequest[] = [];
  let sharedFreights: FreightRequest[] = [];
  if (user?.role === 'customer') {
    ownFreights = freightRequests.filter(freight =>
      freight.customerId === user.id ||
      (freight.isShared && (freight.packages || []).some(pkg => pkg.ownerId === user.id))
    );
    sharedFreights = freightRequests.filter(freight =>
      freight.isShared &&
      freight.customerId !== user.id &&
      freight.currentPackages < freight.maxPackages &&
      !(freight.packages || []).some(pkg => pkg.ownerId === user.id) &&
      (statusFilter === 'all' || freight.status === statusFilter) &&
      (
        !searchTerm ||
        freight.pickup.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.delivery.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.pickup.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        freight.delivery.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (freight.packages || []).map(pkg => pkg.description.toLowerCase()).join(' ').includes(searchTerm.toLowerCase())
      )
    );
  }
  
  // Filter freights based on user type
  const filteredFreights = freightRequests.filter(freight => {
    // Filtro para clientes
    if (user?.role === 'customer') {
      // Mostrar fletes compartidos de otros clientes a los que aún se puede unir
      if (freight.isShared && freight.customerId !== user.id && freight.currentPackages < freight.maxPackages) {
        return true;
      }
      // Mostrar los propios pedidos
      if (freight.customerId === user.id) return true;
      return false;
    } else if (user?.role === 'transporter') {
      if (freight.transporterId && freight.transporterId !== user.id) return false;
    }
    // Filtro por estado
    if (statusFilter !== 'all' && freight.status !== statusFilter) return false;
    // Filtro por búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      // Buscar en todos los paquetes
      const packageDescriptions = (freight.packages || []).map(pkg => pkg.description.toLowerCase()).join(' ');
      return (
        freight.pickup.city.toLowerCase().includes(searchLower) ||
        freight.delivery.city.toLowerCase().includes(searchLower) ||
        freight.pickup.address.toLowerCase().includes(searchLower) ||
        freight.delivery.address.toLowerCase().includes(searchLower) ||
        packageDescriptions.includes(searchLower)
      );
    }
    // Mostrar fletes compartidos disponibles para transportistas
    if (freight.isShared && freight.currentPackages < freight.maxPackages) {
      return true;
    }
    return false;
  });
  
  // Sort freights
  const sortedFreights = [...filteredFreights].sort((a, b) => {
    switch (sortOption) {
      case 'recent':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'distance':
        return a.distance - b.distance;
      default:
        return 0;
    }
  });
  
  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortOption('recent');
  };

  const handleJoinFreight = async (freightId: string) => {
    setJoiningId(freightId);
    try {
      await joinFreightRequest(freightId);
      navigate(`/freight/${freightId}/join`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al unirse al flete');
    } finally {
      setJoiningId(null);
    }
  };
  
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === 'customer' ? 'Solicitudes de Flete' : 'Solicitudes Disponibles'}
          </h1>
          <p className="text-gray-600 mt-1">
            {user?.role === 'customer' 
              ? 'Gestiona tus solicitudes de flete o únete a un flete compartido' 
              : 'Explora las solicitudes disponibles para aceptar'}
          </p>
        </div>
        {user?.role === 'customer' && (
          <Link to="/freight/new">
            <Button variant="primary" icon={<Plus size={18} />}>Solicitar nuevo flete</Button>
          </Link>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow">
            <Input
              placeholder="Buscar por ciudad, dirección..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} />}
              fullWidth
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              icon={<ArrowDownUp size={18} />}
            >
              Filtros
            </Button>
            
            {(searchTerm || statusFilter !== 'all' || sortOption !== 'recent') && (
              <Button 
                variant="ghost" 
                onClick={handleReset}
                icon={<FilterX size={18} />}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
        
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as FreightStatus | 'all')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="in_transit">En Tránsito</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordenar por
                </label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="recent">Más recientes</option>
                  <option value="price-low">Precio: Menor a Mayor</option>
                  <option value="price-high">Precio: Mayor a Menor</option>
                  <option value="distance">Distancia: Menor a Mayor</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {isLoading ? (
          <div className="text-center py-10">
            <p>Cargando solicitudes...</p>
          </div>
        ) : user?.role === 'customer' ? (
          <>
            {/* Sección de propios */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mis Solicitudes de Flete</h2>
            {ownFreights.length === 0 ? (
              <div className="text-gray-600 mb-8">No tienes solicitudes de flete propias.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {ownFreights.map(freight => (
                  <FreightCard 
                    key={freight.id} 
                    freight={freight}
                    isOwner={freight.customerId === user.id}
                    isParticipant={freight.customerId !== user.id}
                  />
                ))}
              </div>
            )}
            {/* Sección de compartidos */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fletes Compartidos Disponibles</h2>
            {sharedFreights.length === 0 ? (
              <div className="text-gray-600">No hay fletes compartidos disponibles para unirse.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sharedFreights.map(freight => (
                  <FreightCard 
                    key={freight.id} 
                    freight={freight}
                    onJoinFreight={freight.isShared ? () => handleJoinFreight(freight.id) : undefined}
                    isParticipant={freight.sharedBy?.includes(user.id)}
                    isLoading={joiningId === freight.id}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // Transportistas y otros roles ven la lista normal
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFreights.map(freight => (
              <FreightCard 
                key={freight.id} 
                freight={freight}
                onJoinFreight={freight.isShared ? () => handleJoinFreight(freight.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreightRequests;