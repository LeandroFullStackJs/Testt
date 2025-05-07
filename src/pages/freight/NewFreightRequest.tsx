import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, ArrowRight, Package, Calendar, DollarSign } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useFreight } from '../../hooks/useFreight';
import { FreightRequest } from '../../types';
import { motion } from 'framer-motion';

type FormStep = 'locations' | 'package' | 'schedule' | 'review';

interface FormData {
  pickup: {
    address: string;
    city: string;
  };
  delivery: {
    address: string;
    city: string;
  };
  packageDetails: {
    width: number;
    height: number;
    length: number;
    weight: number;
    description: string;
  };
  requestedDate: string;
}

const NewFreightRequest: React.FC = () => {
  const navigate = useNavigate();
  const { createFreightRequest, isLoading } = useFreight();
  const [currentStep, setCurrentStep] = useState<FormStep>('locations');
  const [formData, setFormData] = useState<FormData>({
    pickup: {
      address: '',
      city: 'Buenos Aires',
    },
    delivery: {
      address: '',
      city: 'Buenos Aires',
    },
    packageDetails: {
      width: 0,
      height: 0,
      length: 0,
      weight: 0,
      description: '',
    },
    requestedDate: new Date().toISOString().split('T')[0],
  });
  
  const updateFormData = (
    field: keyof FormData,
    subfield: string,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subfield]: value,
      },
    }));
  };
  
  const isLocationsStepValid = () => {
    return (
      formData.pickup.address.trim() !== '' &&
      formData.pickup.city.trim() !== '' &&
      formData.delivery.address.trim() !== '' &&
      formData.delivery.city.trim() !== ''
    );
  };
  
  const isPackageStepValid = () => {
    return (
      formData.packageDetails.width > 0 &&
      formData.packageDetails.height > 0 &&
      formData.packageDetails.length > 0 &&
      formData.packageDetails.weight > 0 &&
      formData.packageDetails.description.trim() !== ''
    );
  };
  
  const isScheduleStepValid = () => {
    return formData.requestedDate !== '';
  };
  
  const nextStep = () => {
    if (currentStep === 'locations' && isLocationsStepValid()) {
      setCurrentStep('package');
    } else if (currentStep === 'package' && isPackageStepValid()) {
      setCurrentStep('schedule');
    } else if (currentStep === 'schedule' && isScheduleStepValid()) {
      setCurrentStep('review');
    }
  };
  
  const prevStep = () => {
    if (currentStep === 'package') {
      setCurrentStep('locations');
    } else if (currentStep === 'schedule') {
      setCurrentStep('package');
    } else if (currentStep === 'review') {
      setCurrentStep('schedule');
    }
  };
  
  const handleSubmit = async () => {
    try {
      // Calculate random distance between 1 and 30 km
      const distance = Math.round((Math.random() * 29) + 1);
      
      // Calculate price based on package size and distance
      const volume = 
        formData.packageDetails.width * 
        formData.packageDetails.height * 
        formData.packageDetails.length;
      
      const basePrice = Math.max(500, volume / 1000 * 10);
      const distancePrice = distance * 30;
      const totalPrice = Math.round(basePrice + distancePrice);
      
      const newFreight: Omit<FreightRequest, 'id' | 'status' | 'customerName' | 'customerAvatar' | 'createdAt'> = {
        customerId: '',
        pickup: formData.pickup,
        delivery: formData.delivery,
        packageDetails: formData.packageDetails,
        price: totalPrice,
        distance,
        requestedDate: new Date(formData.requestedDate).toISOString(),
      };
      
      const result = await createFreightRequest(newFreight);
      navigate(`/freight/${result.id}`);
    } catch (error) {
      console.error('Error creating freight request:', error);
    }
  };
  
  // Calculate estimated price
  const calculateEstimatedPrice = () => {
    const { width, height, length, weight } = formData.packageDetails;
    if (width <= 0 || height <= 0 || length <= 0 || weight <= 0) {
      return 0;
    }
    
    const volume = width * height * length;
    const basePrice = Math.max(500, volume / 1000 * 10);
    
    // Assuming average distance of 10km
    const distancePrice = 10 * 30;
    return Math.round(basePrice + distancePrice);
  };
  
  const estimatedPrice = calculateEstimatedPrice();
  
  return (
    <div className="max-w-2xl mx-auto pb-16 md:pb-0">
      <div className="flex items-center mb-6">
        <Link to="/freight" className="text-gray-500 hover:text-primary-600 mr-2">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Solicitar Nuevo Flete
        </h1>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div 
            className={`flex flex-col items-center ${
              currentStep === 'locations' 
                ? 'text-primary-600' 
                : 'text-gray-500'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              currentStep === 'locations'
                ? 'bg-primary-100 text-primary-600'
                : currentStep === 'package' || currentStep === 'schedule' || currentStep === 'review'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              <MapPin size={16} />
            </div>
            <span className="text-xs">Ubicaciones</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-2 ${
            currentStep === 'locations'
              ? 'bg-gray-200'
              : 'bg-primary-500'
          }`}></div>
          
          <div 
            className={`flex flex-col items-center ${
              currentStep === 'package' 
                ? 'text-primary-600' 
                : 'text-gray-500'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              currentStep === 'package'
                ? 'bg-primary-100 text-primary-600'
                : currentStep === 'schedule' || currentStep === 'review'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              <Package size={16} />
            </div>
            <span className="text-xs">Paquete</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-2 ${
            currentStep === 'locations' || currentStep === 'package'
              ? 'bg-gray-200'
              : 'bg-primary-500'
          }`}></div>
          
          <div 
            className={`flex flex-col items-center ${
              currentStep === 'schedule' 
                ? 'text-primary-600' 
                : 'text-gray-500'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              currentStep === 'schedule'
                ? 'bg-primary-100 text-primary-600'
                : currentStep === 'review'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}>
              <Calendar size={16} />
            </div>
            <span className="text-xs">Programación</span>
          </div>
          
          <div className={`flex-1 h-0.5 mx-2 ${
            currentStep === 'review'
              ? 'bg-primary-500'
              : 'bg-gray-200'
          }`}></div>
          
          <div 
            className={`flex flex-col items-center ${
              currentStep === 'review' 
                ? 'text-primary-600' 
                : 'text-gray-500'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              currentStep === 'review'
                ? 'bg-primary-100 text-primary-600'
                : 'bg-gray-200 text-gray-500'
            }`}>
              <DollarSign size={16} />
            </div>
            <span className="text-xs">Revisión</span>
          </div>
        </div>
      </div>
      
      <Card className="p-6">
        {currentStep === 'locations' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Información de Origen y Destino
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Dirección de Origen</h3>
                <div className="space-y-4">
                  <Input
                    label="Dirección"
                    placeholder="Calle, número, piso, depto."
                    value={formData.pickup.address}
                    onChange={(e) => updateFormData('pickup', 'address', e.target.value)}
                    fullWidth
                    icon={<MapPin size={18} />}
                  />
                  
                  <Input
                    label="Ciudad"
                    value={formData.pickup.city}
                    onChange={(e) => updateFormData('pickup', 'city', e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Dirección de Destino</h3>
                <div className="space-y-4">
                  <Input
                    label="Dirección"
                    placeholder="Calle, número, piso, depto."
                    value={formData.delivery.address}
                    onChange={(e) => updateFormData('delivery', 'address', e.target.value)}
                    fullWidth
                    icon={<MapPin size={18} />}
                  />
                  
                  <Input
                    label="Ciudad"
                    value={formData.delivery.city}
                    onChange={(e) => updateFormData('delivery', 'city', e.target.value)}
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentStep === 'package' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Detalles del Paquete
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Ancho (cm)"
                  type="number"
                  value={formData.packageDetails.width || ''}
                  onChange={(e) => updateFormData('packageDetails', 'width', Number(e.target.value))}
                  fullWidth
                />
                
                <Input
                  label="Alto (cm)"
                  type="number"
                  value={formData.packageDetails.height || ''}
                  onChange={(e) => updateFormData('packageDetails', 'height', Number(e.target.value))}
                  fullWidth
                />
                
                <Input
                  label="Largo (cm)"
                  type="number"
                  value={formData.packageDetails.length || ''}
                  onChange={(e) => updateFormData('packageDetails', 'length', Number(e.target.value))}
                  fullWidth
                />
                
                <Input
                  label="Peso (kg)"
                  type="number"
                  value={formData.packageDetails.weight || ''}
                  onChange={(e) => updateFormData('packageDetails', 'weight', Number(e.target.value))}
                  fullWidth
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
                  rows={3}
                  placeholder="Descripción detallada del contenido"
                  value={formData.packageDetails.description}
                  onChange={(e) => updateFormData('packageDetails', 'description', e.target.value)}
                ></textarea>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentStep === 'schedule' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Fecha y Hora de Recogida
            </h2>
            
            <div className="space-y-6">
              <Input
                label="Fecha deseada"
                type="date"
                value={formData.requestedDate}
                onChange={(e) => updateFormData('', 'requestedDate', e.target.value)}
                fullWidth
                icon={<Calendar size={18} />}
              />
              
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  Entendemos que los horarios pueden ser flexibles. Nuestros transportistas
                  te contactarán para coordinar el horario exacto de recogida una vez que 
                  acepten tu solicitud.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {currentStep === 'review' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Revisión y Confirmación
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Origen</h3>
                <p className="text-gray-700">{formData.pickup.address}</p>
                <p className="text-gray-700">{formData.pickup.city}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Destino</h3>
                <p className="text-gray-700">{formData.delivery.address}</p>
                <p className="text-gray-700">{formData.delivery.city}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Detalles del Paquete</h3>
                <p className="text-gray-700">
                  {formData.packageDetails.width} x {formData.packageDetails.height} x {formData.packageDetails.length} cm, 
                  {formData.packageDetails.weight} kg
                </p>
                <p className="text-gray-700 mt-1">{formData.packageDetails.description}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-900 mb-2">Fecha Solicitada</h3>
                <p className="text-gray-700">
                  {new Date(formData.requestedDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              
              <div className="bg-primary-50 p-4 rounded-md">
                <h3 className="font-medium text-primary-900 mb-2">Resumen de Precio</h3>
                <div className="flex justify-between text-gray-700">
                  <span>Tarifa estimada base:</span>
                  <span>${Math.round(estimatedPrice * 0.85)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Comisión de servicio (15%):</span>
                  <span>${Math.round(estimatedPrice * 0.15)}</span>
                </div>
                <div className="flex justify-between text-primary-900 font-bold pt-2 mt-2 border-t border-primary-100">
                  <span>Precio Total Estimado:</span>
                  <span>${estimatedPrice}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * El precio final puede variar según la distancia exacta y otros factores.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="flex justify-between mt-8">
          {currentStep !== 'locations' ? (
            <Button
              variant="outline"
              onClick={prevStep}
              icon={<ArrowLeft size={18} />}
            >
              Anterior
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentStep !== 'review' ? (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={
                (currentStep === 'locations' && !isLocationsStepValid()) ||
                (currentStep === 'package' && !isPackageStepValid()) ||
                (currentStep === 'schedule' && !isScheduleStepValid())
              }
              icon={<ArrowRight size={18} />}
              iconPosition="right"
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              isLoading={isLoading}
            >
              Confirmar Solicitud
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NewFreightRequest;