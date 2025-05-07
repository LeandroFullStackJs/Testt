import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Package, Calendar, TruckIcon, Clock, User, MessageSquare,
  CheckCircle, AlertCircle, X, ArrowLeft, Star
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FreightStatusBadge from '../../components/freight/FreightStatusBadge';
import { useFreight } from '../../hooks/useFreight';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FreightStatus } from '../../types';
import { motion } from 'framer-motion';

const FreightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFreightRequest, updateFreightStatus, acceptFreightRequest, isLoading } = useFreight();
  const { user } = useAuth();
  const [activeStatus, setActiveStatus] = useState<FreightStatus | null>(null);
  
  const freight = getFreightRequest(id!);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p>Cargando...</p>
      </div>
    );
  }
  
  if (!freight) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Flete no encontrado</h2>
        <p className="text-gray-600 mb-6">La solicitud de flete que buscas no existe o ha sido eliminada.</p>
        <Link to="/freight">
          <Button variant="primary" icon={<ArrowLeft size={18} />}>
            Volver a Fletes
          </Button>
        </Link>
      </div>
    );
  }
  
  const isCustomer = user?.id === freight.customerId;
  const isTransporter = user?.id === freight.transporterId;
  const isPending = freight.status === 'pending';
  const isConfirmed = freight.status === 'confirmed';
  const isInTransit = freight.status === 'in_transit';
  const isDelivered = freight.status === 'delivered';
  const isCancelled = freight.status === 'cancelled';
  
  const canAccept = user?.role === 'transporter' && isPending && !freight.transporterId;
  const canCancel = (isCustomer || isTransporter) && (isPending || isConfirmed);
  const canStartTransit = isTransporter && isConfirmed;
  const canCompleteDelivery = isTransporter && isInTransit;
  
  const handleAccept = async () => {
    try {
      await acceptFreightRequest(freight.id);
    } catch (error) {
      console.error('Error accepting freight:', error);
    }
  };
  
  const handleUpdateStatus = async (status: FreightStatus) => {
    try {
      setActiveStatus(status);
      await updateFreightStatus(freight.id, status);
      setActiveStatus(null);
    } catch (error) {
      console.error('Error updating status:', error);
      setActiveStatus(null);
    }
  };
  
  return (
    <div className="space-y-6 pb-16 md:pb-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <Link to="/freight" className="text-gray-500 hover:text-primary-600 mr-2">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Detalle de Flete
          </h1>
        </div>
        
        <FreightStatusBadge status={freight.status} className="text-sm" />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Route Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ruta</h2>
            
            <div className="relative pl-6 space-y-6">
              {/* Vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-primary-200"></div>
              
              <div className="flex items-start">
                <div className="absolute left-0 w-4 h-4 rounded-full bg-primary-500 border-2 border-white"></div>
                <div className="pl-4">
                  <p className="text-sm text-gray-500">Origen</p>
                  <p className="font-medium text-gray-900">{freight.pickup.address}</p>
                  <p className="text-gray-600">{freight.pickup.city}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="absolute left-0 w-4 h-4 rounded-full bg-accent-500 border-2 border-white"></div>
                <div className="pl-4">
                  <p className="text-sm text-gray-500">Destino</p>
                  <p className="font-medium text-gray-900">{freight.delivery.address}</p>
                  <p className="text-gray-600">{freight.delivery.city}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Distancia</p>
                <p className="font-medium text-gray-900">{freight.distance} km</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Fecha solicitada</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(freight.requestedDate), 'dd MMM yyyy, HH:mm', { locale: es })}
                </p>
              </div>
              
              {freight.estimatedArrival && (
                <div>
                  <p className="text-sm text-gray-500">Llegada estimada</p>
                  <p className="font-medium text-gray-900">
                    {format(new Date(freight.estimatedArrival), 'dd MMM yyyy, HH:mm', { locale: es })}
                  </p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Package Details Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Paquete</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Ancho</p>
                <p className="font-medium text-gray-900">{freight.packageDetails.width} cm</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Alto</p>
                <p className="font-medium text-gray-900">{freight.packageDetails.height} cm</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Largo</p>
                <p className="font-medium text-gray-900">{freight.packageDetails.length} cm</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Peso</p>
                <p className="font-medium text-gray-900">{freight.packageDetails.weight} kg</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Descripción</p>
              <p className="text-gray-900">{freight.packageDetails.description}</p>
            </div>
            
            {freight.packageDetails.photos && freight.packageDetails.photos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Fotos</p>
                <div className="grid grid-cols-3 gap-2">
                  {freight.packageDetails.photos.map((photo, index) => (
                    <img 
                      key={index}
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="rounded-md h-24 w-full object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
          </Card>
          
          {/* Tracking Status Card */}
          {(isConfirmed || isInTransit || isDelivered) && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Estado del Envío
              </h2>
              
              <div className="relative pl-6 space-y-8">
                {/* Vertical line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-200"></div>
                
                <div className="flex items-start">
                  <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-white ${
                    isConfirmed || isInTransit || isDelivered
                      ? 'bg-success-500'
                      : 'bg-gray-300'
                  }`}></div>
                  <div className="pl-4">
                    <p className="font-medium text-gray-900">Confirmado</p>
                    <p className="text-sm text-gray-600">
                      El transportista ha aceptado tu solicitud
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-white ${
                    isInTransit || isDelivered
                      ? 'bg-success-500'
                      : 'bg-gray-300'
                  }`}></div>
                  <div className="pl-4">
                    <p className="font-medium text-gray-900">En Tránsito</p>
                    <p className="text-sm text-gray-600">
                      Tu paquete está en camino
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-white ${
                    isDelivered
                      ? 'bg-success-500'
                      : 'bg-gray-300'
                  }`}></div>
                  <div className="pl-4">
                    <p className="font-medium text-gray-900">Entregado</p>
                    <p className="text-sm text-gray-600">
                      El envío ha sido entregado en el destino
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Precio</h2>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Tarifa base</p>
              <p className="font-medium text-gray-900">${(freight.price * 0.85).toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-gray-600">Comisión de servicio</p>
              <p className="font-medium text-gray-900">${(freight.price * 0.15).toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <p className="font-semibold text-gray-900">Total</p>
              <p className="font-bold text-xl text-primary-600">${freight.price.toFixed(2)}</p>
            </div>
          </Card>
          
          {/* People Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personas</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {freight.customerAvatar ? (
                    <img 
                      src={freight.customerAvatar} 
                      alt={freight.customerName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{freight.customerName}</p>
                  <p className="text-sm text-gray-500">Cliente</p>
                </div>
              </div>
              
              {freight.transporterId && (
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    {freight.transporterAvatar ? (
                      <img 
                        src={freight.transporterAvatar} 
                        alt={freight.transporterName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-secondary-100 text-secondary-600 rounded-full flex items-center justify-center">
                        <TruckIcon size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{freight.transporterName}</p>
                    <p className="text-sm text-gray-500">Transportista</p>
                  </div>
                </div>
              )}
            </div>
            
            {freight.transporterId && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to={`/chat/${freight.id}`}>
                  <Button 
                    variant="outline" 
                    fullWidth
                    icon={<MessageSquare size={18} />}
                  >
                    Enviar mensaje
                  </Button>
                </Link>
              </div>
            )}
          </Card>
          
          {/* Actions Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones</h2>
            
            <div className="space-y-3">
              {canAccept && (
                <Button 
                  variant="primary" 
                  fullWidth
                  icon={<CheckCircle size={18} />}
                  onClick={handleAccept}
                  isLoading={isLoading}
                >
                  Aceptar Flete
                </Button>
              )}
              
              {canStartTransit && (
                <Button 
                  variant="primary" 
                  fullWidth
                  icon={<TruckIcon size={18} />}
                  onClick={() => handleUpdateStatus('in_transit')}
                  isLoading={activeStatus === 'in_transit'}
                >
                  Iniciar Transporte
                </Button>
              )}
              
              {canCompleteDelivery && (
                <Button 
                  variant="primary" 
                  fullWidth
                  icon={<CheckCircle size={18} />}
                  onClick={() => handleUpdateStatus('delivered')}
                  isLoading={activeStatus === 'delivered'}
                >
                  Marcar como Entregado
                </Button>
              )}
              
              {isDelivered && isCustomer && (
                <Button 
                  variant="outline" 
                  fullWidth
                  icon={<Star size={18} />}
                >
                  Calificar Servicio
                </Button>
              )}
              
              {canCancel && (
                <Button 
                  variant="outline"
                  fullWidth
                  icon={<X size={18} />}
                  onClick={() => handleUpdateStatus('cancelled')}
                  isLoading={activeStatus === 'cancelled'}
                  className="border-error-300 text-error-600 hover:bg-error-50"
                >
                  Cancelar Flete
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FreightDetails;