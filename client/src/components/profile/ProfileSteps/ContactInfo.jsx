import { useAuth } from '../../../context/AuthContext';

const ContactInfo = ({ data, update }) => {
  const { user } = useAuth();
  const contact = data.contact || {};

  const handleChange = (field, value) => {
    update('contact', { ...contact, [field]: value });
  };

  return (
    <>
      <h2><span className="step-icon">📞</span> Contact Information</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          />
        </div>
        <div className="form-group">
          <label>Phone Number <span className="required">*</span></label>
          <input
            type="tel"
            placeholder="e.g. +91 9876543210"
            value={contact.phoneNumber || ''}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label>Current Address <span className="required">*</span></label>
          <textarea
            placeholder="Enter your current address"
            value={contact.currentAddress || ''}
            onChange={(e) => handleChange('currentAddress', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label>Permanent Address</label>
          <textarea
            placeholder="Enter your permanent address"
            value={contact.permanentAddress || ''}
            onChange={(e) => handleChange('permanentAddress', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input
            type="url"
            placeholder="https://linkedin.com/in/yourname"
            value={contact.linkedInUrl || ''}
            onChange={(e) => handleChange('linkedInUrl', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Portfolio URL</label>
          <input
            type="url"
            placeholder="https://yourportfolio.com"
            value={contact.portfolioUrl || ''}
            onChange={(e) => handleChange('portfolioUrl', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default ContactInfo;
