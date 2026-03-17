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

const emptyProject = { title: '', description: '', techStack: [] };

const Projects = ({ data, update }) => {
  const projects = data.projects?.length > 0 ? data.projects : [{ ...emptyProject }];

  const handleChange = (idx, field, value) => {
    const updated = projects.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    update('projects', updated);
  };

  const addProject = () => {
    update('projects', [...projects, { ...emptyProject }]);
  };

  const removeProject = (idx) => {
    if (projects.length <= 1) return;
    update('projects', projects.filter((_, i) => i !== idx));
  };

  return (
    <>
      <h2><span className="step-icon">💻</span> Projects</h2>
      {projects.map((project, idx) => (
        <div className="repeatable-section" key={idx}>
          {projects.length > 1 && (
            <button className="remove-btn" onClick={() => removeProject(idx)}>✕ Remove</button>
          )}
          <div className="form-grid">
            <div className="form-group">
              <label>Project Title <span className="required">*</span></label>
              <input
                type="text"
                placeholder="e.g. Smart Education Platform"
                value={project.title || ''}
                onChange={(e) => handleChange(idx, 'title', e.target.value)}
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                placeholder="Briefly describe what you built"
                value={project.description || ''}
                onChange={(e) => handleChange(idx, 'description', e.target.value)}
              />
            </div>
            <div className="form-group full-width">
              <label>Tech Stack</label>
              <TagsInput
                tags={project.techStack || []}
                onChange={(tags) => handleChange(idx, 'techStack', tags)}
                placeholder="Type a technology and press Enter"
              />
            </div>
          </div>
        </div>
      ))}
      <button className="add-item-btn" onClick={addProject}>+ Add Another Project</button>
    </>
  );
};

export default Projects;
