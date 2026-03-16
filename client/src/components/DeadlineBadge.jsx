import React from 'react';

const DeadlineBadge = ({ deadline }) => {
  if (!deadline) return null;
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let color, text, icon;

  if (diffDays < 0) {
    color = 'bg-red-50 text-red-600 border-red-100';
    text = 'Expired';
    icon = '⏰';
  } else if (diffDays <= 3) {
    color = 'bg-red-50 text-red-600 border-red-100';
    text = `${diffDays}d left`;
    icon = '🔥';
  } else if (diffDays <= 7) {
    color = 'bg-amber-50 text-amber-600 border-amber-100';
    text = `${diffDays}d left`;
    icon = '⚡';
  } else {
    color = 'bg-gray-50 text-gray-500 border-gray-100';
    text = deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    icon = '📅';
  }

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${color} flex-shrink-0`}>
      <span className="text-[10px]">{icon}</span>
      {text}
    </span>
  );
};

export default DeadlineBadge;