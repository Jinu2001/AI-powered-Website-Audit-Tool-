import React, { useState } from 'react';

export default function UrlInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="input-focus-ring group flex flex-col md:flex-row items-center gap-base p-xs bg-white border border-outline-variant rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center w-full px-md py-sm">
          <span className="material-symbols-outlined text-outline mr-sm">language</span>
          <input
            type="url"
            className="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline-variant font-body-md text-body-md"
            placeholder="https://yoursite.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="cta-gradient w-full md:w-auto whitespace-nowrap px-xl py-md rounded-lg text-white font-label-md text-label-md shadow-lg flex items-center justify-center gap-sm disabled:opacity-60 cursor-pointer"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>progress_activity</span>
              Analyzing...
            </>
          ) : (
            <>
              Run Audit
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
