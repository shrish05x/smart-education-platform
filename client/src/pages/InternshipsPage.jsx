import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InternshipCard from '../components/InternshipCard';
import InternshipFilters from '../components/InternshipFilters';

const InternshipsPage = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchInternships();
  }, [filters]);

  const fetchInternships = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await axios.get(`/api/internships?${query}`);
      setInternships(response.data.internships);
    } catch (error) {
      console.error('Error fetching internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Internships</h1>
      
      <InternshipFilters onFilterChange={handleFilterChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {internships.map((internship) => (
          <InternshipCard key={internship._id} internship={internship} />
        ))}
      </div>
      
      {internships.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No internships found.</p>
      )}
    </div>
  );
};

export default InternshipsPage;