import React from 'react';
import { 
  Users, Package, TruckIcon, DollarSign, BarChart3, 
  TrendingUp, AlertOctagon, Clock
} from 'lucide-react';
import Card from '../../components/ui/Card';
import FreightCard from '../../components/freight/FreightCard';
import { useFreight } from '../../hooks/useFreight';

const AdminDashboard: React.FC = () => {
  const { freightRequests } = useFreight();
  
  // Get the 3 most recent freight requests
  const recentFreightRequests = [...freightRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">
        Panel de Administración
      </h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Usuarios</h3>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="text-primary-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">124</p>
          <div className="flex items-center text-success-600 mt-2">
            <TrendingUp size={16} />
            <span className="ml-1 text-sm">+12% este mes</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fletes Activos</h3>
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
              <TruckIcon className="text-secondary-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">37</p>
          <div className="flex items-center text-success-600 mt-2">
            <TrendingUp size={16} />
            <span className="ml-1 text-sm">+5% esta semana</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ingresos</h3>
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
              <DollarSign className="text-accent-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">$15,430</p>
          <div className="flex items-center text-success-600 mt-2">
            <TrendingUp size={16} />
            <span className="ml-1 text-sm">+8% este mes</span>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Casos Soporte</h3>
            <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
              <AlertOctagon className="text-warning-600" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <div className="flex items-center text-error-600 mt-2">
            <Clock size={16} />
            <span className="ml-1 text-sm">2 pendientes</span>
          </div>
        </Card>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Usuarios Registrados</h3>
            <div className="text-sm text-gray-500">Últimos 12 meses</div>
          </div>
          
          {/* Placeholder for Chart */}
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <BarChart3 size={48} className="text-gray-400" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Ingresos Mensuales</h3>
            <div className="text-sm text-gray-500">Últimos 12 meses</div>
          </div>
          
          {/* Placeholder for Chart */}
          <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
            <BarChart3 size={48} className="text-gray-400" />
          </div>
        </Card>
      </div>
      
      {/* Recent Freight Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Solicitudes Recientes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentFreightRequests.map(freight => (
            <FreightCard key={freight.id} freight={freight} />
          ))}
        </div>
      </div>
      
      {/* Recent Activity Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Actividad Reciente</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Registro
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Laura Fernández
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Nuevo usuario registrado como Cliente
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Hace 2 horas
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="bg-secondary-100 text-secondary-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Flete
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Roberto Gómez
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Flete #FR34512 marcado como Entregado
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Hace 3 horas
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="bg-accent-100 text-accent-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Pago
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  María López
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Pago recibido por $1,200.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Hace 5 horas
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="bg-error-100 text-error-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Soporte
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Carlos Ruiz
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  Caso #SP1234 abierto: "Problema con el pago"
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Hace 8 horas
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;