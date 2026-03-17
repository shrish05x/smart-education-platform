import { Link } from 'react-router-dom';
import ConnectionButton from './ConnectionButton';
import { formatDistanceToNow } from 'date-fns';

const ConnectionCard = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
      {/* Avatar */}
      <Link to={`/community/user/${user._id}`} className="shrink-0 flex justify-center">
        <img
          src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-transparent hover:border-indigo-500 transition-colors"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link to={`/community/user/${user._id}`} className="group inline-flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                {user.name}
              </h3>
              {user.badges && user.badges.length > 0 && (
                <span className="text-sm" title={user.badges[0].name}>{user.badges[user.badges.length - 1].icon}</span>
              )}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
              {user.bio || 'Community Member'}
            </p>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
              {user.connectedAt && (
                <span>Connected {formatDistanceToNow(new Date(user.connectedAt), { addSuffix: true })}</span>
              )}
              {user.mutualCount > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span>{user.mutualCount} mutual connection{user.mutualCount > 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <ConnectionButton
              userId={user._id}
              userName={user.name}
              userProfileImage={user.profileImage}
              buttonSize="sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
