const PDFViewer = ({ url, title }) => {
  // Use the full URL if it's external, or prepend API base if local
  // For simplicity, we assume an absolute external link or relative local link starting with /uploads
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const pdfUrl = url.startsWith('/') ? `${API_URL}${url}` : url;

  return (
    <div className="flex flex-col h-[70vh] w-full border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
      <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center shrink-0">
        <h3 className="font-semibold text-gray-700 text-sm truncate pr-4" title={title}>
          {title}
        </h3>
        <a 
          href={pdfUrl} 
          download 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center shrink-0 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </a>
      </div>
      <div className="flex-1 w-full bg-gray-800">
        <iframe 
          src={`${pdfUrl}#toolbar=0`} 
          className="w-full h-full border-none" 
          title={title}
          allowFullScreen
        >
          <p className="text-white text-center pt-10">
            Your browser doesn't support PDF viewing. 
            <a href={pdfUrl} className="text-blue-400 hover:underline ml-2">Download the PDF instead.</a>
          </p>
        </iframe>
      </div>
    </div>
  );
};

export default PDFViewer;
