import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Package, Calendar, TruckIcon, Clock, User, MessageSquare,
  CheckCircle, AlertCircle, X, ArrowLeft, Star, Plus
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import FreightStatusBadge from '../../components/freight/FreightStatusBadge';
import { useFreight } from '../../hooks/useFreight';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FreightStatus, Review, DeliveryStatus, PackageItem } from '../../types';
import { motion } from 'framer-motion';
import { Tooltip } from '../../components/ui/Tooltip';
import mockUsers from '../../data/mockUsers';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';
import { useNotification } from '../../contexts/NotificationContext';
import Input from '../../components/ui/Input';

interface ParticipantRoute {
  userId: string;
  userName: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  distance: number;
}

interface RouteItem {
  userId: string;
  userName: string;
  originAddress: string;
  originCity: string;
  destinationAddress: string;
  destinationCity: string;
  latitude: number;
  longitude: number;
}

const FreightDetails: React.FC = () => {
  // TODOS los hooks al principio
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFreightRequest, updateFreightStatus, acceptFreightRequest, isLoading, reviews, addReview, joinFreightRequest, setFreightRequests } = useFreight();
  const { user } = useAuth();
  const [activeStatus, setActiveStatus] = useState<FreightStatus | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<string | null>(null);
  const [reviewRole, setReviewRole] = useState<'customer' | 'transporter' | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelFleteModal, setShowCancelFleteModal] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]); // Simulación de notificaciones
  const { addNotification } = useNotification();
  const freight = getFreightRequest(id!);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | null>(null);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);

  // useEffect también debe ir aquí
  useEffect(() => {
    if (freight?.participants) {
      const routes = freight.participants.map(participant => ({
        userId: participant.id,
        userName: participant.name,
        address: participant.address,
        city: participant.city,
        latitude: participant.latitude,
        longitude: participant.longitude,
        distance: 0 // Se calculará después
      }));
      // setParticipantRoutes(sortRoutesByProximity(routes));
    }
  }, [freight, user]);

  // Returns condicionales después de TODOS los hooks
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
  const canJoinFreight = user?.role === 'customer' && isPending && !isCustomer && freight.currentPackages < freight.maxPackages;
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
  
  const isParticipant = !!(user && (freight.sharedBy?.includes(user.id) || (freight.packages || []).some(pkg => pkg.ownerId === user.id)));
  
  const handleJoinFreight = () => {
    navigate(`/freight/${freight.id}/join`);
  };
  
  const uniqueClients = Array.from(new Set([
    freight.customerId,
    ...(freight.packages || []).map(pkg => pkg.ownerId)
  ])).filter(Boolean);
  const uniqueClientNames = Array.from(new Set([
    freight.customerName,
    ...(freight.packages || []).map(pkg => pkg.ownerName)
  ])).filter(Boolean);
  
  const isCurrentUser = (id: string) => user && user.id === id;
  
  const hasReviewedTransporter = reviews.some(r => r.freightId === freight.id && r.authorId === user?.id && r.role === 'transporter');
  const hasReviewedAllCustomers = uniqueClients.filter(cid => cid !== freight.customerId).every(cid => reviews.some(r => r.freightId === freight.id && r.authorId === user?.id && r.targetId === cid && r.role === 'customer'));
  
  const freightReviews = reviews.filter(r => r.freightId === freight.id);
  
  // Función para calcular la distancia entre dos puntos (simplificada)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Implementación simplificada - en producción usar una API de geocoding
    return Math.abs(lat1 - lat2) + Math.abs(lon1 - lon2);
  };

  // Función para ordenar rutas por proximidad
  const sortRoutesByProximity = (routes: ParticipantRoute[]) => {
    if (!user?.location || typeof user.location.latitude !== 'number' || typeof user.location.longitude !== 'number') return routes;
    const { latitude, longitude } = user.location;
    return [...routes].sort((a, b) => {
      const distA = calculateDistance(
        latitude,
        longitude,
        a.latitude,
        a.longitude
      );
      const distB = calculateDistance(
        latitude,
        longitude,
        b.latitude,
        b.longitude
      );
      return distA - distB;
    });
  };
  
  // Construir la ruta del creador (siempre primero)
  const creatorRoute: RouteItem = {
    userId: freight.customerId,
    userName: freight.customerName,
    originAddress: freight.pickup.address,
    originCity: freight.pickup.city,
    destinationAddress: freight.delivery.address,
    destinationCity: freight.delivery.city,
    latitude: 0,
    longitude: 0,
  };
  // Rutas de los participantes (excluyendo al creador)
  const participantRoutes: RouteItem[] = (freight.participants || [])
    .filter(p => p.id !== freight.customerId)
    .map(participant => ({
      userId: participant.id,
      userName: participant.name,
      originAddress: participant.address || '',
      originCity: participant.city || '',
      destinationAddress: (participant as any).destinationAddress || '',
      destinationCity: (participant as any).destinationCity || '',
      latitude: participant.latitude,
      longitude: participant.longitude,
    }));
  // Ordenar rutas de participantes por cercanía al transportista (si existe)
  const referenceLocation = freight.transporterId && freight.transporterId !== ''
    ? freight.participants?.find(p => p.id === freight.transporterId)
    : null;
  const sortedParticipantRoutes = referenceLocation && referenceLocation.latitude && referenceLocation.longitude
    ? [...participantRoutes].sort((a, b) => {
        const distA = calculateDistance(referenceLocation.latitude, referenceLocation.longitude, a.latitude, a.longitude);
        const distB = calculateDistance(referenceLocation.latitude, referenceLocation.longitude, b.latitude, b.longitude);
        return distA - distB;
      })
    : participantRoutes;
  // Unir la ruta del creador y las de los participantes
  const sortedRoutes = [creatorRoute, ...sortedParticipantRoutes];
  
  // Ordenar paquetes por algún criterio (por ejemplo, por orden de creación)
  const sortedPackages: PackageItem[] = [...(freight.packages || [])];
  // Determinar el índice del primer paquete pendiente o en tránsito
  const nextIndex = sortedPackages.findIndex(pkg => pkg.deliveryStatus === 'in_transit' || pkg.deliveryStatus === 'pending' || !pkg.deliveryStatus);
  
  const handleMarkDelivered = (pkgId: string) => {
    // Actualizar el estado del paquete a 'delivered', el siguiente a 'in_transit'
    const updatedPackages = sortedPackages.map((pkg, idx) => {
      if (pkg.id === pkgId) {
        return { ...pkg, deliveryStatus: 'delivered' as DeliveryStatus };
      }
      // El siguiente paquete pendiente pasa a 'in_transit'
      if (idx === nextIndex + 1 && (pkg.deliveryStatus === 'pending' || !pkg.deliveryStatus)) {
        return { ...pkg, deliveryStatus: 'in_transit' as DeliveryStatus };
      }
      return pkg;
    });
    // Notificar al dueño del paquete entregado
    const deliveredPkg = sortedPackages.find(pkg => pkg.id === pkgId);
    if (deliveredPkg) {
      addNotification({
        userId: deliveredPkg.ownerId,
        title: '¡Tu pedido fue entregado!',
        message: `El paquete "${deliveredPkg.description}" ha sido entregado.`,
      });
    }
    // Notificar al siguiente dueño si hay uno
    const nextPkg = updatedPackages[nextIndex + 1];
    if (nextPkg && nextPkg.ownerId) {
      addNotification({
        userId: nextPkg.ownerId,
        title: '¡Tu pedido está en camino!',
        message: `El paquete "${nextPkg.description}" está en camino hacia tu destino.`,
      });
    }
    // Si todos están entregados, marcar el flete como entregado
    const allDelivered = updatedPackages.every(pkg => pkg.deliveryStatus === 'delivered');
    const updatedFreight = {
      ...freight,
      packages: updatedPackages,
      status: allDelivered ? 'delivered' : freight.status,
    };
    setFreightRequests((prev: any) => prev.map((f: any) => f.id === freight.id ? updatedFreight : f));
  };

  const handleOpenPaymentModal = (pkg: PackageItem) => {
    setSelectedPackage(pkg);
    setPaymentMethod(null);
    setPaymentProof(null);
    setShowPaymentModal(true);
  };

  const handlePay = () => {
    if (!selectedPackage || !paymentMethod || (paymentMethod === 'bank' && !paymentProof)) return;
    // Actualizar el paquete
    const updatedPackages = sortedPackages.map(pkg =>
      pkg.id === selectedPackage.id
        ? { ...pkg, paymentStatus: 'paid', paymentMethod, paymentProof: paymentMethod === 'bank' ? paymentProof : null }
        : pkg
    );
    setFreightRequests((prev: any) => prev.map((f: any) => f.id === freight.id ? { ...f, packages: updatedPackages } : f));
    addNotification({
      userId: freight.transporterId!,
      title: 'Pago recibido',
      message: `El cliente ${user?.name} pagó el envío del paquete "${selectedPackage.description}".`
    });
    setShowPaymentModal(false);
  };

  const handleConfirmPayment = (pkg: PackageItem) => {
    const updatedPackages = sortedPackages.map(p =>
      p.id === pkg.id ? { ...p, paymentStatus: 'confirmed' } : p
    );
    setFreightRequests((prev: any) => prev.map((f: any) => f.id === freight.id ? { ...f, packages: updatedPackages } : f));
    addNotification({
      userId: pkg.ownerId,
      title: 'Pago confirmado',
      message: `El transportista confirmó tu pago del paquete "${pkg.description}".`
    });
  };

  // Calcular el precio total de los paquetes del usuario actual
  const myPackages = sortedPackages.filter(pkg => pkg.ownerId === user?.id);
  const myTotal = myPackages.reduce((acc, pkg) => acc + (pkg.price || 0), 0);
  const isMyFreight = user?.id === freight.customerId;

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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Ruta</h2>
              {canJoinFreight && !isParticipant && (
                <Button
                  variant="primary"
                  icon={<Plus size={18} />}
                  onClick={handleJoinFreight}
                  isLoading={isJoining}
                >
                  Unirse al Flete
                </Button>
              )}
            </div>
            
            <div className="relative pl-6 space-y-6">
              {/* Vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-primary-200"></div>
              
              {/* Ruta del creador */}
              {sortedRoutes.map((route, idx) => (
                <div key={route.userId} className="flex items-start">
                  <div className={`absolute left-0 w-4 h-4 rounded-full ${idx === 0 ? 'bg-primary-500' : idx === sortedRoutes.length - 1 ? 'bg-success-500' : 'bg-accent-500'} border-2 border-white`}></div>
                  <div className="pl-4">
                    <p className="text-sm text-gray-500">
                      {idx === 0 ? 'Origen (Creador)' : idx === sortedRoutes.length - 1 ? 'Destino Final' : `Parada ${idx}`}
                    </p>
                    <p className="font-medium text-gray-900">{route.userName}</p>
                    <p className="text-gray-600">{route.originAddress} {route.originCity && `- ${route.originCity}`}</p>
                    {route.destinationAddress && (
                      <p className="text-gray-500 text-sm">Destino: {route.destinationAddress} {route.destinationCity && `- ${route.destinationCity}`}</p>
                    )}
                  </div>
                </div>
              ))}
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles de los Paquetes</h2>
            {freight.packages && freight.packages.length > 0 ? (
              freight.packages.map((pkg, idx) => (
                <div key={pkg.id} className={`mb-4 p-4 rounded-md ${isCurrentUser(pkg.ownerId) ? 'bg-blue-50 border-2 border-blue-300' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-2">
                    <div>
                      <p className="text-sm text-gray-500">Ancho</p>
                      <p className="font-medium text-gray-900">{pkg.width} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Alto</p>
                      <p className="font-medium text-gray-900">{pkg.height} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Largo</p>
                      <p className="font-medium text-gray-900">{pkg.length} cm</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Peso</p>
                      <p className="font-medium text-gray-900">{pkg.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dueño</p>
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-gray-900">{pkg.ownerName || 'Desconocido'}</p>
                        {isCurrentUser(pkg.ownerId) && (
                          <Tooltip text="Este paquete es tuyo">
                            <span className="text-blue-600 font-bold">(Tú)</span>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Descripción</p>
                    <p className="text-gray-900">{pkg.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No hay paquetes registrados.</div>
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
          
          {/* Paradas y Entregas Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Paradas y Entregas</h2>
            <div className="space-y-4">
              {sortedPackages.map((pkg, idx) => (
                <div key={pkg.id} className={`p-4 rounded-md border ${pkg.deliveryStatus === 'delivered' ? 'bg-green-50 border-green-200' : pkg.deliveryStatus === 'in_transit' ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold">{pkg.ownerName}</span>
                      <span className="ml-2 text-xs px-2 py-1 rounded-full "
                        style={{ background: pkg.deliveryStatus === 'delivered' ? '#bbf7d0' : pkg.deliveryStatus === 'in_transit' ? '#dbeafe' : '#f3f4f6', color: '#222' }}>
                        {pkg.deliveryStatus === 'delivered' ? 'Entregado' : pkg.deliveryStatus === 'in_transit' ? 'En camino' : 'Pendiente'}
                      </span>
                    </div>
                    {isTransporter && idx === nextIndex && pkg.deliveryStatus !== 'delivered' && (
                      <Button variant="primary" size="sm" onClick={() => handleMarkDelivered(pkg.id)}>
                        Marcar como Entregado
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 mb-2">
                    <div><b>Origen:</b> {(pkg as any).origin?.address || freight.pickup.address} - {(pkg as any).origin?.city || freight.pickup.city}</div>
                    <div><b>Destino:</b> {(pkg as any).destination?.address || freight.delivery.address} - {(pkg as any).destination?.city || freight.delivery.city}</div>
                    <div><b>Descripción:</b> {pkg.description}</div>
                  </div>
                  <div className="flex flex-wrap gap-4 items-center text-sm mt-2">
                    <div><b>Precio:</b> ${pkg.price?.toFixed(2) || '0.00'}</div>
                    <div><b>Distancia:</b> {pkg.distance || '-'} km</div>
                    <div><b>Espacio:</b> {pkg.space?.toFixed(2) || '-'} m³</div>
                    <div><b>Pago:</b> {pkg.paymentStatus === 'pending' ? 'Pendiente' : pkg.paymentStatus === 'paid' ? 'Pagado (a confirmar)' : 'Confirmado'}</div>
                    {isCurrentUser(pkg.ownerId) && pkg.deliveryStatus === 'delivered' && pkg.paymentStatus === 'pending' && (
                      <Button size="sm" variant="primary" onClick={() => handleOpenPaymentModal(pkg)}>
                        Pagar mi envío
                      </Button>
                    )}
                    {isTransporter && pkg.paymentStatus === 'paid' && (
                      <Button size="sm" variant="primary" onClick={() => handleConfirmPayment(pkg)}>
                        Confirmar pago recibido
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Precio</h2>
            {isMyFreight ? (
              <>
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
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Tarifa base</p>
                  <p className="font-medium text-gray-900">${(myTotal * 0.85).toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Comisión de servicio</p>
                  <p className="font-medium text-gray-900">${(myTotal * 0.15).toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <p className="font-semibold text-gray-900">Total</p>
                  <p className="font-bold text-xl text-primary-600">${myTotal.toFixed(2)}</p>
                </div>
              </>
            )}
          </Card>
          
          {/* People Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personas</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Personas</h3>
              {uniqueClients.map((id, idx) => (
                <div key={id} className={`flex items-center gap-2 mb-1 ${isCurrentUser(id) ? 'bg-blue-50 rounded px-1' : ''}`}>
                  <span className="inline-block bg-gray-100 rounded-full p-1">
                    <span className="text-primary-600 font-bold">{uniqueClientNames[idx]?.[0] || '?'}</span>
                  </span>
                  <span className={`text-gray-900 font-medium ${isCurrentUser(id) ? 'text-blue-700 font-bold' : ''}`}>{uniqueClientNames[idx]}{isCurrentUser(id) && ' (Tú)'}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {id === freight.customerId ? 'Creador' : 'Participante'}
                  </span>
                </div>
              ))}
              {/* Transportista */}
              {freight.transporterId && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-block bg-secondary-100 rounded-full p-1">
                    <TruckIcon size={16} className="text-secondary-600" />
                  </span>
                  <span className="text-gray-900 font-medium">{freight.transporterName}</span>
                  <span className="text-xs text-gray-500 ml-2">Transportista</span>
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
              
              {isDelivered && !hasReviewedTransporter && (isCustomer || (freight.packages || []).some(pkg => pkg.ownerId === user?.id)) && (
                <Button variant="outline" fullWidth icon={<Star size={18} />} onClick={() => { setShowReviewModal(true); setReviewTarget(freight.transporterId || null); setReviewRole('transporter'); }}>
                  Calificar al transportista
                </Button>
              )}
              
              {isDelivered && isTransporter && !hasReviewedAllCustomers && uniqueClients.filter(cid => cid !== freight.transporterId).map(cid => (
                <Button key={cid} variant="outline" fullWidth icon={<Star size={18} />} onClick={() => { setShowReviewModal(true); setReviewTarget(cid || null); setReviewRole('customer'); }}>
                  Calificar a {uniqueClientNames[uniqueClients.indexOf(cid)]}
                </Button>
              ))}
              
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
      
      {/* Sección de reseñas del flete */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reseñas de este flete</h2>
        {freightReviews.length === 0 ? (
          <span className="text-gray-500">Aún no hay reseñas para este flete.</span>
        ) : (
          <div className="space-y-4">
            {freightReviews.map(r => {
              const authorUser = mockUsers.find(u => u.id === r.authorId);
              const targetUser = mockUsers.find(u => u.id === r.targetId);
              const authorName = authorUser ? authorUser.name : r.authorId;
              const targetName = targetUser ? targetUser.name : r.targetId;
              const authorAvatar = authorUser && authorUser.avatar;
              const targetAvatar = targetUser && targetUser.avatar;
              return (
                <div key={r.id} className="bg-gray-50 rounded p-4 flex items-start gap-3">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">{authorName[0]}</div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(r.rating)].map((_, i) => <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />)}
                      <span className="text-xs text-gray-500 ml-2">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-gray-800 mb-1">{r.comment}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      De: <span className="font-medium text-gray-900">{authorName}</span>
                      <span className="mx-1">→</span>
                      {targetAvatar ? (
                        <img src={targetAvatar} alt={targetName} className="w-6 h-6 rounded-full object-cover inline-block" />
                      ) : (
                        <span className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold inline-block">{targetName[0]}</span>
                      )}
                      <span className="font-medium text-gray-900">{targetName}</span>
                      <span className="ml-1">({r.role === 'customer' ? 'Cliente' : 'Transportista'})</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Modal de reseña */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Deja tu reseña</h2>
            <div className="flex items-center mb-4">
              {[1,2,3,4,5].map(star => (
                <span key={star} className={`cursor-pointer text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} onClick={() => setRating(star)}>&#9733;</span>
              ))}
            </div>
            <textarea className="w-full border rounded p-2 mb-4" rows={3} placeholder="Escribe un comentario..." value={comment} onChange={e => setComment(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowReviewModal(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => {
                if (rating > 0 && reviewTarget && reviewRole) {
                  addReview({
                    freightId: freight.id,
                    authorId: user!.id,
                    targetId: reviewTarget,
                    role: reviewRole,
                    rating,
                    comment,
                  });
                  setShowReviewModal(false);
                  setRating(0);
                  setComment('');
                }
              }}>Enviar</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Botón para cancelar participación (solo para participantes, no creador) */}
      {isParticipant && user?.id !== freight.customerId && (
        <>
          <Button
            variant="outline"
            color="error"
            className="mt-4"
            onClick={() => setShowCancelModal(true)}
          >
            Cancelar mi participación
          </Button>
          <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)} title="¿Cancelar tu participación?"
            actions={[
              <Button key="no" variant="outline" onClick={() => setShowCancelModal(false)}>No</Button>,
              <Button key="si" variant="primary" color="error" onClick={() => {
                const updated = {
                  ...freight,
                  participants: (freight.participants || []).filter(p => p.id !== user.id),
                  packages: (freight.packages || []).filter(pkg => pkg.ownerId !== user.id),
                  sharedBy: (freight.sharedBy || []).filter((id: string) => id !== user.id),
                  currentPackages: Math.max(0, (freight.currentPackages || 1) - 1),
                };
                setFreightRequests((prev: any) => prev.map((f: any) => f.id === freight.id ? updated : f));
                toast.success('Has cancelado tu participación en el flete');
                setShowCancelModal(false);
                navigate('/freight');
              }}>Sí, cancelar</Button>
            ]}
          >
            ¿Estás seguro de que quieres cancelar tu participación? Esta acción no se puede deshacer.
          </Modal>
        </>
      )}
      
      {/* Botón para cancelar flete (solo para el creador) */}
      {isCustomer && canCancel && (
        <>
          <Button
            variant="outline"
            color="error"
            className="mt-4"
            onClick={() => setShowCancelFleteModal(true)}
          >
            Cancelar Flete
          </Button>
          <Modal open={showCancelFleteModal} onClose={() => setShowCancelFleteModal(false)} title="¿Cancelar este flete?"
            actions={[
              <Button key="no" variant="outline" onClick={() => setShowCancelFleteModal(false)}>No</Button>,
              <Button key="si" variant="primary" color="error" onClick={() => {
                const updated = {
                  ...freight,
                  status: 'cancelled',
                };
                setFreightRequests((prev: any) => prev.map((f: any) => f.id === freight.id ? updated : f));
                toast.success('Flete cancelado');
                setShowCancelFleteModal(false);
                navigate('/freight');
              }}>Sí, cancelar</Button>
            ]}
          >
            ¿Estás seguro de que quieres cancelar este flete? Esta acción no se puede deshacer.
          </Modal>
        </>
      )}
      
      {/* Modal de pago */}
      <Modal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Pagar mi envío"
        actions={<Button variant="primary" onClick={handlePay} disabled={!paymentMethod || (paymentMethod === 'bank' && !paymentProof)}>Pagar</Button>}>
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Método de pago</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} />
                Efectivo
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="paymentMethod" value="bank" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} />
                Transferencia bancaria
              </label>
            </div>
          </div>
          {paymentMethod === 'bank' && (
            <div>
              <label className="block font-medium mb-1">Comprobante de pago</label>
              <Input type="file" accept="image/*" onChange={e => setPaymentProof(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null)} />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default FreightDetails;