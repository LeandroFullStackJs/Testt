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
  address?: string;
  location?: Location;
}

export type FreightStatus = 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';

export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered';

export interface PackageItem {
  id: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  description: string;
  photos?: string[];
  ownerId: string;
  ownerName: string;
  deliveryStatus?: DeliveryStatus;
  distance?: number;
  space?: number;
  price?: number;
  paymentStatus?: 'pending' | 'paid' | 'confirmed';
  paymentMethod?: 'cash' | 'bank' | null;
  paymentProof?: string | null;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state?: string;
  country?: string;
}

export interface FreightRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  transporterId?: string;
  transporterName?: string;
  transporterAvatar?: string;
  status: FreightStatus;
  pickup: Location;
  delivery: Location;
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
  packages: PackageItem[];
  isShared: boolean;
  maxPackages: number;
  currentPackages: number;
  sharedBy?: string[];
  participants?: Array<{
    id: string;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  }>;
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
  authorId: string;
  targetId: string;
  role: 'customer' | 'transporter';
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