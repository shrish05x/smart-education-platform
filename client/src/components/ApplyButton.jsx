import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ApplyButton = ({ internshipId }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleApply = async () => {
    setLoading(true);
    try {
      await api.post('/internships/apply', { internshipId });
      alert('Application submitted successfully!');
    } catch (error) {
      if (error.response?.status === 400) {
        alert('You have already applied to this internship.');
      } else {
        alert('Error applying: ' + error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
    >
      {loading ? 'Applying...' : 'Apply Now'}
    </button>
  );
};

export default ApplyButton;