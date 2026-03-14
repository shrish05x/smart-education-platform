import { useState, useEffect } from 'react';
import api from '../services/api';

const InternshipBoard = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        const { data } = await api.get('/internships');
        setInternships(data);
      } catch (error) {
        console.error('Error fetching internships:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInternships();
  }, []);

  if (loading) return <div className="text-center py-10">Loading internships...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Internship Board</h1>
      {internships.length === 0 ? (
        <p className="text-gray-600">No internships posted yet. Check back soon!</p>
      ) : (
        <div className="space-y-4">
          {internships.map((internship) => (
            <div key={internship._id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{internship.title}</h3>
                  <p className="text-primary-600 font-medium">{internship.company}</p>
                  <p className="text-gray-600 text-sm mt-1">{internship.location} • {internship.type} • {internship.duration}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">{internship.stipend}</span>
              </div>
              <p className="text-gray-700 mt-3 line-clamp-2">{internship.description}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {internship.skills?.map((skill) => (
                  <span key={skill} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{skill}</span>
                ))}
              </div>
              <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition text-sm">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipBoard;
