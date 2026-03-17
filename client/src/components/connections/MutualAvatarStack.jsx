import { Link } from 'react-router-dom';

const MutualAvatarStack = ({ mutuals = [], totalCount = 0 }) => {
  if (totalCount === 0 || mutuals.length === 0) return null;

  const displayCount = Math.min(mutuals.length, 3);
  const remainingCount = totalCount - displayCount;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2 isolate">
        {mutuals.slice(0, displayCount).map((user, idx) => (
          <Link
            key={user._id || idx}
            to={`/community/user/${user._id}`}
            className="relative z-0 hover:z-10 transition-transform hover:scale-110 focus:z-10"
            title={user.name}
          >
            <img
              className="inline-block w-6 h-6 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover"
              src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
              alt={user.name}
            />
          </Link>
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {totalCount > 1 ? `${totalCount} mutual connections` : '1 mutual connection'}
      </span>
    </div>
  );
};

export default MutualAvatarStack;
