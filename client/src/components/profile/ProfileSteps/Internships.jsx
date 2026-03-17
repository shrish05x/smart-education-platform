import { useState } from 'react';

const TagsInput = ({ tags = [], onChange, placeholder }) => {
  const [input, setInput] = useState('');
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) onChange([...tags, input.trim()]);
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };
  const removeTag = (idx) => onChange(tags.filter((_, i) => i !== idx));
  return (
    <div className="tags-input-container">
      {tags.map((tag, idx) => (
        <span className="tag" key={idx}>{tag}<button onClick={() => removeTag(idx)}>&times;</button></span>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={tags.length === 0 ? placeholder : ''} />
    </div>
  );
};

const emptyInternship = { status: '', companyName: '', duration: '', mode: '', stipend: '', technologyUsed: [] };

const Internships = ({ data, update }) => {
  const internships = data.internships?.length > 0 ? data.internships : [{ ...emptyInternship }];

  const handleChange = (idx, field, value) => {
    const updated = internships.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    update('internships', updated);
  };

  const addInternship = () => {
    update('internships', [...internships, { ...emptyInternship }]);
  };

  const removeInternship = (idx) => {
    if (internships.length <= 1) return;
    update('internships', internships.filter((_, i) => i !== idx));
  };

  return (
    <>
      <h2><span className="step-icon">🏢</span> Internship Details</h2>
      {internships.map((intern, idx) => (
        <div className="repeatable-section" key={idx}>
          {internships.length > 1 && (
            <button className="remove-btn" onClick={() => removeInternship(idx)}>✕ Remove</button>
          )}
          <div className="form-grid">
            <div className="form-group">
              <label>Status <span className="required">*</span></label>
              <select
                value={intern.status || ''}
                onChange={(e) => handleChange(idx, 'status', e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
              </select>
            </div>
            <div className="form-group">
              <label>Company Name <span className="required">*</span></label>
              <input
                type="text"
                placeholder="e.g. Google"
                value={intern.companyName || ''}
                onChange={(e) => handleChange(idx, 'companyName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                placeholder="e.g. 6 Months"
                value={intern.duration || ''}
                onChange={(e) => handleChange(idx, 'duration', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mode</label>
              <select
                value={intern.mode || ''}
                onChange={(e) => handleChange(idx, 'mode', e.target.value)}
              >
                <option value="">Select Mode</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="form-group">
              <label>Stipend</label>
              <input
                type="text"
                placeholder="e.g. ₹10,000/month"
                value={intern.stipend || ''}
                onChange={(e) => handleChange(idx, 'stipend', e.target.value)}
              />
            </div>
            <div className="form-group full-width">
              <label>Technology Used</label>
              <TagsInput
                tags={intern.technologyUsed || []}
                onChange={(tags) => handleChange(idx, 'technologyUsed', tags)}
                placeholder="Type a technology and press Enter"
              />
            </div>
          </div>
        </div>
      ))}
      <button className="add-item-btn" onClick={addInternship}>+ Add Another Internship</button>
    </>
  );
};

export default Internships;
