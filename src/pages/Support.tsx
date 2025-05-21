import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Support: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-4">Soporte y Atención al Cliente</h1>
        <p className="mb-4">¿Tienes dudas o problemas? Contáctanos y te ayudaremos lo antes posible.</p>
        {sent ? (
          <div className="text-green-600 text-center">¡Mensaje enviado! Nos pondremos en contacto contigo pronto.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tu correo electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 min-h-[100px]"
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" fullWidth>Enviar</Button>
          </form>
        )}
        <div className="mt-6 text-sm text-gray-500">
          También puedes escribirnos a <a href="mailto:soporte@fleteshare.com" className="text-primary-600 underline">soporte@fleteshare.com</a>
        </div>
      </Card>
    </div>
  );
};

export default Support; 