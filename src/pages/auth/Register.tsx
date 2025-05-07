import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, KeyRound, Phone } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al registrar. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Crear Cuenta</h2>
        <p className="mt-2 text-gray-600">
          Regístrate para comenzar a usar FleteShare
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-error-50 text-error-800 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          type="text"
          label="Nombre completo"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Juan Pérez"
          required
          fullWidth
          icon={<User size={18} />}
        />
        
        <Input 
          type="email"
          label="Correo electrónico"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          fullWidth
          icon={<Mail size={18} />}
        />
        
        <Input 
          type="tel"
          label="Teléfono"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+541112345678"
          fullWidth
          icon={<Phone size={18} />}
        />
        
        <Input 
          type="password"
          label="Contraseña"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          fullWidth
          icon={<KeyRound size={18} />}
          helperText="Mínimo 8 caracteres"
        />
        
        <Input 
          type="password"
          label="Confirmar contraseña"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          fullWidth
          icon={<KeyRound size={18} />}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de cuenta
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                role === 'customer'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
              onClick={() => setRole('customer')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  checked={role === 'customer'}
                  onChange={() => setRole('customer')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label className="ml-3 font-medium text-gray-900">Cliente</label>
              </div>
              <p className="mt-1 text-sm text-gray-500 ml-7">
                Quiero solicitar servicios de flete
              </p>
            </div>
            
            <div
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                role === 'transporter'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-primary-300'
              }`}
              onClick={() => setRole('transporter')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  checked={role === 'transporter'}
                  onChange={() => setRole('transporter')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label className="ml-3 font-medium text-gray-900">Transportista</label>
              </div>
              <p className="mt-1 text-sm text-gray-500 ml-7">
                Quiero ofrecer servicios de transporte
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Crear Cuenta
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
      
      <div className="mt-10 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Al registrarte, aceptas los{' '}
          <Link to="/terms" className="text-primary-600 hover:text-primary-500">
            Términos de servicio
          </Link>{' '}
          y la{' '}
          <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
            Política de privacidad
          </Link>{' '}
          de FleteShare.
        </p>
      </div>
    </div>
  );
};

export default Register;