import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../hooks/useAuth';
import MobileNavbar from '../components/layout/MobileNavbar';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-6">
        <Outlet />
      </main>
      <Footer />
      {isAuthenticated && <MobileNavbar />}
    </div>
  );
};

export default MainLayout;