import React from 'react';

export default function InsightsPanel({ insights }) {
  if (!insights) return null;

  const categories = [
    {
      key: 'seo_structure',
      label: 'SEO Structure & Strategy',
      icon: '🔍',
      content: insights.seo_structure
    },
    {
      key: 'messaging_clarity',
      label: 'Messaging & Value Prop Clarity',
      icon: '✨',
      content: insights.messaging_clarity
    },
    {
      key: 'cta_usage',
      label: 'CTA & Conversion Flow',
      icon: '🎯',
      content: insights.cta_usage
    },
    {
      key: 'content_depth',
      label: 'Content Depth & Alignment',
      icon: '📚',
      content: insights.content_depth
    },
    {
      key: 'ux_concerns',
      label: 'UX & Accessibility Concerns',
      icon: '🎨',
      content: insights.ux_concerns
    }
  ];

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h3 className="panel-title">
        <span style={{ color: 'var(--color-primary)' }}>💡</span> AI Strategic Insights
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {categories.map((category) => (
          <div key={category.key} className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              marginBottom: '0.75rem',
              fontFamily: 'var(--font-heading)'
            }}>
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </div>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: '1.6'
            }}>
              {category.content || 'No insights generated for this category.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
