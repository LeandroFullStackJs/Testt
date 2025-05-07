import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Package } from 'lucide-react';
import { FreightRequest } from '../../types';
import Card from '../ui/Card';
import FreightStatusBadge from './FreightStatusBadge';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface FreightCardProps {
  freight: FreightRequest;
}

const FreightCard: React.FC<FreightCardProps> = ({ freight }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/freight/${freight.id}`);
  };
  
  return (
    <Card 
      hoverable 
      onClick={handleClick}
      className="transition-all duration-200"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg truncate pr-2">
            {freight.pickup.city} → {freight.delivery.city}
          </h3>
          <FreightStatusBadge status={freight.status} />
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start space-x-2">
            <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium">Origen</p>
              <p className="text-gray-600 text-sm truncate">{freight.pickup.address}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <MapPin size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium">Destino</p>
              <p className="text-gray-600 text-sm truncate">{freight.delivery.address}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Calendar size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium">Fecha solicitada</p>
              <p className="text-gray-600 text-sm">
                {new Date(freight.requestedDate).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-2">
            <Package size={18} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-800 font-medium">Paquete</p>
              <p className="text-gray-600 text-sm">
                {freight.packageDetails.width}x{freight.packageDetails.height}x{freight.packageDetails.length} cm, 
                {freight.packageDetails.weight} kg
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <p className="text-primary-600 font-semibold">
            ${freight.price.toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm">
            {formatDistanceToNow(new Date(freight.createdAt), { 
              addSuffix: true,
              locale: es
            })}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default FreightCard;