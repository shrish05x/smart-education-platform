import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceApi } from '../services/resourceApi';
import ResourceGrid from '../components/resources/ResourceGrid';
import SearchBar from '../components/resources/SearchBar';
import SubjectFilter from '../components/resources/SubjectFilter';

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('All');
  
  // Minimal pagination for now
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sort: 'newest'
      };
      
      if (searchTerm) params.search = searchTerm;
      if (subject && subject !== 'All') params.subject = subject;

      const { data } = await resourceApi.getAll(params);
      setResources(data.resources);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [searchTerm, subject, page]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setPage(1); // Reset to first page on new search
  };

  const handleSubjectChange = (newSubject) => {
    setSubject(newSubject);
    setPage(1); // Reset to first page on new filter
  };

  const handleDeleteResource = (deletedId) => {
    setResources(prev => prev.filter(r => r._id !== deletedId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 md-heading" style={{ fontFamily: '"Lora", serif' }}>
            Study Resources
          </h1>
          <p className="mt-2 text-gray-600 max-w-2xl">
            Access past papers, lecture notes, textbook PDFs, and curated external links. Subject specific materials shared by students and mentors.
          </p>
        </div>
        <Link 
          to="/resources/upload" 
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow transition-all shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Resource
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8 space-y-4">
        <div className="w-full md:w-1/2 lg:w-1/3">
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        </div>
        <div className="pt-2">
          <SubjectFilter currentSubject={subject} onSubjectChange={handleSubjectChange} />
        </div>
      </div>

      {/* Grid */}
      <ResourceGrid 
        resources={resources} 
        loading={loading} 
        onDelete={handleDeleteResource}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-10 flex justify-center space-x-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700 flex items-center">
            Page {page} of {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
