import { motion } from 'framer-motion';

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-yellow-100 text-yellow-700',
  Advanced: 'bg-red-100 text-red-700',
};

const typeIcons = {
  course: '📚',
  article: '📄',
  tutorial: '🎓',
  video: '🎬',
};

const RecommendedResourcesWidget = ({ resources = [] }) => {
  const defaultResources = [
    { _id: '1', title: 'Introduction to Algorithms', type: 'course', provider: 'MIT OpenCourseWare', rating: 4.8, difficulty: 'Intermediate' },
    { _id: '2', title: 'ML Specialization', type: 'course', provider: 'Stanford Online', rating: 4.9, difficulty: 'Advanced' },
    { _id: '3', title: 'Technical Writing Guide', type: 'article', provider: 'Google Developers', rating: 4.5, difficulty: 'Beginner' },
    { _id: '4', title: 'Data Viz with Python', type: 'tutorial', provider: 'DataCamp', rating: 4.6, difficulty: 'Intermediate' },
  ];
  const data = resources.length > 0 ? resources : defaultResources;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recommended</h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 font-medium">For You</span>
      </div>

      <div className="space-y-3">
        {data.map((resource, i) => (
          <motion.div
            key={resource._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 + i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          >
            <span className="text-xl flex-shrink-0">{typeIcons[resource.type] || '📚'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 group-hover:text-indigo-600 transition-colors truncate">{resource.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">{resource.provider}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1 text-xs text-amber-500">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                {resource.rating}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${difficultyColors[resource.difficulty]}`}>
                {resource.difficulty}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecommendedResourcesWidget;
