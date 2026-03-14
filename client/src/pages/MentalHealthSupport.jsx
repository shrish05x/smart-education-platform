const MentalHealthSupport = () => {
  const resources = [
    { title: 'Book a Counseling Session', desc: 'Connect with a certified counselor for a private session.', icon: '🗓️' },
    { title: 'Self-Help Resources', desc: 'Access articles, videos, and tools for mental wellness.', icon: '📚' },
    { title: 'Crisis Helpline', desc: 'Immediate support available 24/7.', icon: '📞' },
    { title: 'Peer Support Groups', desc: 'Join a supportive community of students.', icon: '🤝' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mental Health Support</h1>
      <p className="text-gray-600 mb-8">Your well-being matters. Access the support you need.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <div key={resource.title} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer">
            <div className="text-3xl mb-3">{resource.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{resource.title}</h3>
            <p className="text-gray-600 text-sm">{resource.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MentalHealthSupport;
