import React from 'react';
import Card from '../components/ui/Card';

const FAQ: React.FC = () => (
  <div className="max-w-2xl mx-auto py-8">
    <Card className="p-8">
      <h1 className="text-2xl font-bold mb-4">Preguntas Frecuentes</h1>
      <div className="mb-4">
        <h2 className="font-semibold">¿Cómo creo una solicitud de flete?</h2>
        <p>Desde el dashboard, haz clic en "Solicitar nuevo flete" y completa los datos requeridos.</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">¿Cómo me uno a un flete compartido?</h2>
        <p>En la sección de fletes compartidos disponibles, selecciona el flete y haz clic en "Unirse al flete".</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">¿Cómo califico a un transportista o cliente?</h2>
        <p>Después de que tu envío sea entregado, podrás dejar una reseña desde el detalle del flete.</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">¿Cómo recibo notificaciones?</h2>
        <p>Recibirás notificaciones en la campana y en tu panel de usuario cuando haya novedades sobre tus envíos.</p>
      </div>
      <div className="mb-4">
        <h2 className="font-semibold">¿Qué hago si tengo un problema con un envío?</h2>
        <p>Puedes contactar al soporte desde la sección de Soporte y Atención al Cliente.</p>
      </div>
    </Card>
  </div>
);

export default FAQ; 