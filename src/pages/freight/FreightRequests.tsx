import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowDownUp, Search, FilterX } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FreightCard from '../../components/freight/FreightCard';
import { useFreight } from '../../hooks/useFreight';
import { useAuth } from '../../hooks/useAuth';
import { FreightStatus } from '../../types';

type SortOption = 'recent' | 'price-low' | 'price-high' | 'distance';

const FreightRequests: React.FC = () => {
  const { freightRequests, isLoading } = useFreight();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FreightStatus | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter freights based on user type
  const filteredFreights = freightRequests.filter(freight => {
    // Filter by user role
    if (user?.role === 'customer') {
      if (freight.customerId !== user.id) return false;
    } else if (user?.role === 'transporter') {
      if (freight.transporterId && freight.transporterId !== user.id) return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && freight.status !== statusFilter) return false;
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        freight.pickup.city.toLowerCase().includes(searchLower) ||
        freight.delivery.city.toLowerCase().includes(searchLower) ||
        freight.pickup.address.toLowerCase().includes(searchLower) ||
        freight.delivery.address.toLowerCase().includes(searchLower) ||
        freight.packageDetails.description.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
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
  
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.role === 'customer' ? 'Mis Solicitudes de Flete' : 'Solicitudes Disponibles'}
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.role === 'customer' 
                ? 'Gestiona tus solicitudes de flete' 
                : 'Explora las solicitudes disponibles para aceptar'}
            </p>
          </div>
          
          {user?.role === 'customer' && (
            <Link to="/freight/new">
              <Button variant="primary" icon={<Plus size={18} />}>
                Solicitar nuevo flete
              </Button>
            </Link>
          )}
        </div>
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
        ) : sortedFreights.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 mb-4">No se encontraron solicitudes de flete.</p>
            {user?.role === 'customer' && (
              <Link to="/freight/new">
                <Button variant="primary" icon={<Plus size={18} />}>
                  Solicitar nuevo flete
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFreights.map(freight => (
              <FreightCard key={freight.id} freight={freight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreightRequests;