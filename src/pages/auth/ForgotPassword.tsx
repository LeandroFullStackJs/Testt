import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Mail } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica real de recuperación
    setSent(true);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Recuperar Contraseña</h1>
        {sent ? (
          <div className="text-center text-green-600">
            Si el correo existe, te hemos enviado instrucciones para restablecer tu contraseña.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
              fullWidth
            />
            <Button variant="primary" type="submit" fullWidth>
              Enviar instrucciones
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword; 