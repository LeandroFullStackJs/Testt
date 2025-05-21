import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center text-white font-semibold gap-2">
              <Truck size={24} />
              <span className="text-xl">FleteShare</span>
            </Link>
            <p className="mt-4 text-gray-400">
              FleteShare es la plataforma líder en distribución compartida inteligente, 
              conectando a clientes y transportistas para servicios de flete eficientes y económicos.
            </p>
            <div className="flex mt-6 space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h5 className="text-white font-semibold mb-4">Servicios</h5>
            <ul className="space-y-2">
              <li><Link to="/freight" className="text-gray-400 hover:text-white transition-colors">Solicitar Flete</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Convertirse en Transportista</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Precios</Link></li>
              <li><Link to="/business" className="text-gray-400 hover:text-white transition-colors">Soluciones Empresariales</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-white font-semibold mb-4">Empresa</h5>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Acerca de Nosotros</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-white transition-colors">Trabaja con Nosotros</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contacto</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FleteShare. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors">
              Términos de Servicio
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-white text-sm transition-colors">
              Política de Privacidad
            </Link>
            <Link to="/faq" className="text-gray-500 hover:text-white text-sm transition-colors">
              Preguntas Frecuentes
            </Link>
            <Link to="/support" className="text-gray-500 hover:text-white text-sm transition-colors">
              Soporte
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;