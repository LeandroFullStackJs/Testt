import { User } from '../types';

const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Juan Pérez',
    email: 'cliente@example.com',
    phone: '+541112345678',
    role: 'customer',
    rating: 4.8,
    ratingsCount: 15,
    createdAt: '2023-01-15T10:30:00Z'
  },
  {
    id: 'user-2',
    name: 'María González',
    email: 'transportista@example.com',
    phone: '+541187654321',
    role: 'transporter',
    rating: 4.6,
    ratingsCount: 24,
    createdAt: '2023-02-10T14:45:00Z'
  },
  {
    id: 'user-3',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+541155554444',
    role: 'admin',
    rating: 0,
    ratingsCount: 0,
    createdAt: '2023-01-01T09:00:00Z'
  }
];

export default mockUsers;