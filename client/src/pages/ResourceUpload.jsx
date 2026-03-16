import { Link } from 'react-router-dom';
import UploadForm from '../components/resources/UploadForm';

const ResourceUpload = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6">
        <Link to="/resources" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors">
          <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Library
        </Link>
      </div>
      
      <UploadForm />
    </div>
  );
};

export default ResourceUpload;
