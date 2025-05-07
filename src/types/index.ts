export type UserRole = 'customer' | 'transporter' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  rating: number;
  ratingsCount: number;
  createdAt: string;
}

export type FreightStatus = 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';

export interface FreightRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  transporterId?: string;
  transporterName?: string;
  transporterAvatar?: string;
  status: FreightStatus;
  pickup: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  delivery: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  packageDetails: {
    width: number;
    height: number;
    length: number;
    weight: number;
    description: string;
    photos?: string[];
  };
  price: number;
  distance: number;
  requestedDate: string;
  estimatedArrival?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  freightId: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
    role: UserRole;
  };
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Review {
  id: string;
  freightId: string;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
    role: UserRole;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'freight_request' | 'freight_accepted' | 'freight_cancelled' | 'message' | 'payment' | 'review';
  relatedId?: string;
  createdAt: string;
}