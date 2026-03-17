import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPost } from '../api/community';
import { useToast, ToastContainer } from '../hooks/useToast';

const CreatePost = () => {
  const navigate = useNavigate();
  const { toasts, toast } = useToast();
  const [form, setForm] = useState({ title: '', description: '', tags: [] });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm((p) => ({ ...p, [k]: v })); if (errors[k]) setErrors((e) => ({ ...e, [k]: '' })); };

  const handleTagKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (form.tags.length >= 5) return;
      const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-').slice(0, 30);
      if (tag && !form.tags.includes(tag)) set('tags', [...form.tags, tag]);
      setTagInput('');
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim() || form.title.trim().length < 5) errs.title = 'Title must be at least 5 characters';
    if (form.title.trim().length > 150) errs.title = 'Title must be under 150 characters';
    if (!form.description.trim() || form.description.trim().length < 20) errs.description = 'Description must be at least 20 characters';
    if (form.description.trim().length > 5000) errs.description = 'Description must be under 5000 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await createPost(form);
      toast.success('Question posted successfully!');
      setTimeout(() => navigate(`/community/post/${data.data._id}`), 600);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasErr) => ({
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${hasErr ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: 8,
    fontSize: 14,
    outline: 'none',
    fontFamily: 'inherit',
    color: '#1e293b',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ fontFamily: "-apple-system,'Segoe UI',sans-serif", maxWidth: 720, margin: '0 auto' }}>
      <ToastContainer toasts={toasts} />

      <Link to="/community" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
        ← Back to Forum
      </Link>

      <h1 style={{ margin: '12px 0 4px', fontSize: 24, fontWeight: 800, color: '#1e293b' }}>Ask a Question</h1>
      <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 14 }}>
        Describe your problem clearly so the community can help.
      </p>

      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Title */}
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
            <span>Title <span style={{ color: '#ef4444' }}>*</span></span>
            <span style={{ fontWeight: 400, color: form.title.length > 130 ? '#ef4444' : '#94a3b8', fontSize: 12 }}>{form.title.length}/150</span>
          </label>
          <input
            type="text"
            value={form.title}
            maxLength={150}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. How do I solve a quadratic equation step by step?"
            style={inputStyle(!!errors.title)}
          />
          {errors.title && <p style={{ margin: '4px 0 0', color: '#ef4444', fontSize: 12 }}>{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
            <span>Description <span style={{ color: '#ef4444' }}>*</span></span>
            <span style={{ fontWeight: 400, color: form.description.length > 4700 ? '#ef4444' : '#94a3b8', fontSize: 12 }}>{form.description.length}/5000</span>
          </label>
          <textarea
            value={form.description}
            maxLength={5000}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Describe your problem in detail. Include what you've already tried, relevant formulas, or code snippets."
            rows={8}
            style={{ ...inputStyle(!!errors.description), resize: 'vertical', lineHeight: 1.6 }}
          />
          {errors.description && <p style={{ margin: '4px 0 0', color: '#ef4444', fontSize: 12 }}>{errors.description}</p>}
        </div>

        {/* Tags */}
        <div>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 700, fontSize: 14, color: '#1e293b' }}>
            Tags <span style={{ fontWeight: 400, color: '#94a3b8' }}>(max 5 — press Enter or comma to add)</span>
          </label>
          <div
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 12px',
              border: '1px solid #e2e8f0', borderRadius: 8, minHeight: 44, alignItems: 'center',
            }}
          >
            {form.tags.map((tag) => (
              <span
                key={tag}
                style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 10px', borderRadius: 4, background: '#eef2ff', color: '#4f46e5', fontSize: 12, fontWeight: 600 }}
              >
                {tag}
                <button type="button" onClick={() => set('tags', form.tags.filter((t) => t !== tag))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a5b4fc', fontWeight: 700, padding: 0, lineHeight: 1 }}>
                  ×
                </button>
              </span>
            ))}
            {form.tags.length < 5 && (
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKey}
                placeholder={form.tags.length === 0 ? 'math, recursion, homework…' : ''}
                style={{ border: 'none', outline: 'none', fontSize: 13, color: '#1e293b', minWidth: 120, flexGrow: 1, fontFamily: 'inherit' }}
              />
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '11px 24px', borderRadius: 8, background: loading ? '#818cf8' : '#4f46e5',
            color: '#fff', border: 'none', fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', alignSelf: 'flex-start',
          }}
        >
          {loading ? 'Posting…' : '🚀 Post Question'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
