import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('/api/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Companies</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              {company.logo && (
                <img src={company.logo} alt={company.name} className="w-12 h-12 mr-4" />
              )}
              <div>
                <h2 className="text-xl font-semibold">{company.name}</h2>
                <p className="text-gray-600">{company.industry}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{company.description}</p>
            <p className="text-sm text-gray-500 mb-4">{company.location}</p>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                Visit Website
              </a>
            )}
            <div className="mt-4">
              <Link to={`/companies/${company._id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {companies.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No companies found.</p>
      )}
    </div>
  );
};

export default CompaniesPage;