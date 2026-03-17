import React from 'react';

const AvailabilityToggle = ({ isAvailableOnly, onToggle }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={isAvailableOnly} 
          onChange={(e) => onToggle(e.target.checked)} 
        />
        <div className={`block w-12 h-6 rounded-full transition-colors duration-300 ${isAvailableOnly ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 transform ${isAvailableOnly ? 'translate-x-6' : 'translate-x-0'}`}></div>
      </div>
      <span className="text-sm font-medium text-gray-700 select-none group-hover:text-indigo-600 transition-colors">
        Available Only
      </span>
    </label>
  );
};

export default AvailabilityToggle;
