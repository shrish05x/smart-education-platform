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

const Achievements = ({ data, update }) => {
  const achievement = data.achievement || { hackathons: [], technicalEvents: [], clubMemberships: [] };

  const handleTagChange = (field, newTags) => {
    update('achievement', { ...achievement, [field]: newTags });
  };

  return (
    <>
      <h2><span className="step-icon">🏆</span> Achievements</h2>
      <div className="form-grid single-col">
        <div className="form-group">
          <label>Hackathons</label>
          <TagsInput
            tags={achievement.hackathons || []}
            onChange={(tags) => handleTagChange('hackathons', tags)}
            placeholder="e.g. SIH 2024 Winner, HackTheBox"
          />
        </div>
        <div className="form-group">
          <label>Technical Events</label>
          <TagsInput
            tags={achievement.technicalEvents || []}
            onChange={(tags) => handleTagChange('technicalEvents', tags)}
            placeholder="e.g. CodeChef Rated, ICPC Regionals"
          />
        </div>
        <div className="form-group">
          <label>Club Memberships</label>
          <TagsInput
            tags={achievement.clubMemberships || []}
            onChange={(tags) => handleTagChange('clubMemberships', tags)}
            placeholder="e.g. ACM Student Chapter, IEEE"
          />
        </div>
      </div>
    </>
  );
};

export default Achievements;
