import React, { useState, useEffect } from 'react';
import api from '../services/api';
import InternshipCard from '../components/InternshipCard';

const RecommendedInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendedInternships();
  }, []);

  const fetchRecommendedInternships = async () => {
    try {
      const response = await api.get('/internships/recommended');
      setInternships(response.data);
    } catch (error) {
      console.error('Error fetching recommended internships:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recommended Internships</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {internships.map((internship) => (
          <InternshipCard key={internship._id} internship={internship} />
        ))}
      </div>
      
      {internships.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No recommendations available.</p>
      )}
    </div>
  );
};

export default RecommendedInternships;