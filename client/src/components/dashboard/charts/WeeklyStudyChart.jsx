import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const defaultData = [
  { day: 'Mon', hours: 3.5 },
  { day: 'Tue', hours: 2.0 },
  { day: 'Wed', hours: 4.5 },
  { day: 'Thu', hours: 1.5 },
  { day: 'Fri', hours: 3.0 },
  { day: 'Sat', hours: 2.5 },
  { day: 'Sun', hours: 1.5 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
      <p className="font-medium">{label}</p>
      <p className="text-indigo-300">{payload[0].value}h studied</p>
    </div>
  );
};

const WeeklyStudyChart = ({ data = [] }) => {
  const chartData = data.length > 0 ? data : defaultData;
  const totalHours = chartData.reduce((sum, d) => sum + d.hours, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Weekly Study Hours</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalHours.toFixed(1)}h <span className="text-sm font-normal text-gray-400">total</span></p>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
          +12%
        </div>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
            <Bar dataKey="hours" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default WeeklyStudyChart;
