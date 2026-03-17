import React from 'react';

const ExpertiseTags = ({ tags = [], max = undefined }) => {
  const displayTags = max ? tags.slice(0, max) : tags;
  const remainingCount = tags.length - displayTags.length;

  return (
    <div className="flex flex-wrap gap-2">
      {displayTags.map((tag, idx) => (
        <span 
          key={idx} 
          className="px-3 py-1.5 bg-violet-50 text-violet-700 text-sm rounded-lg font-medium border border-violet-100 shadow-sm"
        >
          {tag}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-lg font-medium border border-gray-200 shadow-sm">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};

export default ExpertiseTags;
