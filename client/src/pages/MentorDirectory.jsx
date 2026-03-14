import { useState, useEffect } from 'react';
import api from '../services/api';

const MentorDirectory = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const { data } = await api.get('/mentors');
        setMentors(data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  if (loading) return <div className="text-center py-10">Loading mentors...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mentor Directory</h1>
      {mentors.length === 0 ? (
        <p className="text-gray-600">No mentors available yet. Check back soon!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((mentor) => (
            <div key={mentor._id} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold">{mentor.user?.name}</h3>
              <p className="text-gray-600 text-sm">{mentor.designation} at {mentor.company}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {mentor.expertise?.map((skill) => (
                  <span key={skill} className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded">{skill}</span>
                ))}
              </div>
              <button className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition text-sm">
                Book Session
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorDirectory;
