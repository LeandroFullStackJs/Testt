import React from 'react';
import Card from '../components/ui/Card';

const Terms: React.FC = () => (
  <div className="max-w-2xl mx-auto py-8">
    <Card className="p-8">
      <h1 className="text-2xl font-bold mb-4">Términos de Servicio</h1>
      <p className="mb-2">Bienvenido a FleteShare. Al utilizar nuestra plataforma, aceptas los siguientes términos y condiciones...</p>
      <ul className="list-disc pl-6 space-y-2 text-gray-700">
        <li>Debes proporcionar información verídica y actualizada.</li>
        <li>No puedes usar la plataforma para actividades ilegales.</li>
        <li>FleteShare no se responsabiliza por daños o pérdidas durante el transporte.</li>
        <li>Nos reservamos el derecho de suspender cuentas por mal uso.</li>
        <li>Consulta la versión completa de los términos en nuestro sitio web.</li>
      </ul>
    </Card>
  </div>
);

export default Terms; 