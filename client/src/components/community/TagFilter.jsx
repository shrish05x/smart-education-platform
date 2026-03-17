const TagFilter = ({ tags = [], activeTag, onTagChange }) => {
  const allTags = ['All', ...tags];

  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4,
        scrollbarWidth: 'none',
      }}
    >
      <style>{`::-webkit-scrollbar{display:none}`}</style>
      {allTags.map((tag) => {
        const isActive = tag === 'All' ? !activeTag : activeTag === tag;
        return (
          <button
            key={tag}
            onClick={() => onTagChange(tag === 'All' ? null : tag)}
            style={{
              padding: '5px 14px',
              borderRadius: 20,
              border: isActive ? '1px solid #4f46e5' : '1px solid #e2e8f0',
              background: isActive ? '#4f46e5' : '#ffffff',
              color: isActive ? '#ffffff' : '#64748b',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s',
              flexShrink: 0,
            }}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default TagFilter;
