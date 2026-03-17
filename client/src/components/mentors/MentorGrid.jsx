import React from 'react';
import MentorCard from './MentorCard';

const MentorGrid = ({ mentors, isLoading }) => {
  // Skeleton loader for loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center animate-pulse h-96">
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded-full w-1/3 mb-4"></div>
            <div className="flex gap-4 mb-4 w-full justify-center">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="flex gap-2 w-full justify-center mb-6">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded w-14"></div>
            </div>
            <div className="mt-auto w-full flex gap-3">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!mentors || mentors.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-clash font-semibold text-gray-900 mb-2">No Mentors Found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We couldn't find any mentors matching your exact filters. Try adjusting your search or selecting a different industry.
        </p>
      </div>
    );
  }

  // Grid of results
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mentors.map((mentor) => (
        <MentorCard key={mentor._id} mentor={mentor} />
      ))}
    </div>
  );
};

export default MentorGrid;
