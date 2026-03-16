import React from 'react';
import { Link } from 'react-router-dom';
import SaveButton from './SaveButton';
import DeadlineBadge from './DeadlineBadge';

const InternshipCard = ({ internship }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{internship.role}</h3>
          <p className="text-gray-600 mb-2">{internship.companyId?.name}</p>
        </div>
        <DeadlineBadge deadline={internship.deadline} />
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">{internship.location} • {internship.type}</p>
        <p className="text-sm text-gray-500 mb-1">Duration: {internship.duration}</p>
        <p className="text-lg font-semibold text-green-600">${internship.stipend}</p>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {internship.skillsRequired.slice(0, 3).map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {skill}
            </span>
          ))}
          {internship.skillsRequired.length > 3 && (
            <span className="text-xs text-gray-500">+{internship.skillsRequired.length - 3} more</span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link to={`/internships/${internship._id}`} className="text-blue-500 hover:underline">
          View Details
        </Link>
        <SaveButton internshipId={internship._id} />
      </div>
    </div>
  );
};

export default InternshipCard;