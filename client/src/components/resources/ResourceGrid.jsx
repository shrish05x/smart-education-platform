import ResourceCard from './ResourceCard';

const ResourceGrid = ({ resources, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-48 animate-pulse">
            <div className="flex justify-between items-center mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded shrink-0"></div>
              <div className="w-20 h-5 bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-3/4 h-6 bg-gray-200 rounded mb-2"></div>
            <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-4xl mb-4">📚</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No resources found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn't find any study materials matching your current filters. Try adjusting your search term or select a different subject.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard 
          key={resource._id} 
          resource={resource} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ResourceGrid;
