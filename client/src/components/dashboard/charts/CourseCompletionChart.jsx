import { motion } from 'framer-motion';

const defaultCourses = [
  { name: 'Data Structures', progress: 85, color: '#6366f1' },
  { name: 'Calculus II', progress: 62, color: '#8b5cf6' },
  { name: 'Machine Learning', progress: 30, color: '#a855f7' },
  { name: 'Technical Writing', progress: 95, color: '#10b981' },
  { name: 'Database Systems', progress: 48, color: '#f59e0b' },
];

const CourseCompletionChart = ({ courses = [] }) => {
  const data = courses.length > 0 ? courses : defaultCourses;
  const avgProgress = Math.round(data.reduce((sum, c) => sum + c.progress, 0) / data.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Course Completion</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{avgProgress}% <span className="text-sm font-normal text-gray-400">average</span></p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 font-medium">{data.length} courses</span>
      </div>

      <div className="space-y-4">
        {data.map((course, i) => (
          <div key={course.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700">{course.name}</span>
              <span className="text-sm font-semibold" style={{ color: course.color }}>{course.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: course.color }}
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CourseCompletionChart;
