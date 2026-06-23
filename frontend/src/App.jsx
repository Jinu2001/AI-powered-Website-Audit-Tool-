import React, { useState } from 'react';
import UrlInput from './components/UrlInput';
import MetricsPanel from './components/MetricsPanel';
import InsightsPanel from './components/InsightsPanel';
import RecommendationsPanel from './components/RecommendationsPanel';
import PromptLogViewer from './components/PromptLogViewer';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'logs'

  const handleAuditSubmit = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setActiveTab('dashboard'); // default to dashboard after fetch
    } catch (err) {
      console.error('Audit submit error:', err);
      setError(err.message || 'An unexpected error occurred while auditing the page.');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === 'CRITICAL') return 'var(--color-critical)';
    if (severity === 'HIGH') return 'var(--color-high)';
    if (severity === 'MEDIUM') return 'var(--color-medium)';
    return 'var(--color-low)';
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <span className="brand-badge">Eight25Media Audits</span>
        <h1 className="app-title">AI Website Auditor</h1>
        <p className="app-subtitle">
          Submit any public URL to perform instant metrics extraction, rule-based flagging, and Gemini 2.5 Flash intelligence insights.
        </p>
      </header>

      {/* URL Input Form */}
      <UrlInput onSubmit={handleAuditSubmit} loading={loading} />

      {/* Loading state indicator */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          animation: 'fadeInUp 0.5s ease-out'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} className="spinner"></div>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1.25rem' }}>
            Auditing Webpage Content...
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Extracting structure and calling Gemini reasoning engine.
          </div>
        </div>
      )}

      {/* Error alert banner */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--color-critical)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          marginBottom: '2rem',
          maxWidth: '640px',
          margin: '0 auto 2rem auto',
          color: 'var(--color-critical)',
          animation: 'fadeInUp 0.5s ease-out'
        }}>
          <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Audit Pipeline Failure
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{error}</p>
        </div>
      )}

      {/* Results Section */}
      {result && !loading && (
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          
          {/* Main Navigation Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                background: activeTab === 'dashboard' 
                  ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' 
                  : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.75rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                boxShadow: activeTab === 'dashboard' ? '0 4px 15px rgba(110,68,255,0.25)' : 'none'
              }}
            >
              📊 Audit Dashboard
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              style={{
                background: activeTab === 'logs' 
                  ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' 
                  : 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.75rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                boxShadow: activeTab === 'logs' ? '0 4px 15px rgba(110,68,255,0.25)' : 'none'
              }}
            >
              🛠️ Prompt Logs (Dev)
            </button>
          </div>

          {activeTab === 'dashboard' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              
              {/* Row: Overview Flags & Benchmarks */}
              {result.flags && result.flags.length > 0 && (
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 className="panel-title" style={{ marginBottom: '1.25rem' }}>
                    <span style={{ color: 'var(--color-critical)' }}>⚠️</span> Rule Engine Flags
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {result.flags.map((flag, idx) => {
                      const col = getSeverityColor(flag.severity);
                      return (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          background: 'rgba(255,255,255,0.02)',
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          borderLeft: `4px solid ${col}`
                        }}>
                          <span style={{
                            color: col,
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            minWidth: '80px'
                          }}>{flag.severity}</span>
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', flex: 1 }}>
                            {flag.description || flag.issue}
                          </span>
                          <span style={{
                            fontSize: '0.8rem',
                            fontFamily: 'monospace',
                            color: 'var(--text-muted)',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px'
                          }}>{flag.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Metrics Grid */}
              <MetricsPanel metrics={result.metrics} pageType={result.page_type} />

              {/* AI Strategic Insights */}
              <InsightsPanel insights={result.insights} />

              {/* Prioritized Action Recommendations */}
              <RecommendationsPanel recommendations={result.recommendations} />

            </div>
          ) : (
            <div className="glass-card">
              <PromptLogViewer promptLogs={result.prompt_logs} />
            </div>
          )}

        </div>
      )}
    </div>
  );
}
