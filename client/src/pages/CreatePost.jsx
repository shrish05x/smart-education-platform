import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createPost, aiAutoTag, aiSimilarPosts } from '../api/community';
import { useToast, ToastContainer } from '../hooks/useToast.jsx';

const SUBJECTS = ['DSA', 'Java', 'Python', 'AI', 'ML', 'DBMS', 'OS', 'CN', 'Web Dev', 'System Design', 'Math', 'Other'];
const TYPES = [
  { value: 'question', label: '❓ Question', desc: 'Ask for help or clarification' },
  { value: 'discussion', label: '💬 Discussion', desc: 'Start a conversation' },
  { value: 'resource', label: '📚 Resource', desc: 'Share notes, links, videos' },
  { value: 'achievement', label: '🏆 Achievement', desc: 'Share a win or milestone' },
];

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, toast } = useToast();

  const [type, setType] = useState('question');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [aiTagging, setAiTagging] = useState(false);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [errors, setErrors] = useState({});

  const similarDebounce = useRef(null);

  const validate = () => {
    const e = {};
    if (!title.trim() || title.trim().length < 5) e.title = 'Title must be at least 5 characters';
    if (!description.trim() || description.trim().length < 20) e.description = 'Description must be at least 20 characters';
    return e;
  };

  const addTag = (raw) => {
    const t = raw.toLowerCase().trim().replace(/\s+/g, '-');
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(prev => [...prev, t]);
    }
    setTagInput('');
  };

  const handleTagKey = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && !tagInput && tags.length) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const handleAiAutoTag = async () => {
    if (!title && !description) { toast.info('Add a title and description first'); return; }
    setAiTagging(true);
    try {
      const { data } = await aiAutoTag(title, description);
      const newTags = data.data.tags.filter(t => !tags.includes(t));
      setTags(prev => [...prev, ...newTags].slice(0, 5));
      toast.success(`AI suggested: ${newTags.join(', ') || 'no new tags'}`);
    } catch { toast.error('AI tagging unavailable'); }
    finally { setAiTagging(false); }
  };

  useEffect(() => {
    if (!title.trim() || title.length < 10) { setSimilarPosts([]); return; }
    clearTimeout(similarDebounce.current);
    similarDebounce.current = setTimeout(async () => {
      try {
        const { data } = await aiSimilarPosts(title);
        setSimilarPosts(data.data.similar || []);
      } catch {}
    }, 600);
    return () => clearTimeout(similarDebounce.current);
  }, [title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const { data } = await createPost({ type, title: title.trim(), description: description.trim(), subject, tags });
      toast.success('Post created!');
      setTimeout(() => navigate(`/community/post/${data.data._id}`), 800);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally { setSubmitting(false); }
  };

  if (!user) return <div style={{ textAlign: 'center', padding: 80 }}><a href="/login" style={{ color: '#0a66c2', fontWeight: 700 }}>Login to create a post</a></div>;

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", background: '#f3f2ef', minHeight: '100vh', padding: '20px 16px' }}>
      <ToastContainer toasts={toasts} />
      <style>{`*{box-sizing:border-box}.field-err{color:#ef4444;font-size:12px;margin-top:3px}`}</style>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <a href="/community" style={{ color: '#0a66c2', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>← Back</a>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#1d2226' }}>Create Post</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Type selector */}
          <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, padding: 20, marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1d2226', marginBottom: 10 }}>Post type</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              {TYPES.map(t => (
                <button type="button" key={t.value} onClick={() => setType(t.value)}
                  style={{ padding: '10px 12px', border: `2px solid ${type === t.value ? '#0a66c2' : '#e0ddd8'}`, borderRadius: 8, background: type === t.value ? '#e8f0fe' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: type === t.value ? '#0a66c2' : '#1d2226' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#5f6b7a', marginTop: 2 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Main form */}
          <div style={{ background: '#fff', border: '1px solid #e0ddd8', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#1d2226', marginBottom: 5 }}>
                Title <span style={{ color: '#ef4444' }}>*</span>
                <span style={{ fontWeight: 400, color: '#5f6b7a', marginLeft: 8 }}>{title.length}/150</span>
              </label>
              <input value={title} onChange={e => { setTitle(e.target.value); setErrors(p => ({ ...p, title: '' })); }}
                maxLength={150} placeholder="e.g. How does Dijkstra's algorithm handle negative weights?"
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${errors.title ? '#fca5a5' : '#e0ddd8'}`, borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              {errors.title && <div className="field-err">{errors.title}</div>}
            </div>

            {/* Subject */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#1d2226', marginBottom: 5 }}>Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #e0ddd8', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', outline: 'none', background: '#fff' }}>
                <option value="">Select a subject…</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: 13, color: '#1d2226', marginBottom: 5 }}>
                Description <span style={{ color: '#ef4444' }}>*</span>
                <span style={{ fontWeight: 400, color: '#5f6b7a', marginLeft: 8 }}>{description.length}/5000</span>
              </label>
              <textarea value={description} onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: '' })); }}
                maxLength={5000} rows={8} placeholder="Describe your question in detail. Include what you've tried and what's confusing you."
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${errors.description ? '#fca5a5' : '#e0ddd8'}`, borderRadius: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none' }} />
              {errors.description && <div className="field-err">{errors.description}</div>}
            </div>

            {/* Tags */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <label style={{ fontWeight: 700, fontSize: 13, color: '#1d2226' }}>Tags ({tags.length}/5)</label>
                <button type="button" onClick={handleAiAutoTag} disabled={aiTagging}
                  style={{ padding: '4px 12px', border: '1px solid #7c3aed', borderRadius: 12, fontSize: 12, fontWeight: 700, background: '#faf5ff', color: '#7c3aed', cursor: 'pointer' }}>
                  {aiTagging ? '…' : '✨ AI Auto-tag'}
                </button>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '8px 10px', border: '1px solid #e0ddd8', borderRadius: 8, cursor: 'text', minHeight: 42 }}>
                {tags.map(t => (
                  <span key={t} style={{ padding: '2px 8px', background: '#e8f0fe', color: '#0a66c2', borderRadius: 12, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    {t}<span onClick={() => setTags(prev => prev.filter(x => x !== t))} style={{ cursor: 'pointer', opacity: 0.7, fontWeight: 700 }}>×</span>
                  </span>
                ))}
                {tags.length < 5 && (
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleTagKey}
                    placeholder={tags.length === 0 ? 'Type tag + Enter' : ''}
                    style={{ border: 'none', outline: 'none', fontSize: 13, fontFamily: 'inherit', flex: 1, minWidth: 80 }} />
                )}
              </div>
              <div style={{ fontSize: 11, color: '#5f6b7a', marginTop: 3 }}>Press Enter or comma to add. Max 5 tags.</div>
            </div>

            {/* Similar posts warning */}
            {similarPosts.length > 0 && (
              <div style={{ padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e', marginBottom: 6 }}>⚠️ Similar questions already asked:</div>
                {similarPosts.slice(0, 3).map((p, i) => (
                  <a key={i} href={`/community/post/${p.id}`} target="_blank" rel="noreferrer"
                    style={{ display: 'block', fontSize: 13, color: '#0a66c2', textDecoration: 'none', marginBottom: 2 }}>
                    → {p.title}
                  </a>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <a href="/community" style={{ padding: '9px 20px', border: '1px solid #e0ddd8', borderRadius: 20, fontWeight: 600, fontSize: 14, color: '#1d2226', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Cancel</a>
              <button type="submit" disabled={submitting}
                style={{ padding: '9px 22px', background: '#0a66c2', color: '#fff', border: 'none', borderRadius: 20, fontWeight: 700, fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
