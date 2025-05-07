import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFreight } from '../../hooks/useFreight';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { PackageItem } from '../../types';

const JoinFreight: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { freightRequests, setFreightRequests } = useFreight() as any;
  const freight = freightRequests.find((f: any) => f.id === id);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    }]);
  };

  const removePackage = (packageId: string) => {
    setPackages(packages.filter(pkg => pkg.id !== packageId));
  };

  const updatePackage = (index: number, field: keyof PackageItem, value: string | number) => {
    setPackages(prev =>
      prev.map((pkg, i) =>
        i === index ? { ...pkg, [field]: value } : pkg
      )
    );
  };

  const isValid = packages.length > 0 && packages.every(pkg =>
    pkg.width > 0 && pkg.height > 0 && pkg.length > 0 && pkg.weight > 0 && pkg.description.trim() !== ''
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const updated = {
        ...freight,
        packages: [...(freight.packages || []), ...packages],
        currentPackages: (freight.currentPackages || 0) + packages.length,
      };
      const updatedList = freightRequests.map((f: any) => f.id === freight.id ? updated : f);
      setFreightRequests(updatedList);
      navigate(`/freight/${freight.id}`);
    } catch (e) {
      alert('Error al agregar paquetes');
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
      </Card>
    </div>
  );
};

export default JoinFreight; 