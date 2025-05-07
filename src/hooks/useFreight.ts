import { useContext } from 'react';
import { FreightContext } from '../contexts/FreightContext';

export const useFreight = () => {
  const context = useContext(FreightContext);
  
  if (!context) {
    throw new Error('useFreight must be used within a FreightProvider');
  }
  
  return context;
};