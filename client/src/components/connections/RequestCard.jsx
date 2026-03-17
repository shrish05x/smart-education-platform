import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useConnectionStatus } from '../../hooks/useConnectionStatus';

const RequestCard = ({ request, type = 'received', onAction }) => {
  // request is the Connection document from DB
  // type is 'received' (pending incomings) or 'sent' (pending outgoings)
  const otherUser = type === 'received' ? request.sender : request.receiver;

  const { acceptRequest, remove, loading } = useConnectionStatus(otherUser._id);

  const handleAccept = async () => {
    const success = await acceptRequest();
    if (success && onAction) onAction(request._id);
  };

  const handleReject = async () => {
    const success = await remove(); // effectively identical API route to decline/withdraw
    if (success && onAction) onAction(request._id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar */}
        <Link to={`/community/user/${otherUser._id}`} className="shrink-0 flex justify-center">
          <img
            src={otherUser.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name)}&background=random`}
            alt={otherUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <Link to={`/community/user/${otherUser._id}`} className="group">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {otherUser.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                {otherUser.bio || 'Student | Learner'}
              </p>
              
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>

          {/* Personal Message */}
          {request.message && (
            <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800 relative">
              <div className="absolute -left-1 top-4 w-2 h-2 bg-gray-50 dark:bg-gray-900/50 border-t border-l border-gray-100 dark:border-gray-800 rotate-45"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{request.message}"</p>
            </div>
          )}

          {/* Mutual or Skills */}
          {!request.message && otherUser.skills && (
             <div className="mt-3 flex flex-wrap gap-2">
               {otherUser.skills.slice(0, 3).map((skill, idx) => (
                 <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                   {skill}
                 </span>
               ))}
             </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2 mt-auto">
            {type === 'received' ? (
              <>
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors"
                >
                  Ignore
                </button>
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  Accept
                </button>
              </>
            ) : (
              <button
                onClick={handleReject}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-xl transition-colors"
              >
                Withdraw
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
