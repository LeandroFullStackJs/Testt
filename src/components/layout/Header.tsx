import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Truck, Menu, X, Bell, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center text-primary-600 font-semibold gap-2">
            <Truck size={24} />
            <span className="text-xl">FleteShare</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Inicio
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-primary-600 transition">
              Cómo Funciona
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 transition">
                  Dashboard
                </Link>
                <Link to="/freight" className="text-gray-700 hover:text-primary-600 transition">
                  Fletes
                </Link>
                <div className="relative ml-3">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-primary-100 text-primary-700 rounded-full">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                      >
                        <div className="py-1">
                          <Link 
                            to="/profile" 
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Mi Perfil
                          </Link>
                          {user?.role === 'admin' && (
                            <Link 
                              to="/admin" 
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Panel Administrador
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Cerrar Sesión
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition shadow-sm"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <div className="relative mr-4">
                <Link to="/notifications" className="text-gray-500 hover:text-primary-600">
                  <Bell size={24} />
                </Link>
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 py-2"
            >
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-primary-600 py-2 transition"
                >
                  Inicio
                </Link>
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-primary-600 py-2 transition"
                >
                  Cómo Funciona
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-700 hover:text-primary-600 py-2 transition"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className="text-gray-700 hover:text-primary-600 py-2 transition"
                    >
                      Mi Perfil
                    </Link>
                    {user?.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="text-gray-700 hover:text-primary-600 py-2 transition"
                      >
                        Panel Administrador
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-left text-gray-700 hover:text-primary-600 py-2 transition"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/login" 
                      className="text-primary-600 hover:text-primary-700 py-2 transition"
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      to="/register" 
                      className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-center transition shadow-sm"
                    >
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;