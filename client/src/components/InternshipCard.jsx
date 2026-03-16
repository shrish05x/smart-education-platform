import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DeadlineBadge from './DeadlineBadge';

const InternshipCard = ({ internship, index = 0 }) => {
  const companyName = internship.company || internship.companyId?.name || 'Unknown Company';

  const companyColors = {
    'Google': { bg: 'from-blue-500 to-green-400', text: 'text-blue-600', light: 'bg-blue-50' },
    'Microsoft': { bg: 'from-blue-600 to-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-50' },
    'Amazon': { bg: 'from-orange-500 to-amber-400', text: 'text-orange-600', light: 'bg-orange-50' },
    'Flipkart': { bg: 'from-yellow-400 to-blue-500', text: 'text-yellow-600', light: 'bg-yellow-50' },
    'Razorpay': { bg: 'from-blue-500 to-cyan-400', text: 'text-cyan-600', light: 'bg-cyan-50' },
    'Zomato': { bg: 'from-red-500 to-pink-400', text: 'text-red-600', light: 'bg-red-50' },
  };

  const colors = companyColors[companyName] || { bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-600', light: 'bg-indigo-50' };

  const typeConfig = {
    remote: { label: 'Remote', color: 'bg-emerald-100 text-emerald-700' },
    onsite: { label: 'On-site', color: 'bg-blue-100 text-blue-700' },
    hybrid: { label: 'Hybrid', color: 'bg-purple-100 text-purple-700' },
  };

  const typeInfo = typeConfig[internship.type] || { label: internship.type, color: 'bg-gray-100 text-gray-700' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link to={`/internships/${internship._id}`} className="block">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
          {/* Top gradient bar */}
          <div className={`h-1.5 bg-gradient-to-r ${colors.bg}`} />

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm`}>
                  {companyName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                    {internship.role}
                  </h3>
                  <p className={`text-sm font-medium ${colors.text} truncate`}>
                    {companyName}
                  </p>
                </div>
              </div>
              <DeadlineBadge deadline={internship.deadline} />
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeInfo.color}`}>
                {typeInfo.label}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {internship.location}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {internship.duration}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(internship.skillsRequired || []).slice(0, 3).map((skill, i) => (
                <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100 font-medium">
                  {skill}
                </span>
              ))}
              {(internship.skillsRequired || []).length > 3 && (
                <span className="text-xs text-gray-400 px-1 py-0.5">
                  +{internship.skillsRequired.length - 3}
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              {internship.stipend > 0 ? (
                <span className="text-sm font-bold text-emerald-600">
                  ₹{internship.stipend.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-400">/month</span>
                </span>
              ) : (
                <span className="text-sm text-gray-400">Unpaid</span>
              )}
              <span className="text-xs font-medium text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                View Details
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default InternshipCard;