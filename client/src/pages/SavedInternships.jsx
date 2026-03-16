import React, { useState, useEffect } from 'react';
import api from '../services/api';
import InternshipCard from '../components/InternshipCard';

const SavedInternships = () => {
  const [savedInternships, setSavedInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedInternships();
  }, []);

  const fetchSavedInternships = async () => {
    try {
      const response = await api.get('/internships/saved');
      setSavedInternships(response.data);
    } catch (error) {
      console.error('Error fetching saved internships:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Saved Internships</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedInternships.map((saved) => (
          <InternshipCard key={saved._id} internship={saved.internshipId} />
        ))}
      </div>
      
      {savedInternships.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No saved internships.</p>
      )}
    </div>
  );
};

export default SavedInternships;