import { FreightRequest } from '../types';

const mockFreightRequests: FreightRequest[] = [
  {
    id: 'freight-1',
    customerId: 'user-1',
    customerName: 'Juan Pérez',
    status: 'pending',
    pickup: {
      address: 'Av. Corrientes 1234',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.603722,
        lng: -58.381592
      }
    },
    delivery: {
      address: 'Av. Figueroa Alcorta 7597',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.545890,
        lng: -58.451492
      }
    },
    packageDetails: {
      width: 50,
      height: 30,
      length: 40,
      weight: 15,
      description: 'Mueble pequeño para armar'
    },
    price: 1200,
    distance: 8.5,
    requestedDate: '2025-06-01T14:00:00Z',
    createdAt: '2025-05-29T10:15:00Z'
  },
  {
    id: 'freight-2',
    customerId: 'user-1',
    customerName: 'Juan Pérez',
    transporterId: 'user-2',
    transporterName: 'María González',
    status: 'confirmed',
    pickup: {
      address: 'Lavalle 750',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.601822,
        lng: -58.376912
      }
    },
    delivery: {
      address: 'Av. Belgrano 1200',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.616785,
        lng: -58.382881
      }
    },
    packageDetails: {
      width: 20,
      height: 15,
      length: 25,
      weight: 5,
      description: 'Caja con libros y artículos personales'
    },
    price: 800,
    distance: 3.2,
    requestedDate: '2025-06-02T11:00:00Z',
    estimatedArrival: '2025-06-02T11:45:00Z',
    createdAt: '2025-05-30T09:30:00Z'
  },
  {
    id: 'freight-3',
    customerId: 'user-1',
    customerName: 'Juan Pérez',
    transporterId: 'user-2',
    transporterName: 'María González',
    status: 'in_transit',
    pickup: {
      address: 'Scalabrini Ortiz 3200',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.594212,
        lng: -58.419965
      }
    },
    delivery: {
      address: 'Av. del Libertador 4500',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.570912,
        lng: -58.436015
      }
    },
    packageDetails: {
      width: 80,
      height: 60,
      length: 120,
      weight: 35,
      description: 'Sofá de dos cuerpos'
    },
    price: 1800,
    distance: 5.7,
    requestedDate: '2025-05-31T16:30:00Z',
    estimatedArrival: '2025-05-31T17:45:00Z',
    createdAt: '2025-05-28T14:20:00Z'
  },
  {
    id: 'freight-4',
    customerId: 'user-1',
    customerName: 'Juan Pérez',
    transporterId: 'user-2',
    transporterName: 'María González',
    status: 'delivered',
    pickup: {
      address: 'Juramento 2500',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.561290,
        lng: -58.461010
      }
    },
    delivery: {
      address: 'Av. Cabildo 3600',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.554490,
        lng: -58.463210
      }
    },
    packageDetails: {
      width: 40,
      height: 35,
      length: 45,
      weight: 12,
      description: 'Electrodoméstico pequeño (microondas)'
    },
    price: 950,
    distance: 2.1,
    requestedDate: '2025-05-27T10:00:00Z',
    estimatedArrival: '2025-05-27T10:30:00Z',
    createdAt: '2025-05-25T13:10:00Z'
  },
  {
    id: 'freight-5',
    customerId: 'user-1',
    customerName: 'Juan Pérez',
    status: 'cancelled',
    pickup: {
      address: 'Av. Córdoba 4500',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.595890,
        lng: -58.427492
      }
    },
    delivery: {
      address: 'Av. Santa Fe 3200',
      city: 'Buenos Aires',
      coordinates: {
        lat: -34.584990,
        lng: -58.410592
      }
    },
    packageDetails: {
      width: 30,
      height: 25,
      length: 35,
      weight: 8,
      description: 'Equipo de sonido'
    },
    price: 750,
    distance: 2.8,
    requestedDate: '2025-05-28T14:00:00Z',
    createdAt: '2025-05-26T11:45:00Z'
  }
];

export default mockFreightRequests;