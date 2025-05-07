import React, { createContext, useState, useEffect } from 'react';
import { FreightRequest, FreightStatus, Review } from '../types';
import { useAuth } from '../hooks/useAuth';
import mockFreightRequests from '../data/mockFreightRequests';

interface FreightContextType {
  freightRequests: FreightRequest[];
  setFreightRequests: React.Dispatch<React.SetStateAction<FreightRequest[]>>;
  isLoading: boolean;
  error: Error | null;
  getFreightRequest: (id: string) => FreightRequest | undefined;
  createFreightRequest: (freightRequest: Omit<FreightRequest, 'id' | 'status' | 'customerName' | 'customerAvatar' | 'createdAt'>) => Promise<FreightRequest>;
  updateFreightStatus: (id: string, status: FreightStatus) => Promise<FreightRequest>;
  acceptFreightRequest: (id: string) => Promise<FreightRequest>;
  joinFreightRequest: (freightId: string) => Promise<void>;
  joiningFreightId: string | null;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

export const FreightContext = createContext<FreightContextType | null>(null);

export const FreightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [freightRequests, setFreightRequests] = useState<FreightRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [joiningFreightId, setJoiningFreightId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Load freight requests
    const loadFreightRequests = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setFreightRequests(mockFreightRequests);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error fetching freight requests'));
      } finally {
        setIsLoading(false);
      }
    };

    loadFreightRequests();
  }, []);

  const getFreightRequest = (id: string) => {
    return freightRequests.find(fr => fr.id === id);
  };

  const createFreightRequest = async (
    freightRequest: Omit<FreightRequest, 'id' | 'status' | 'customerName' | 'customerAvatar' | 'createdAt'>
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('User must be logged in to create a freight request');
      }
      
      const newFreightRequest: FreightRequest = {
        ...freightRequest,
        id: `freight-${Date.now()}`,
        status: 'pending',
        customerId: user.id,
        customerName: user.name,
        customerAvatar: user.avatar,
        createdAt: new Date().toISOString(),
      };
      
      setFreightRequests(prev => [newFreightRequest, ...prev]);
      return newFreightRequest;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create freight request');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFreightStatus = async (id: string, status: FreightStatus) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const index = freightRequests.findIndex(fr => fr.id === id);
      if (index === -1) {
        throw new Error('Freight request not found');
      }
      
      const updated = {
        ...freightRequests[index],
        status,
      };
      
      const updatedList = [...freightRequests];
      updatedList[index] = updated;
      
      setFreightRequests(updatedList);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update status');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptFreightRequest = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!user) {
        throw new Error('User must be logged in to accept a freight request');
      }
      
      if (user.role !== 'transporter') {
        throw new Error('Only transporters can accept freight requests');
      }
      
      const index = freightRequests.findIndex(fr => fr.id === id);
      if (index === -1) {
        throw new Error('Freight request not found');
      }
      
      const updated = {
        ...freightRequests[index],
        status: 'confirmed' as FreightStatus,
        transporterId: user.id,
        transporterName: user.name,
        transporterAvatar: user.avatar,
        estimatedArrival: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
      };
      
      const updatedList = [...freightRequests];
      updatedList[index] = updated;
      
      setFreightRequests(updatedList);
      return updated;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to accept freight request');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const joinFreightRequest = async (freightId: string) => {
    if (!user) throw new Error('Debes iniciar sesión para unirte a un flete');
    const index = freightRequests.findIndex(f => f.id === freightId);
    if (index === -1) throw new Error('Flete no encontrado');
    const freight = freightRequests[index];
    if (!freight.isShared || freight.currentPackages >= freight.maxPackages) {
      throw new Error('No se puede unir a este flete');
    }
    setJoiningFreightId(freightId);
  };

  const addReview = (review: Omit<Review, 'id' | 'createdAt'>) => {
    setReviews(prev => [
      {
        ...review,
        id: `review-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
      ...prev
    ]);
  };

  return (
    <FreightContext.Provider
      value={{
        freightRequests,
        setFreightRequests,
        isLoading,
        error,
        getFreightRequest,
        createFreightRequest,
        updateFreightStatus,
        acceptFreightRequest,
        joinFreightRequest,
        joiningFreightId,
        reviews,
        addReview,
      }}
    >
      {children}
    </FreightContext.Provider>
  );
};