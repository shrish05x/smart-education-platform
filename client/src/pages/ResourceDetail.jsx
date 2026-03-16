import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { resourceApi } from '../services/resourceApi';
import PDFViewer from '../components/resources/PDFViewer';

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const { data } = await resourceApi.getById(id);
        setResource(data);
      } catch (err) {
        console.error('Error fetching resource:', err);
        setError('Failed to load resource. It may have been deleted or the link is invalid.');
      } finally {
        setLoading(false);
      }
    };
    fetchResource();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource? This cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      await resourceApi.delete(id);
      navigate('/resources');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete resource');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-64 bg-gray-200 rounded-xl w-full max-w-4xl mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 mb-6">
          <h2 className="text-xl font-bold mb-2">Resource Not Found</h2>
          <p>{error}</p>
        </div>
        <Link to="/resources" className="text-primary-600 font-semibold hover:underline">
          &larr; Back to Library
        </Link>
      </div>
    );
  }

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

  const formattedDate = new Date(resource.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Top Nav/Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Link to="/resources" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Library
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-lg text-red-600 bg-white hover:bg-red-50 hover:border-red-300 transition-colors w-max"
        >
          {isDeleting ? 'Deleting...' : 'Delete Resource'}
        </button>
      </div>

      {/* Header Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getBadgeColor(resource.subject)}`}>
            {resource.subject}
          </span>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full capitalize">
            {resource.resourceType} format
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 md-heading" style={{ fontFamily: '"Lora", serif' }}>
          {resource.title}
        </h1>
        
        {resource.description && (
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {resource.description}
          </p>
        )}

        <div className="flex items-center space-x-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            Uploaded by <span className="font-semibold text-gray-700 ml-1">{resource.uploadedBy}</span>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {formattedDate}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">
            {resource.resourceType === 'pdf' ? '📄' : resource.resourceType === 'note' ? '📝' : '🔗'}
          </span>
          Resource Content
        </h2>
        
        {/* Render PDF */}
        {resource.resourceType === 'pdf' && resource.fileURL && (
          <PDFViewer url={resource.fileURL} title={resource.title} />
        )}

        {/* Render Note (Markdown) */}
        {resource.resourceType === 'note' && resource.noteContent && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10 prose prose-primary max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {resource.noteContent}
            </ReactMarkdown>
          </div>
        )}

        {/* Render Link */}
        {resource.resourceType === 'link' && resource.fileURL && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl">
              🔗
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">External Study Link</h3>
            <p className="text-gray-600 mb-6 max-w-md">
              This resource points to an external website. It will open in a new tab.
            </p>
            <a 
              href={resource.fileURL.startsWith('http') ? resource.fileURL : `https://${resource.fileURL}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Open Link
              <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
            <div className="mt-4 break-all max-w-full px-4 text-sm text-gray-400">
              {resource.fileURL}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetail;
