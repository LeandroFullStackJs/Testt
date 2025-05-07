import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Truck, Menu, X, LayoutDashboard, Users, MessageSquare, LifeBuoy, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Users size={20} />, label: 'Usuarios', path: '/admin/users' },
    { icon: <MessageSquare size={20} />, label: 'Soporte', path: '/admin/support' },
    { icon: <LifeBuoy size={20} />, label: 'Mesa de Ayuda', path: '/admin/helpdesk' },
  ];
  
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 bg-white shadow z-10">
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <Link to="/admin" className="flex items-center text-primary-600 font-semibold gap-2">
            <Truck size={24} />
            <span className="text-xl">FleteShare Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto px-4 py-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <span className="mr-3 text-gray-500"><LogOut size={20} /></span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-20 transition-opacity ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white shadow z-30 transform transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to="/admin" className="flex items-center text-primary-600 font-semibold gap-2">
            <Truck size={24} />
            <span className="text-xl">FleteShare</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col py-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-4 space-y-1">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto px-4 py-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <span className="mr-3 text-gray-500"><LogOut size={20} /></span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="md:ml-64 flex-1 flex flex-col">
        <header className="bg-white shadow h-16 flex items-center px-4 md:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-500 mr-4"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Panel de Administración</h1>
        </header>
        
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;