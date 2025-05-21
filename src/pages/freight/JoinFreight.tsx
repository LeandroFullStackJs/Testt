import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFreight } from '../../hooks/useFreight';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { PackageItem } from '../../types';
import { toast } from 'react-toastify';
import Modal from '../../components/ui/Modal';

const JoinFreight: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { freightRequests, setFreightRequests } = useFreight() as any;
  const freight = freightRequests.find((f: any) => f.id === id);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState({ address: '', city: '' });
  const [destination, setDestination] = useState({ address: '', city: '' });
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!freight) {
    return <div className="p-8 text-center">Flete no encontrado.</div>;
  }

  const addPackage = () => {
    setPackages([...packages, {
      id: `pkg-${Date.now()}`,
      width: 0,
      height: 0,
      length: 0,
      weight: 0,
      description: '',
      ownerId: user?.id || '',
      ownerName: user?.name || '',
      distance: Math.round(Math.random() * 25 + 5),
      space: 0,
      price: 0,
      paymentStatus: 'pending',
      paymentMethod: null,
      paymentProof: null,
    }]);
  };

  const removePackage = (packageId: string) => {
    setPackages(packages.filter(pkg => pkg.id !== packageId));
  };

  const updatePackage = (index: number, field: keyof PackageItem, value: string | number) => {
    setPackages(prev => prev.map((pkg, i) => {
      if (i === index) {
        let updated = { ...pkg, [field]: value };
        if (["width","height","length"].includes(field)) {
          const width = Number(field === 'width' ? value : pkg.width);
          const height = Number(field === 'height' ? value : pkg.height);
          const length = Number(field === 'length' ? value : pkg.length);
          const volume = width * height * length;
          const space = volume / 1000000;
          const price = Math.round(500 + (pkg.distance || 10) * 30 + space * 5);
          updated = { ...updated, space, price };
        }
        return updated;
      }
      return pkg;
    }));
  };

  const isValid = packages.length > 0 && packages.every(pkg =>
    pkg.width > 0 && pkg.height > 0 && pkg.length > 0 && pkg.weight > 0 && pkg.description.trim() !== ''
  );

  const isValidAddress = origin.address.trim() !== '' && origin.city.trim() !== '' && destination.address.trim() !== '' && destination.city.trim() !== '';

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidAddress) setStep(2);
    else toast.error('Completa todas las direcciones');
  };

  const handleSubmit = async () => {
    if (!isValid) {
      setErrorMessage('Debes agregar al menos un paquete válido para unirte al flete.');
      setShowErrorModal(true);
      return;
    }
    if (!user) {
      setErrorMessage('Debes iniciar sesión.');
      setShowErrorModal(true);
      return;
    }
    setIsLoading(true);
    try {
      const updated = {
        ...freight,
        packages: [...(freight.packages || []), ...packages.map(pkg => ({ ...pkg, origin, destination }))],
        currentPackages: (freight.currentPackages || 0) + packages.length,
        participants: [
          ...(freight.participants || []),
          {
            id: user.id,
            name: user.name,
            address: origin.address,
            city: origin.city,
            latitude: user.location?.latitude || 0,
            longitude: user.location?.longitude || 0,
            destinationAddress: destination.address,
            destinationCity: destination.city
          }
        ]
      };
      const updatedList = freightRequests.map((f: any) => f.id === freight.id ? updated : f);
      setFreightRequests(updatedList);
      setShowSuccessModal(true);
    } catch (e) {
      setErrorMessage('Error al agregar paquetes');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-16 px-4 sm:px-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agregar Paquetes al Flete Compartido</h1>
      </div>
      <Card className="p-4 sm:p-6">
        {step === 1 ? (
          <form onSubmit={handleAddressSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tu Origen y Destino</h2>
            <Input label="Dirección de Origen" type="text" value={origin.address} onChange={e => setOrigin({ ...origin, address: e.target.value })} fullWidth />
            <Input label="Ciudad de Origen" type="text" value={origin.city} onChange={e => setOrigin({ ...origin, city: e.target.value })} fullWidth />
            <Input label="Dirección de Destino" type="text" value={destination.address} onChange={e => setDestination({ ...destination, address: e.target.value })} fullWidth />
            <Input label="Ciudad de Destino" type="text" value={destination.city} onChange={e => setDestination({ ...destination, city: e.target.value })} fullWidth />
            <div className="flex justify-end mt-8">
              <Button variant="primary" type="submit" disabled={!isValidAddress}>Siguiente</Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Tus Paquetes</h2>
              <Button variant="outline" onClick={addPackage}>Agregar Paquete</Button>
            </div>
            <div className="space-y-6">
              {packages.map((pkg, index) => (
                <Card key={pkg.id} className="p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-gray-900">Paquete {index + 1}</h3>
                    {packages.length > 1 && (
                      <Button variant="ghost" onClick={() => removePackage(pkg.id)}>Eliminar</Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Ancho (cm)" type="number" value={pkg.width || ''} onChange={e => updatePackage(index, 'width', Number(e.target.value))} fullWidth />
                    <Input label="Alto (cm)" type="number" value={pkg.height || ''} onChange={e => updatePackage(index, 'height', Number(e.target.value))} fullWidth />
                    <Input label="Largo (cm)" type="number" value={pkg.length || ''} onChange={e => updatePackage(index, 'length', Number(e.target.value))} fullWidth />
                    <Input label="Peso (kg)" type="number" value={pkg.weight || ''} onChange={e => updatePackage(index, 'weight', Number(e.target.value))} fullWidth />
                  </div>
                  <div className="mt-4">
                    <Input label="Descripción" type="text" value={pkg.description} onChange={e => updatePackage(index, 'description', e.target.value)} fullWidth />
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-end mt-8">
              <Button variant="primary" onClick={handleSubmit} isLoading={isLoading} disabled={!isValid}>
                Confirmar y Unirse al Flete
              </Button>
            </div>
          </>
        )}
      </Card>
      <Modal open={showSuccessModal} onClose={() => { setShowSuccessModal(false); navigate(`/freight/${freight.id}`); }} title="¡Te uniste al flete!"
        actions={<Button variant="primary" onClick={() => { setShowSuccessModal(false); navigate(`/freight/${freight.id}`); }}>Ir al detalle</Button>}>
        Tu participación y paquete fueron agregados correctamente.
      </Modal>
      <Modal open={showErrorModal} onClose={() => setShowErrorModal(false)} title="Error">
        {errorMessage}
      </Modal>
    </div>
  );
};

export default JoinFreight; 