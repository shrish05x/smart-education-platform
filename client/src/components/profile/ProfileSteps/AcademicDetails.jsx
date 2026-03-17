const AcademicDetails = ({ data, update }) => {
  const education = data.education || {};

  const handleChange = (field, value) => {
    update('education', { ...education, [field]: value });
  };

  return (
    <>
      <h2><span className="step-icon">🎓</span> Academic Details</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Course / Branch <span className="required">*</span></label>
          <input
            type="text"
            placeholder="e.g. B.Tech Computer Science"
            value={education.courseBranch || ''}
            onChange={(e) => handleChange('courseBranch', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Year / Semester</label>
          <input
            type="text"
            placeholder="e.g. 3rd Year / 6th Sem"
            value={education.yearSemester || ''}
            onChange={(e) => handleChange('yearSemester', e.target.value)}
          />
        </div>
        <div className="form-group full-width">
          <label>College Name <span className="required">*</span></label>
          <input
            type="text"
            placeholder="Enter your college/university name"
            value={education.collegeName || ''}
            onChange={(e) => handleChange('collegeName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>10th Qualification</label>
          <input
            type="text"
            placeholder="e.g. 95% CBSE"
            value={education.previousQualification10th || ''}
            onChange={(e) => handleChange('previousQualification10th', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>12th Qualification</label>
          <input
            type="text"
            placeholder="e.g. 90% CBSE"
            value={education.previousQualification12th || ''}
            onChange={(e) => handleChange('previousQualification12th', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Enrollment / Roll Number</label>
          <input
            type="text"
            placeholder="Enter your enrollment number"
            value={education.enrollmentRollNumber || ''}
            onChange={(e) => handleChange('enrollmentRollNumber', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default AcademicDetails;
