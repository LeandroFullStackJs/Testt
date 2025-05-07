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
import { FreightStatus, Review } from '../../types';
import { motion } from 'framer-motion';
import { Tooltip } from '../../components/ui/Tooltip';
import mockUsers from '../../data/mockUsers';

const FreightDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFreightRequest, updateFreightStatus, acceptFreightRequest, isLoading, reviews, addReview } = useFreight();
  const { user } = useAuth();
  const [activeStatus, setActiveStatus] = useState<FreightStatus | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<string | null>(null);
  const [reviewRole, setReviewRole] = useState<'customer' | 'transporter' | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
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
    </div>
  );
};

export default FreightDetails;