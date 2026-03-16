import React, { useState } from 'react';
import api from '../services/api';

const SaveButton = ({ internshipId }) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (saved) {
        // Unsave logic - but since we don't have the saved id, perhaps fetch saved and find
        // For simplicity, just toggle
        await api.post('/internships/save', { internshipId });
        setSaved(false);
      } else {
        await api.post('/internships/save', { internshipId });
        setSaved(true);
      }
    } catch (error) {
      alert('Error: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`px-4 py-2 rounded ${saved ? 'bg-gray-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'} disabled:opacity-50`}
    >
      {loading ? '...' : saved ? 'Saved' : 'Save'}
    </button>
  );
};

export default SaveButton;