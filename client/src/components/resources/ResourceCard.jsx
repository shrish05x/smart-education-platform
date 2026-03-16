import { Link } from 'react-router-dom';
import { useState } from 'react';
import { resourceApi } from '../../services/resourceApi';

const ResourceCard = ({ resource, onDelete, currentUserId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'pdf':
        return '📄';
      case 'note':
        return '📝';
      case 'link':
        return '🔗';
      default:
        return '📁';
    }
  };

  const getBadgeColor = (subject) => {
    const colors = {
      'Math': 'bg-blue-100 text-blue-800 border-blue-200',
      'Physics': 'bg-purple-100 text-purple-800 border-purple-200',
      'Chemistry': 'bg-green-100 text-green-800 border-green-200',
      'Biology': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Computer Science': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'History': 'bg-amber-100 text-amber-800 border-amber-200',
      'English': 'bg-rose-100 text-rose-800 border-rose-200',
      'Economics': 'bg-sky-100 text-sky-800 border-sky-200',
    };
    return colors[subject] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await resourceApi.delete(resource._id);
      onDelete(resource._id);
    } catch (error) {
      console.error('Failed to delete resource:', error);
      alert(error.response?.data?.message || 'Failed to delete resource');
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Convert uploadedBy (string) vs user auth role if needed to show delete
  // Since we only have 'uploadedBy' as a string name in the schema, we'll just allow deletion loosely or hide it later 
  // In a real app we'd check resource.uploadedByUserId === currentUserId or isAdmin.

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl" title={resource.resourceType === 'pdf' ? 'PDF Document' : resource.resourceType === 'note' ? 'Text Note' : 'External Link'}>
            {getIcon(resource.resourceType)}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getBadgeColor(resource.subject)}`}>
            {resource.subject}
          </span>
        </div>
        
        {showConfirm ? (
          <div className="flex items-center space-x-2 text-xs">
            <button onClick={handleDelete} disabled={isDeleting} className="text-red-600 font-medium hover:underline">Confirm</button>
            <button onClick={() => setShowConfirm(false)} disabled={isDeleting} className="text-gray-500 hover:underline">Cancel</button>
          </div>
        ) : (
          <button 
            onClick={() => setShowConfirm(true)} 
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Delete Resource"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 md-heading" style={{ fontFamily: '"Lora", serif' }}>
        {resource.title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
        {resource.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-gray-900">{resource.uploadedBy}</span>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        <Link 
          to={`/resources/${resource._id}`}
          className="bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default ResourceCard;
