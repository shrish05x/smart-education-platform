import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../../api/groups';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Computer Science', 'Literature', 'Economics'];

const PRESET_COLORS = ['#5865f2', '#eb459e', '#57f287', '#fee75c', '#ed4245', '#3ba55c', '#9b59b6', '#faa61a'];

const SUBJECT_COLORS = {
  Mathematics: '#5865f2',
  Physics: '#ed4245',
  Chemistry: '#3ba55c',
  Biology: '#57f287',
  History: '#faa61a',
  'Computer Science': '#fee75c',
  Literature: '#eb459e',
  Economics: '#9b59b6',
};

const CreateGroupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    subject: '',
    description: '',
    tags: [],
    maxMembers: 50,
    isPrivate: false,
    inviteCode: '',
    coverColor: '#5865f2',
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleTagKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (form.tags.length >= 5) return;
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
      if (!form.tags.includes(tag)) {
        set('tags', [...form.tags, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => set('tags', form.tags.filter((t) => t !== tag));

  const generateInviteCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    set('inviteCode', code);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Group name is required';
    if (!form.subject) errs.subject = 'Subject is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.isPrivate && !form.inviteCode.trim()) errs.inviteCode = 'Invite code required for private groups';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await createGroup(form);
      showToast('Group created successfully! 🎉');
      setTimeout(() => navigate(`/groups/${data.data._id}`), 800);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to create group', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (errKey) => ({
    width: '100%',
    padding: '10px 14px',
    background: '#16171c',
    border: `1px solid ${errors[errKey] ? '#ed4245' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  });

  const labelStyle = { display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#b9bbbe' };

  // Live preview
  const subjectColor = SUBJECT_COLORS[form.subject] || '#747f8d';

  return (
    <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            padding: '12px 20px',
            borderRadius: 10,
            background: toast.type === 'error' ? '#ed4245' : '#3ba55c',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>
            Group Name <span style={{ color: '#ed4245' }}>*</span>
            <span style={{ float: 'right', fontWeight: 400, color: form.name.length > 50 ? '#faa61a' : '#72767d' }}>
              {form.name.length}/60
            </span>
          </label>
          <input
            type="text"
            value={form.name}
            maxLength={60}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Calculus Study Circle"
            style={inputStyle('name')}
          />
          {errors.name && <p style={{ color: '#ed4245', fontSize: 12, margin: '4px 0 0' }}>{errors.name}</p>}
        </div>

        {/* Subject */}
        <div>
          <label style={labelStyle}>Subject <span style={{ color: '#ed4245' }}>*</span></label>
          <select
            value={form.subject}
            onChange={(e) => set('subject', e.target.value)}
            style={{ ...inputStyle('subject'), cursor: 'pointer' }}
          >
            <option value="">Select a subject…</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.subject && <p style={{ color: '#ed4245', fontSize: 12, margin: '4px 0 0' }}>{errors.subject}</p>}
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>
            Description <span style={{ color: '#ed4245' }}>*</span>
            <span style={{ float: 'right', fontWeight: 400, color: form.description.length > 260 ? '#faa61a' : '#72767d' }}>
              {form.description.length}/300
            </span>
          </label>
          <textarea
            value={form.description}
            maxLength={300}
            onChange={(e) => set('description', e.target.value)}
            placeholder="What does this group focus on? What can members expect?"
            rows={4}
            style={{ ...inputStyle('description'), resize: 'vertical', lineHeight: 1.5 }}
          />
          {errors.description && <p style={{ color: '#ed4245', fontSize: 12, margin: '4px 0 0' }}>{errors.description}</p>}
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags (max 5) — press Enter to add</label>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              padding: '8px 12px',
              background: '#16171c',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              minHeight: 44,
            }}
          >
            {form.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 10px',
                  background: '#2b2d35',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#b9bbbe',
                }}
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  style={{ background: 'none', border: 'none', color: '#72767d', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                >
                  ×
                </button>
              </span>
            ))}
            {form.tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                placeholder={form.tags.length === 0 ? 'exam-prep, weekly-meets…' : ''}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: 13,
                  minWidth: 120,
                  flex: 1,
                }}
              />
            )}
          </div>
        </div>

        {/* Max Members */}
        <div>
          <label style={labelStyle}>Max Members (2–200)</label>
          <input
            type="number"
            value={form.maxMembers}
            min={2}
            max={200}
            onChange={(e) => set('maxMembers', Number(e.target.value))}
            style={inputStyle('maxMembers')}
          />
        </div>

        {/* Private Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            onClick={() => {
              set('isPrivate', !form.isPrivate);
              if (!form.isPrivate && !form.inviteCode) generateInviteCode();
            }}
            style={{
              width: 44,
              height: 24,
              borderRadius: 12,
              background: form.isPrivate ? '#5865f2' : '#2b2d35',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.2s',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: 3,
                left: form.isPrivate ? 23 : 3,
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: '#fff',
                transition: 'left 0.2s',
              }}
            />
          </button>
          <span style={{ color: '#fff', fontSize: 14 }}>Private Group 🔒</span>
        </div>

        {form.isPrivate && (
          <div>
            <label style={labelStyle}>Invite Code</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={form.inviteCode}
                maxLength={6}
                onChange={(e) => set('inviteCode', e.target.value.toUpperCase())}
                placeholder="Auto-generated"
                style={{ ...inputStyle('inviteCode'), flex: 1, letterSpacing: 4, fontWeight: 700 }}
              />
              <button
                type="button"
                onClick={generateInviteCode}
                style={{
                  padding: '10px 14px',
                  background: '#2b2d35',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                }}
              >
                🔄 Generate
              </button>
            </div>
            {errors.inviteCode && <p style={{ color: '#ed4245', fontSize: 12, margin: '4px 0 0' }}>{errors.inviteCode}</p>}
          </div>
        )}

        {/* Cover Color */}
        <div>
          <label style={labelStyle}>Cover Color</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set('coverColor', c)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: c,
                  border: form.coverColor === c ? '3px solid #fff' : '3px solid transparent',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'transform 0.15s',
                  transform: form.coverColor === c ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '14px 24px',
            borderRadius: 12,
            background: loading ? '#3a3d47' : '#5865f2',
            color: '#fff',
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s',
            fontFamily: 'Space Grotesk, Sora, sans-serif',
          }}
        >
          {loading ? 'Creating…' : '✨ Create Study Group'}
        </button>
      </form>

      {/* Live Preview */}
      <div style={{ width: 320, flexShrink: 0 }}>
        <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, color: '#72767d', marginBottom: 12 }}>Live Preview</p>
        <div
          style={{
            background: '#1e1f26',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ height: 6, background: form.coverColor }} />
          <div style={{ padding: '16px 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, Sora, sans-serif' }}>
                {form.name || 'Group Name'}
              </h3>
              {form.isPrivate && <span>🔒</span>}
            </div>
            {form.subject && (
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: subjectColor + '22',
                  color: subjectColor,
                  border: `1px solid ${subjectColor}44`,
                  marginBottom: 10,
                }}
              >
                {form.subject}
              </span>
            )}
            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#b9bbbe', lineHeight: 1.5 }}>
              {form.description || 'Your group description will appear here…'}
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {form.tags.map((tag) => (
                <span key={tag} style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, color: '#72767d', background: '#2b2d35' }}>
                  #{tag}
                </span>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: '#72767d' }}>
              👥 1 / {form.maxMembers} members
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupForm;
