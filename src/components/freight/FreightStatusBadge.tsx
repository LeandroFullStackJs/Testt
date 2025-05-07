import React from 'react';
import { FreightStatus } from '../../types';
import Badge from '../ui/Badge';

interface FreightStatusBadgeProps {
  status: FreightStatus;
  className?: string;
}

const FreightStatusBadge: React.FC<FreightStatusBadgeProps> = ({ status, className = '' }) => {
  
  const statusConfig = {
    pending: { variant: 'warning', label: 'Pendiente' },
    confirmed: { variant: 'info', label: 'Confirmado' },
    in_transit: { variant: 'primary', label: 'En Tránsito' },
    delivered: { variant: 'success', label: 'Entregado' },
    cancelled: { variant: 'error', label: 'Cancelado' },
  } as const;
  
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant} 
      className={className}
    >
      {config.label}
    </Badge>
  );
};

export default FreightStatusBadge;