import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplyInternship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resumeURL, setResumeURL] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/internships/apply', { internshipId: id, resumeURL });
      alert('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error) {
      alert('Error applying: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Apply for Internship</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Resume URL (optional)</label>
            <input
              type="url"
              value={resumeURL}
              onChange={(e) => setResumeURL(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://example.com/resume.pdf"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Applying...' : 'Apply'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyInternship;