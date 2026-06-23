import React from 'react';

export default function RecommendationsPanel({ recommendations }) {
  if (!recommendations || !recommendations.length) return null;

  // Sort recommendations by priority (ascending, so Priority 1 is first)
  const sortedRecs = [...recommendations].sort((a, b) => a.priority - b.priority);

  const getPriorityColor = (priority) => {
    if (priority === 1) return 'var(--color-critical)';
    if (priority === 2) return 'var(--color-high)';
    if (priority === 3) return 'var(--color-medium)';
    return 'var(--color-low)';
  };

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h3 className="panel-title">
        <span style={{ color: 'var(--color-primary)' }}>🚀</span> Prioritized Action Items
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sortedRecs.map((rec, index) => {
          const badgeColor = getPriorityColor(rec.priority);
          return (
            <div key={index} className="glass-card" style={{
              display: 'flex',
              gap: '1.5rem',
              padding: '1.5rem',
              alignItems: 'flex-start'
            }}>
              {/* Priority badge */}
              <div style={{
                background: `rgba(${badgeColor === 'var(--color-critical)' ? '239, 68, 68' : badgeColor === 'var(--color-high)' ? '249, 115, 22' : '234, 179, 8'}, 0.1)`,
                border: `1px solid ${badgeColor}`,
                color: badgeColor,
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: '0.85rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>
                Priority {rec.priority}
              </div>

              {/* Recommendation details */}
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  {rec.action}
                </h4>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  marginBottom: '0.75rem'
                }}>
                  {rec.reason}
                </p>
                {rec.metric && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-color)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'var(--text-muted)'
                  }}>
                    Source Metric: {rec.metric}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
