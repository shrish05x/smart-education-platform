import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [resumeURL, setResumeURL] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    fetchInternship();
  }, [id]);

  const fetchInternship = async () => {
    try {
      const response = await api.get(`/internships/${id}`);
      setInternship(response.data);
    } catch (error) {
      console.error('Error fetching internship:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);
    setApplyError('');
    try {
      await api.post('/internships/apply', { internshipId: id, resumeURL });
      setApplySuccess(true);
      setShowApplyForm(false);
    } catch (error) {
      setApplyError(error.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-24" />
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-3" />
          <div className="h-5 bg-gray-100 rounded w-1/3 mb-6" />
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-50 rounded-xl" />)}
          </div>
          <div className="space-y-2">
            {[1,2,3,4].map(i => <div key={i} className="h-4 bg-gray-100 rounded w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Internship not found</h2>
        <p className="text-gray-500 mb-6">This internship may have been removed or doesn't exist.</p>
        <Link to="/internships" className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition-colors">
          Browse Internships
        </Link>
      </div>
    );
  }

  const companyName = internship.company || internship.companyId?.name || 'Unknown Company';

  const companyColors = {
    'Google': 'from-blue-500 to-green-400',
    'Microsoft': 'from-blue-600 to-indigo-500',
    'Amazon': 'from-orange-500 to-amber-400',
    'Flipkart': 'from-yellow-400 to-blue-500',
    'Razorpay': 'from-blue-500 to-cyan-400',
    'Zomato': 'from-red-500 to-pink-400',
  };

  const gradientColor = companyColors[companyName] || 'from-indigo-500 to-purple-500';

  const typeConfig = {
    remote: { label: 'Remote', color: 'bg-emerald-100 text-emerald-700', icon: '🏠' },
    onsite: { label: 'On-site', color: 'bg-blue-100 text-blue-700', icon: '🏢' },
    hybrid: { label: 'Hybrid', color: 'bg-purple-100 text-purple-700', icon: '🔄' },
  };
  const typeInfo = typeConfig[internship.type] || { label: internship.type, color: 'bg-gray-100 text-gray-700', icon: '💼' };

  const deadlineDays = Math.ceil((new Date(internship.deadline) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/internships')}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Internships
      </motion.button>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
      >
        {/* Gradient header */}
        <div className={`h-2 bg-gradient-to-r ${gradientColor}`} />

        <div className="p-6 sm:p-8">
          {/* Company + role header */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientColor} flex items-center justify-center text-white font-bold text-2xl shadow-md flex-shrink-0`}>
              {companyName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{internship.role}</h1>
              <p className="text-indigo-600 font-semibold text-base">{companyName}</p>
            </div>
          </div>

          {/* Quick info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-lg">{typeInfo.icon}</span>
              <p className="text-xs text-gray-500 mt-0.5">Type</p>
              <p className="text-sm font-semibold text-gray-800">{typeInfo.label}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-lg">📍</span>
              <p className="text-xs text-gray-500 mt-0.5">Location</p>
              <p className="text-sm font-semibold text-gray-800">{internship.location}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-lg">⏱️</span>
              <p className="text-xs text-gray-500 mt-0.5">Duration</p>
              <p className="text-sm font-semibold text-gray-800">{internship.duration}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <span className="text-lg">💰</span>
              <p className="text-xs text-gray-500 mt-0.5">Stipend</p>
              <p className="text-sm font-semibold text-emerald-600">
                {internship.stipend > 0 ? `₹${internship.stipend.toLocaleString('en-IN')}/mo` : 'Unpaid'}
              </p>
            </div>
          </div>

          {/* Deadline banner */}
          {deadlineDays > 0 && (
            <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 ${deadlineDays <= 7 ? 'bg-amber-50 border border-amber-100' : 'bg-indigo-50 border border-indigo-100'}`}>
              <span className="text-xl">{deadlineDays <= 7 ? '⚡' : '📅'}</span>
              <div>
                <p className={`text-sm font-semibold ${deadlineDays <= 7 ? 'text-amber-700' : 'text-indigo-700'}`}>
                  {deadlineDays <= 7 ? 'Closing soon!' : 'Application deadline'}
                </p>
                <p className={`text-xs ${deadlineDays <= 7 ? 'text-amber-600' : 'text-indigo-600'}`}>
                  {deadlineDays} days remaining — {new Date(internship.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">{internship.description}</p>
          </div>

          {/* Requirements */}
          {internship.requirements && internship.requirements.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                Requirements
              </h2>
              <ul className="space-y-2">
                {internship.requirements.map((req, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                      {i + 1}
                    </span>
                    {req}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {internship.skillsRequired && internship.skillsRequired.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                Skills Required
              </h2>
              <div className="flex flex-wrap gap-2">
                {internship.skillsRequired.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.03 * i }}
                    className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium border border-indigo-100"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Stats bar */}
          <div className="flex items-center gap-6 py-4 border-t border-gray-100 mb-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              {internship.views || 0} views
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {internship.applicantsCount || 0} applicants
            </span>
          </div>

          {/* Apply section */}
          {applySuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-lg font-bold text-emerald-800 mb-1">Application Submitted!</h3>
              <p className="text-sm text-emerald-600 mb-4">Your application has been sent successfully. Good luck!</p>
              <Link
                to="/my-applications"
                className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                View My Applications
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </motion.div>
          ) : showApplyForm ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-gray-50 rounded-xl p-6 border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Apply for {internship.role}</h3>
              {applyError && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg p-3 mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {applyError}
                </div>
              )}
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Resume URL <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input
                    type="url"
                    value={resumeURL}
                    onChange={(e) => setResumeURL(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                    placeholder="https://drive.google.com/your-resume.pdf"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm hover:shadow-md"
                  >
                    {applying ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Submitting...
                      </span>
                    ) : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="px-5 py-2.5 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowApplyForm(true)}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm"
              >
                Apply Now 🚀
              </motion.button>
              <Link
                to="/internships"
                className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Browse More
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default InternshipDetails;