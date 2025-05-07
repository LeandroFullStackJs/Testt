import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, MessageSquare, User } from 'lucide-react';

const MobileNavbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-4 h-16">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center ${
            isActive('/dashboard') ? 'text-primary-600' : 'text-gray-500'
          }`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Inicio</span>
        </Link>
        
        <Link
          to="/freight"
          className={`flex flex-col items-center justify-center ${
            location.pathname.startsWith('/freight') ? 'text-primary-600' : 'text-gray-500'
          }`}
        >
          <Package size={20} />
          <span className="text-xs mt-1">Fletes</span>
        </Link>
        
        <Link
          to="/chat"
          className={`flex flex-col items-center justify-center ${
            location.pathname.startsWith('/chat') ? 'text-primary-600' : 'text-gray-500'
          }`}
        >
          <MessageSquare size={20} />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center ${
            isActive('/profile') ? 'text-primary-600' : 'text-gray-500'
          }`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavbar;