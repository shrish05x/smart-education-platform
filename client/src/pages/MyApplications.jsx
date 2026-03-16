import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/internships/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>
      
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{application.internshipId?.role}</h2>
                <p className="text-gray-600">{application.internshipId?.companyId?.name}</p>
                <p className="text-sm text-gray-500">Applied on: {new Date(application.appliedAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {applications.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No applications yet.</p>
      )}
    </div>
  );
};

export default MyApplications;