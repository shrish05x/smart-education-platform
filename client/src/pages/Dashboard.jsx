import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

  const quickLinks = [
    { title: '🤖 AI Assistant', path: '/ai-assistant', desc: 'Chat with AI tutor' },
    { title: '👨‍🏫 Mentors', path: '/mentors', desc: 'Find a mentor' },
    { title: '💬 Community', path: '/community', desc: 'Join discussions' },
    { title: '🧠 Mental Health', path: '/mental-health', desc: 'Get support' },
    { title: '💼 Internships', path: '/internships', desc: 'Browse opportunities' },
    { title: '👤 Profile', path: '/profile', desc: 'Update your profile' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
      <p className="text-gray-600 mb-8">Role: <span className="capitalize font-medium">{user?.role}</span></p>

      <div className="grid md:grid-cols-3 gap-6">
        {quickLinks.map((link) => (
          <Link key={link.path} to={link.path}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-1">{link.title}</h3>
            <p className="text-gray-600 text-sm">{link.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
