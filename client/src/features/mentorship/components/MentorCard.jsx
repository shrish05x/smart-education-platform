const MentorCard = ({ mentor }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-lg font-bold text-primary-600">
          {mentor.user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold">{mentor.user?.name}</h3>
          <p className="text-sm text-gray-600">{mentor.designation}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">{mentor.company}</p>
      <div className="flex flex-wrap gap-1 mb-3">
        {mentor.expertise?.map((skill) => (
          <span key={skill} className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded">{skill}</span>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">⭐ {mentor.rating || 'N/A'}</span>
        <button className="bg-primary-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-primary-700 transition">
          Book Session
        </button>
      </div>
    </div>
  );
};

export default MentorCard;
