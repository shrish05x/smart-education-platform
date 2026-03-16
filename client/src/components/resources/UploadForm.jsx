import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceApi } from '../../services/resourceApi';

const SUBJECTS = [
  'Math',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'English',
  'Economics',
];

const UploadForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    resourceType: 'pdf',
    fileURL: '',
    noteContent: '',
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      resourceType: type,
      // Reset specific fields when changing type
      fileURL: '',
      noteContent: ''
    }));
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        setFile(null);
        e.target.value = '';
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        setFile(null);
        e.target.value = '';
        return;
      }
      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.title || !formData.subject) {
        throw new Error('Title and Subject are required');
      }

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('subject', formData.subject);
      submitData.append('resourceType', formData.resourceType);

      if (formData.resourceType === 'pdf') {
        if (!file) throw new Error('Please select a PDF file to upload');
        submitData.append('file', file);
      } else if (formData.resourceType === 'link') {
        if (!formData.fileURL) throw new Error('Please provide the external URL');
        submitData.append('fileURL', formData.fileURL);
      } else if (formData.resourceType === 'note') {
        if (!formData.noteContent) throw new Error('Please enter note content');
        submitData.append('noteContent', formData.noteContent);
      }

      await resourceApi.create(submitData);
      
      setSuccess('Resource successfully uploaded!');
      
      // Navigate after short delay to let user see success message
      setTimeout(() => {
        navigate('/resources');
      }, 1500);
      
    } catch (err) {
      console.error('Upload error:', err);
      // Check if it's an axios error with a response message
      setError(err.response?.data?.message || err.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-navy-900 border-b border-gray-200 px-6 py-5 bg-gradient-to-r from-primary-900 to-indigo-900">
        <h2 className="text-xl font-bold text-white md-heading" style={{ fontFamily: '"Lora", serif' }}>Contribute to Library</h2>
        <p className="text-primary-100 text-sm mt-1">Share your knowledge with other students</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm flex items-start border border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg text-sm flex items-start border border-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success} Redirecting to library...</span>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Resource Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              placeholder="e.g. Chapter 4 Integration Notes"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white"
                required
              >
                <option value="" disabled>Select a subject</option>
                {SUBJECTS.map(subj => <option key={subj} value={subj}>{subj}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="2"
              className="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
              placeholder="Briefly describe what this resource covers..."
            ></textarea>
          </div>
        </div>

        {/* Resource Type Selection */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Resource Format *</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'pdf', icon: '📄', label: 'PDF Document' },
              { id: 'note', icon: '📝', label: 'Text Note' },
              { id: 'link', icon: '🔗', label: 'External Link' },
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeChange(type.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                  formData.resourceType === type.id 
                    ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm' 
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl mb-2">{type.icon}</span>
                <span className="text-xs font-semibold">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Inputs based on Resource Type */}
        <div className="pt-4 pb-2 min-h-[120px]">
          {/* PDF Upload */}
          {formData.resourceType === 'pdf' && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h4 className="text-sm font-semibold text-gray-900">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF files only up to 10MB'}
                </p>
                {file && (
                  <span className="mt-3 text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium">Ready to upload</span>
                )}
              </div>
            </div>
          )}

          {/* Markdown/Text Note */}
          {formData.resourceType === 'note' && (
            <div>
              <label htmlFor="noteContent" className="block text-sm font-semibold text-gray-700 mb-1">
                Note Content <span className="text-gray-400 font-normal ml-1">(Markdown supported)</span>
              </label>
              <textarea
                id="noteContent"
                name="noteContent"
                value={formData.noteContent}
                onChange={handleInputChange}
                rows="8"
                className="w-full rounded-lg border-gray-300 border px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none font-mono text-sm leading-relaxed"
                placeholder="# Intro to Calculus&#10;&#10;Today we learned about derivatives...&#10;&#10;## Key formulas&#10;1. Power rule..."
                required={formData.resourceType === 'note'}
              ></textarea>
            </div>
          )}

          {/* External Link */}
          {formData.resourceType === 'link' && (
            <div>
              <label htmlFor="fileURL" className="block text-sm font-semibold text-gray-700 mb-1">External URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="url"
                  id="fileURL"
                  name="fileURL"
                  value={formData.fileURL}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-300 border pl-10 pr-4 py-2.5 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
                  placeholder="https://example.com/article"
                  required={formData.resourceType === 'link'}
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-gray-100 mt-6 pt-6">
          <button
            type="button"
            onClick={() => navigate('/resources')}
            className="px-6 py-2.5 rounded-lg font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors w-full sm:w-auto text-center"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || (formData.resourceType === 'pdf' && !file)}
            className="px-6 py-2.5 rounded-lg font-semibold text-white bg-primary-600 hover:bg-primary-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto flex items-center justify-center min-w-[140px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload Resource'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
