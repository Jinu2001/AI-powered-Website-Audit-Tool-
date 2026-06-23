import React, { useState } from 'react';

export default function PromptLogViewer({ promptLogs }) {
  if (!promptLogs) return null;

  const [activeSubTab, setActiveSubTab] = useState('system');

  const renderCodeContent = (content) => {
    return (
      <pre className="bg-[#121014] border border-outline/30 rounded-lg p-sm overflow-x-auto text-caption font-mono text-[#dbb8ff] leading-relaxed max-h-[350px] overflow-y-auto">
        <code>{content}</code>
      </pre>
    );
  };

  return (
    <div className="bg-inverse-surface text-white rounded-xl overflow-hidden mt-xl subtle-shadow">
      <details className="group">
        <summary className="flex justify-between items-center p-md cursor-pointer select-none">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary-fixed" style={{ fontSize: '20px' }}>terminal</span>
            <span className="font-label-md text-label-md text-inverse-on-surface font-semibold">
              VIEW PROMPT LOGS (DEVELOPER CONSOLE)
            </span>
          </div>
          <span className="material-symbols-outlined text-inverse-on-surface transition-transform duration-200 group-open:rotate-180" style={{ fontSize: '20px' }}>
            expand_more
          </span>
        </summary>
        
        <div className="px-md pb-md pt-xs border-t border-outline-variant/10">
          {/* Sub-tabs inside prompt viewer */}
          <div className="flex gap-sm border-b border-outline-variant/20 pb-sm mb-md overflow-x-auto">
            {[
              { id: 'system', label: 'System Instructions' },
              { id: 'user', label: 'User Data Payload' },
              { id: 'raw', label: 'Raw Gemini Response' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSubTab(tab.id);
                }}
                className={`px-sm py-xs text-caption font-semibold rounded transition-all cursor-pointer ${
                  activeSubTab === tab.id 
                    ? 'bg-primary-container text-white shadow' 
                    : 'text-inverse-on-surface/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div>
            {activeSubTab === 'system' && renderCodeContent(promptLogs.system_prompt)}
            {activeSubTab === 'user' && renderCodeContent(promptLogs.user_prompt)}
            {activeSubTab === 'raw' && renderCodeContent(promptLogs.raw_output)}
          </div>
        </div>
      </details>
    </div>
  );
}
