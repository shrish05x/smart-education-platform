import { Link } from 'react-router-dom';
import ConnectionButton from './ConnectionButton';
import MutualAvatarStack from './MutualAvatarStack';

const SuggestionCard = ({ user }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar */}
        <Link to={`/community/user/${user._id}`} className="shrink-0 flex justify-center">
          <img
            src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <Link to={`/community/user/${user._id}`} className="group">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {user.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                {user.bio || 'Student | Learner'}
              </p>
            </div>
          </div>

          {/* AI Match Reasons */}
          {user.matchReasons && user.matchReasons.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              {user.matchReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                  <span className="shrink-0 leading-tight">✨</span>
                  <span className="leading-tight">{reason}</span>
                </div>
              ))}
            </div>
          )}

          {/* Skills (fallback if no match reasons) */}
          {(!user.matchReasons || user.matchReasons.length === 0) && user.skills && (
            <div className="mt-3 flex flex-wrap gap-2">
              {user.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between mt-auto">
            {/* Mutual Connections (placeholder design, backend implementation via logic depending on data) */}
            <div className="flex items-center gap-2">
               {/* Note: we might need MutualAvatarStack here if we fetch mutual user objects, but keeping it simple for now */}
            </div>

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

export default SuggestionCard;
