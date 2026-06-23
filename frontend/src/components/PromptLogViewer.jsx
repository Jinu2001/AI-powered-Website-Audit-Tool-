import React, { useState } from 'react';

export default function PromptLogViewer({ promptLogs }) {
  if (!promptLogs) return null;

  const [activeSubTab, setActiveSubTab] = useState('system');

  const renderCodeContent = (content) => {
    return (
      <pre style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-sm)',
        padding: '1.25rem',
        overflowX: 'auto',
        fontSize: '0.85rem',
        fontFamily: 'monospace',
        color: '#a9b1d6',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all',
        maxHeight: '500px',
        overflowY: 'auto'
      }}>
        <code>{content}</code>
      </pre>
    );
  };

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <h3 className="panel-title">
        <span style={{ color: 'var(--color-primary)' }}>🛠️</span> AI Prompt & Output Logs
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
        Debugging logs containing the exact inputs and outputs passed through the Gemini API integration.
      </p>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.5rem'
      }}>
        {[
          { id: 'system', label: 'System Instruction' },
          { id: 'user', label: 'User Prompt (Data)' },
          { id: 'raw', label: 'Raw AI Output' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              background: activeSubTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.5rem 1rem',
              color: activeSubTab === tab.id ? 'var(--color-secondary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activeSubTab === tab.id ? 600 : 400,
              fontSize: '0.85rem',
              transition: 'var(--transition-smooth)'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeSubTab === 'system' && renderCodeContent(promptLogs.system_prompt)}
        {activeSubTab === 'user' && renderCodeContent(promptLogs.user_prompt)}
        {activeSubTab === 'raw' && renderCodeContent(promptLogs.raw_output)}
      </div>
    </div>
  );
}
