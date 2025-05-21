import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, KeyRound } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
        <p className="mt-2 text-gray-600">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-error-50 text-error-800 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input 
          type="email"
          label="Correo electrónico"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          required
          fullWidth
          icon={<User size={18} />}
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
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Recordarme
            </label>
          </div>
          
          <div className="text-sm">
            <Link to="/forgot-password" className="text-primary-600 hover:text-primary-500">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Iniciar Sesión
          </Button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
            Regístrate
          </Link>
        </p>
      </div>
      
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O inicia sesión con</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            fullWidth
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
          >
            Facebook
          </Button>
        </div>
      </div>
      
      <div className="mt-10 pt-6 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Al continuar, aceptas los{' '}
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

export default Login;