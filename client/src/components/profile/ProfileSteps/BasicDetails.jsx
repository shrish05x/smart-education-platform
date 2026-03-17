const BasicDetails = ({ data, update }) => {
  const profile = data.profile || {};

  const handleChange = (field, value) => {
    update('profile', { ...profile, [field]: value });
  };

  return (
    <>
      <h2><span className="step-icon">👤</span> Basic Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name <span className="required">*</span></label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={profile.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Date of Birth <span className="required">*</span></label>
          <input
            type="date"
            value={profile.dateOfBirth ? profile.dateOfBirth.substring(0, 10) : ''}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Gender <span className="required">*</span></label>
          <select
            value={profile.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div className="form-group">
          <label>Nationality</label>
          <input
            type="text"
            placeholder="e.g. Indian"
            value={profile.nationality || ''}
            onChange={(e) => handleChange('nationality', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label>Profile Photo</label>
          <input type="file" accept="image/*" />
          <small style={{ color: '#6b7280', marginTop: '0.25rem' }}>Upload a recent photo (max 2MB)</small>
        </div>
      </div>
    </>
  );
};

export default BasicDetails;
