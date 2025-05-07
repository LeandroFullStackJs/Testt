import React, { useState } from 'react';
import { User, Mail, Phone, Star, Pencil, Lock, LogOut } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would send an API request to update the user's profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <p>Cargando perfil...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 md:pb-0">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Mi Perfil
          </h1>
          
          {!isEditing && (
            <Button 
              variant="outline" 
              icon={<Pencil size={18} />}
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </Button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-100 flex items-center justify-center text-primary-600">
                <User size={64} />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <>
                <Input
                  label="Nombre completo"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  icon={<User size={18} />}
                  fullWidth
                />
                
                <Input
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={<Mail size={18} />}
                  fullWidth
                />
                
                <Input
                  label="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon={<Phone size={18} />}
                  fullWidth
                />
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="primary"
                    onClick={handleSaveProfile}
                  >
                    Guardar Cambios
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Correo electrónico</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium text-gray-900">{user.phone || 'No especificado'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Tipo de cuenta</p>
                  <p className="font-medium text-gray-900">
                    {user.role === 'customer' && 'Cliente'}
                    {user.role === 'transporter' && 'Transportista'}
                    {user.role === 'admin' && 'Administrador'}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <p className="text-sm text-gray-500 mr-2">Calificación</p>
                  <div className="flex items-center">
                    <Star size={16} className="text-warning-500 fill-current" />
                    <span className="font-medium text-gray-900 ml-1">{user.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm ml-1">({user.ratingsCount} reseñas)</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Security Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Seguridad
        </h2>
        
        <div className="space-y-4">
          <Button
            variant="outline"
            icon={<Lock size={18} />}
            fullWidth
            className="justify-start"
          >
            Cambiar contraseña
          </Button>
          
          <Button
            variant="outline"
            icon={<LogOut size={18} />}
            fullWidth
            className="justify-start"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      </Card>
      
      {/* Preferences Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Preferencias
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificaciones por correo electrónico</p>
              <p className="text-sm text-gray-500">Recibe actualizaciones sobre tus solicitudes de flete</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificaciones push</p>
              <p className="text-sm text-gray-500">Recibe notificaciones en tu navegador o dispositivo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Notificaciones de chat</p>
              <p className="text-sm text-gray-500">Recibe alertas cuando recibas nuevos mensajes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;