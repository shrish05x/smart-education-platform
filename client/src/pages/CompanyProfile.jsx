import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const response = await axios.get(`/api/companies/${id}`);
      setCompany(response.data);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!company) return <div>Company not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          {company.logo && (
            <img src={company.logo} alt={company.name} className="w-16 h-16 mr-6" />
          )}
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-xl text-gray-600">{company.industry}</p>
            <p className="text-gray-500">{company.location}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p>{company.description}</p>
        </div>

        {company.website && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Website</h2>
            <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              {company.website}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;