import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ApplyButton from '../components/ApplyButton';
import SaveButton from '../components/SaveButton';
import DeadlineBadge from '../components/DeadlineBadge';

const InternshipDetails = () => {
  const { id } = useParams();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const response = await axios.get(`/api/internships/${id}`);
      setInternship(response.data);
    } catch (error) {
      console.error('Error fetching internship:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!internship) return <div>Internship not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold">{internship.role}</h1>
            <p className="text-xl text-gray-600">{internship.companyId?.name}</p>
          </div>
          <DeadlineBadge deadline={internship.deadline} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <p><strong>Location:</strong> {internship.location}</p>
            <p><strong>Type:</strong> {internship.type}</p>
            <p><strong>Duration:</strong> {internship.duration}</p>
            <p><strong>Stipend:</strong> ${internship.stipend}</p>
            <p><strong>Views:</strong> {internship.views}</p>
            <p><strong>Applicants:</strong> {internship.applicantsCount}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {internship.skillsRequired.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p>{internship.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <ul className="list-disc list-inside">
            {internship.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        <div className="flex gap-4">
          <ApplyButton internshipId={internship._id} />
          <SaveButton internshipId={internship._id} />
        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;