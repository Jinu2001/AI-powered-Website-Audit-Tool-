import React from 'react';

export default function MetricsPanel({ metrics, pageType }) {
  const formatPageType = (type) => {
    if (!type) return '';
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const metricCards = [
    {
      title: 'Word Count',
      value: metrics.word_count,
      sub: `Ideal range for ${formatPageType(pageType)}`,
      highlight: metrics.word_count < 100
    },
    {
      title: 'Page Category',
      value: formatPageType(pageType),
      sub: 'Classified by behavior engine',
      highlight: false
    },
    {
      title: 'Headings Structure',
      value: `H1: ${metrics.h1_count} | H2: ${metrics.h2_count} | H3: ${metrics.h3_count}`,
      sub: metrics.h1_count === 0 ? 'No H1 (Critical)' : 'Hierarchy',
      highlight: metrics.h1_count === 0
    },
    {
      title: 'Call to Actions',
      value: metrics.cta_count,
      sub: 'Action elements & buttons',
      highlight: false
    },
    {
      title: 'Links Profile',
      value: `${metrics.internal_links} Int / ${metrics.external_links} Ext`,
      sub: `Total: ${metrics.internal_links + metrics.external_links} links`,
      highlight: metrics.external_links > metrics.internal_links
    },
    {
      title: 'Image Alt Text',
      value: `${metrics.images_missing_alt} / ${metrics.images_total} missing`,
      sub: `${metrics.images_missing_alt_pct} lack alt descriptions`,
      highlight: metrics.images_missing_alt > 0 && parseFloat(metrics.images_missing_alt_pct) > 50
    }
  ];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h3 className="panel-title">
        <span style={{ color: 'var(--color-primary)' }}>📊</span> Page Analysis Metrics
      </h3>

      {metrics.is_spa && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.5rem',
          color: 'var(--color-critical)',
          fontSize: '0.9rem'
        }}>
          <strong>⚠️ SPA (Single Page App) Warning:</strong> This page has under 50 words (${metrics.word_count}). It might be client-side rendered (JavaScript SPA) or protected, limiting standard HTML crawler metrics.
        </div>
      )}

      {/* Grid of metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {metricCards.map((card, idx) => (
          <div 
            key={idx} 
            className="glass-card" 
            style={{ 
              padding: '1.5rem',
              borderColor: card.highlight ? 'var(--color-critical)' : 'var(--border-color)'
            }}
          >
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              {card.title}
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: card.highlight ? 'var(--color-critical)' : 'var(--text-primary)', marginBottom: '0.25rem' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {card.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Meta tags card */}
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
          Meta Information Tags
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Meta Title</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 500, wordBreak: 'break-all' }}>
              {metrics.meta_title || <span style={{ color: 'var(--color-critical)' }}>None defined</span>}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Meta Description</span>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
              {metrics.meta_description || <span style={{ color: 'var(--color-high)' }}>None defined</span>}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
