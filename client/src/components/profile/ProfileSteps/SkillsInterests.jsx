import { useState } from 'react';

const TagsInput = ({ tags = [], onChange, placeholder }) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        onChange([...tags, input.trim()]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  return (
    <div className="tags-input-container">
      {tags.map((tag, idx) => (
        <span className="tag" key={idx}>
          {tag}
          <button onClick={() => removeTag(idx)}>&times;</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ''}
      />
    </div>
  );
};

const SkillsInterests = ({ data, update }) => {
  const skill = data.skill || { technicalSkills: [], interests: [], hobbies: [] };

  const handleTagChange = (field, newTags) => {
    update('skill', { ...skill, [field]: newTags });
  };

  return (
    <>
      <h2><span className="step-icon">⚡</span> Skills & Interests</h2>
      <div className="form-grid single-col">
        <div className="form-group">
          <label>Technical Skills <span className="required">*</span></label>
          <TagsInput
            tags={skill.technicalSkills || []}
            onChange={(tags) => handleTagChange('technicalSkills', tags)}
            placeholder="Type a skill and press Enter (e.g. React, Python)"
          />
        </div>
        <div className="form-group">
          <label>Interests</label>
          <TagsInput
            tags={skill.interests || []}
            onChange={(tags) => handleTagChange('interests', tags)}
            placeholder="Type an interest and press Enter"
          />
        </div>
        <div className="form-group">
          <label>Hobbies</label>
          <TagsInput
            tags={skill.hobbies || []}
            onChange={(tags) => handleTagChange('hobbies', tags)}
            placeholder="Type a hobby and press Enter"
          />
        </div>
      </div>
    </>
  );
};

export default SkillsInterests;
