import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Smart Education Platform
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        AI-powered learning, mentorship, community support, and career opportunities — all in one place.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/register" className="bg-primary-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-700 transition">
          Get Started
        </Link>
        <Link to="/login" className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-50 transition">
          Sign In
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-20 text-left">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🤖 AI Tutor</h3>
          <p className="text-gray-600">Get personalized help from our AI-powered tutor anytime.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">👨‍🏫 Mentorship</h3>
          <p className="text-gray-600">Connect with experienced mentors in your field of study.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">💬 Community</h3>
          <p className="text-gray-600">Join study groups and collaborate with fellow students.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🧠 Mental Health</h3>
          <p className="text-gray-600">Access counseling and mental health support resources.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">💼 Internships</h3>
          <p className="text-gray-600">Discover internship opportunities and get resume feedback.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Analytics</h3>
          <p className="text-gray-600">Track your learning progress and performance.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
