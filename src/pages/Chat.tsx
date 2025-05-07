import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SendHorizontal, ArrowLeft, Paperclip, Image } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../hooks/useAuth';
import { useFreight } from '../hooks/useFreight';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Message } from '../types';

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getFreightRequest } = useFreight();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const freight = getFreightRequest(id!);
  
  useEffect(() => {
    // Mock data - in a real app, this would be fetched from your API
    const mockMessages: Message[] = [
      {
        id: '1',
        freightId: id!,
        sender: {
          id: freight?.customerId || '',
          name: freight?.customerName || '',
          avatar: freight?.customerAvatar,
          role: 'customer',
        },
        content: 'Hola, ¿en cuánto tiempo podrías llegar a recoger mi paquete?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        read: true,
      },
      {
        id: '2',
        freightId: id!,
        sender: {
          id: freight?.transporterId || '',
          name: freight?.transporterName || '',
          avatar: freight?.transporterAvatar,
          role: 'transporter',
        },
        content: 'Hola! Estimo que puedo estar allí en aproximadamente 30 minutos. ¿Hay alguna indicación especial para llegar?',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), // 1.5 hours ago
        read: true,
      },
      {
        id: '3',
        freightId: id!,
        sender: {
          id: freight?.customerId || '',
          name: freight?.customerName || '',
          avatar: freight?.customerAvatar,
          role: 'customer',
        },
        content: 'Perfecto. El edificio tiene entrada por la calle lateral también, quizás sea más fácil estacionar allí.',
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
        read: true,
      },
    ];
    
    setMessages(mockMessages);
  }, [id, freight]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      freightId: id!,
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };
  
  if (!freight) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Conversación no encontrada.</p>
        <Link to="/freight" className="text-primary-600 hover:text-primary-700 mt-2 inline-block">
          Volver a Fletes
        </Link>
      </div>
    );
  }
  
  const otherPerson = user?.role === 'customer' 
    ? { name: freight.transporterName, avatar: freight.transporterAvatar }
    : { name: freight.customerName, avatar: freight.customerAvatar };
  
  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow-md">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center">
        <Link to={`/freight/${id}`} className="text-gray-500 hover:text-primary-600 mr-3">
          <ArrowLeft size={20} />
        </Link>
        
        <div className="flex-1">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
              {otherPerson.avatar ? (
                <img 
                  src={otherPerson.avatar} 
                  alt={otherPerson.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
                  {otherPerson.name?.[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{otherPerson.name}</h2>
              <p className="text-sm text-gray-500">
                Flete #{id?.substring(0, 8)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isMyMessage = msg.sender.id === user?.id;
          
          return (
            <div 
              key={msg.id}
              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${isMyMessage ? 'order-2' : 'order-1'}`}>
                {!isMyMessage && (
                  <div className="flex items-center mb-1 text-sm text-gray-500">
                    <div className="w-6 h-6 bg-gray-200 rounded-full overflow-hidden mr-2">
                      {msg.sender.avatar ? (
                        <img 
                          src={msg.sender.avatar} 
                          alt={msg.sender.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs">
                          {msg.sender.name[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <span>{msg.sender.name}</span>
                  </div>
                )}
                
                <div 
                  className={`p-3 rounded-lg ${
                    isMyMessage 
                      ? 'bg-primary-600 text-white rounded-tr-none'
                      : 'bg-white border border-gray-200 rounded-tl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
                
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(msg.timestamp), 'HH:mm', { locale: es })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button 
            type="button"
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <Paperclip size={20} />
          </button>
          
          <button 
            type="button"
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <Image size={20} />
          </button>
          
          <div className="flex-1">
            <Input
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
            />
          </div>
          
          <Button
            type="submit"
            variant="primary"
            icon={<SendHorizontal size={18} />}
            disabled={!message.trim()}
          >
            Enviar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;