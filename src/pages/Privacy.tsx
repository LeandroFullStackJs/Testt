import React from 'react';
import Card from '../components/ui/Card';

const Privacy: React.FC = () => (
  <div className="max-w-2xl mx-auto py-8">
    <Card className="p-8">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidad</h1>
      <p className="mb-2">En FleteShare nos comprometemos a proteger tu privacidad. Esta política explica cómo recopilamos, usamos y protegemos tu información personal.</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Solo usamos tus datos para mejorar la experiencia en la plataforma.</li>
        <li>No compartimos tu información con terceros sin tu consentimiento.</li>
        <li>Puedes solicitar la eliminación de tus datos en cualquier momento.</li>
        <li>Consulta la versión completa de la política en nuestro sitio web.</li>
      </ul>
    </Card>
  </div>
);

export default Privacy; 