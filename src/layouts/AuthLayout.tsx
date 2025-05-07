import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <Link to="/" className="flex items-center text-primary-600 font-semibold gap-2">
          <Truck size={24} />
          <span className="text-xl">FleteShare</span>
        </Link>
      </div>
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;