import React from 'react';

const DeadlineBadge = ({ deadline }) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let color = 'bg-gray-100 text-gray-800';
  let text = `Deadline: ${deadlineDate.toLocaleDateString()}`;

  if (diffDays < 0) {
    color = 'bg-red-100 text-red-800';
    text = 'Expired';
  } else if (diffDays <= 7) {
    color = 'bg-yellow-100 text-yellow-800';
    text = `${diffDays} days left`;
  }

  return (
    <span className={`px-2 py-1 rounded text-sm ${color}`}>
      {text}
    </span>
  );
};

export default DeadlineBadge;