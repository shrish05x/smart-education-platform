import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusStyles = (s) => {
    switch (s.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'accepted':
      case 'confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
      case 'declined':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (s) => {
    switch (s.toLowerCase()) {
      case 'pending': return 'Pending';
      case 'accepted':
      case 'confirmed': return 'Accepted';
      case 'completed': return 'Completed';
      case 'cancelled':
      case 'declined': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
