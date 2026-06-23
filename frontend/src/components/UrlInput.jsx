import React, { useState } from 'react';

export default function UrlInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '640px',
      margin: '0 auto 3rem auto',
      animation: 'fadeInUp 0.8s ease-out'
    }}>
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '0.5rem',
        alignItems: 'center',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
        transition: 'var(--transition-smooth)',
      }} className="input-wrapper">
        <input
          type="text"
          placeholder="Enter website URL to audit (e.g. eight25media.com)..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            padding: '0.75rem 1rem',
          }}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '0.75rem 1.5rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: '0.95rem',
            cursor: 'pointer',
            opacity: loading || !url.trim() ? 0.6 : 1,
            transition: 'var(--transition-smooth)',
            boxShadow: '0 4px 12px rgba(110, 68, 255, 0.3)',
          }}
        >
          {loading ? 'Analyzing...' : 'Run Audit'}
        </button>
      </div>
    </form>
  );
}
