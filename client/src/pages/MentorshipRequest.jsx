import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import mentorApi from '../services/mentorApi';

const MentorshipRequest = () => {
  const [searchParams] = useSearchParams();
  const mentorId = searchParams.get('mentorId');
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [mentorsList, setMentorsList] = useState([]); // If no mentor is pre-selected
  
  const [formData, setFormData] = useState({
    mentorId: mentorId || '',
    date: '',
    time: '',
    duration: '60',
    goals: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (mentorId) {
      // Fetch specific mentor
      mentorApi.getMentorById(mentorId)
        .then(res => setMentor(res.data))
        .catch(err => setError('Mentor not found or unavailable.'));
    } else {
      // Fetch all available mentors to populate dropdown
      mentorApi.getAllMentors({ availability: true })
        .then(res => setMentorsList(res.data || []))
        .catch(err => setError('Could not load mentors list.'));
    }
  }, [mentorId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.mentorId) return "Please select a mentor.";
    if (!formData.date || !formData.time) return "Please select a date and time.";
    if (!formData.goals.trim()) return "Please provide your goals for this session.";
    
    // Check if date is > 24h
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    const minTime = new Date();
    minTime.setHours(minTime.getHours() + 24);
    
    if (selectedDateTime <= minTime) {
      return "Sessions must be booked at least 24 hours in advance.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const combinedDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      await mentorApi.createMentorshipRequest({
        mentorId: formData.mentorId,
        date: combinedDateTime,
        duration: parseInt(formData.duration),
        goals: formData.goals
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'M';
    const split = name.split(' ');
    if (split.length > 1) return split[0][0] + split[1][0];
    return split[0][0];
  };

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-clash font-bold text-gray-900 mb-4">Request Sent!</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Your mentorship request has been submitted successfully. The mentor will review it and you will be notified soon.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/mentorship/sessions')} 
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              View My Sessions
            </button>
            <button 
              onClick={() => navigate('/mentors')} 
              className="px-6 py-3 bg-white text-gray-700 font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Mentors
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Get min date (tomorrow) for native date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-10 px-8 text-white relative flex flex-col items-center text-center">
          <h1 className="text-3xl font-clash font-bold mb-2">Request a Session</h1>
          <p className="text-indigo-100 max-w-lg">Take the next step in your career by connecting with industry experts.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-100">
               <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
               <span className="font-medium text-sm">{error}</span>
            </div>
          )}

          {/* Mentor Selection / Display */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3">Selected Mentor</label>
            {mentor ? (
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  {mentor.avatar ? (
                    <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-indigo-800">{getInitials(mentor.name)}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{mentor.name}</p>
                  <p className="text-sm text-gray-500">{mentor.industry} • {mentor.experience} yrs exp</p>
                </div>
              </div>
            ) : (
              <select
                name="mentorId"
                value={formData.mentorId}
                onChange={handleChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm text-sm text-gray-700"
              >
                <option value="">-- Choose a Mentor --</option>
                {mentorsList.map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.industry})</option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date (min. 24h advance)</label>
              <input
                type="date"
                name="date"
                min={minDateStr}
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm text-sm"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">Session Duration</label>
            <div className="grid grid-cols-3 gap-3">
              {['30', '60', '90'].map(mins => (
                <label key={mins} className="cursor-pointer">
                  <input
                    type="radio"
                    name="duration"
                    value={mins}
                    checked={formData.duration === mins}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="text-center py-3 border border-gray-200 rounded-xl peer-checked:bg-indigo-50 peer-checked:border-indigo-500 peer-checked:text-indigo-700 font-medium text-sm text-gray-600 transition-all hover:bg-gray-50">
                    {mins} mins
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">Goals & Message</label>
            <p className="text-xs text-gray-500 mb-3">Briefly describe what you'd like to achieve in this session (e.g., portfolio review, career advice, technical help in React).</p>
            <textarea
              name="goals"
              rows="4"
              value={formData.goals}
              onChange={handleChange}
              required
              className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all shadow-sm text-sm resize-none"
              placeholder="Hi! I'm struggling with system design interviews and would love to do a mock interview..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => navigate('/mentors')}
              className="px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center min-w-[140px]"
            >
              {loading ? (
                 <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Submit Request'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
};

export default MentorshipRequest;
