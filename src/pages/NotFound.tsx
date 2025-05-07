import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-bold text-primary-600">404</h1>
      <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">Página no encontrada</h2>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Lo sentimos, la página que estás buscando no existe o ha sido movida.
      </p>
      <Link to="/">
        <Button variant="primary" icon={<Home size={18} />}>
          Volver al inicio
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;