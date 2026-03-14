const SessionCard = ({ session }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{session.topic || 'Counseling Session'}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
            {new Date(session.scheduledAt).toLocaleTimeString()}
          </p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColors[session.status] || ''}`}>
          {session.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-2">Duration: {session.duration} minutes</p>
    </div>
  );
};

export default SessionCard;
