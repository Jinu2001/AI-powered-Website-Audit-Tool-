import React, { useState, useEffect } from 'react';
import UrlInput from './components/UrlInput';
import MetricsPanel from './components/MetricsPanel';
import InsightsPanel from './components/InsightsPanel';
import RecommendationsPanel from './components/RecommendationsPanel';
import PromptLogViewer from './components/PromptLogViewer';

export default function App() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  // Loading cycling status texts
  const [loadingStatus, setLoadingStatus] = useState('Fetching page...');
  
  useEffect(() => {
    if (!loading) return;
    const statuses = [
      'Fetching page...',
      'Extracting metrics...',
      'Running rule engine...',
      'Generating AI insights...'
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % statuses.length;
      setLoadingStatus(statuses[index]);
    }, 2500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleAuditSubmit = async (url) => {
    setUrlInput(url);
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
    } catch (err) {
      console.error('Audit submit error:', err);
      setError(err.message || 'An unexpected error occurred while auditing the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (e) => {
    if (e) e.preventDefault();
    setResult(null);
    setError(null);
    setUrlInput('');
  };

  const formatPageType = (type) => {
    if (!type) return '';
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getSeverityBorderColor = (severity) => {
    if (severity === 'CRITICAL') return 'border-error';
    if (severity === 'HIGH') return 'border-amber-500';
    return 'border-primary';
  };

  const getSeverityBadgeClass = (severity) => {
    if (severity === 'CRITICAL') return 'bg-error-container text-on-error-container';
    if (severity === 'HIGH') return 'bg-amber-100 text-amber-800';
    return 'bg-surface-container-high text-on-surface';
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col selection:bg-secondary-fixed selection:text-primary">
      {/* TopAppBar */}
      <header className="bg-surface sticky top-0 z-50 border-b border-surface-container-high shadow-sm">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-xl py-base max-w-container-max mx-auto">
          <div className="flex items-center gap-sm cursor-pointer" onClick={handleReset}>
            <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>analytics</span>
            <span className="font-headline-md text-headline-md tracking-tighter text-on-surface font-bold">AUDIT•</span>
          </div>
          <nav className="hidden md:flex gap-lg">
            <a 
              className="text-primary font-bold border-b-2 border-primary font-label-md text-label-md transition-colors" 
              href="#"
              onClick={handleReset}
            >
              Home
            </a>
            <a className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md" href="#">Audit</a>
            <a className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md" href="#">AI</a>
          </nav>
          <div className="flex items-center gap-base">
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors" style={{ fontSize: '28px' }}>
              account_circle
            </span>
          </div>
        </div>
      </header>

      {/* Screen 1: Home View */}
      {!loading && !result && (
        <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden w-full">
          {/* Subtle Animated Background Component */}
          <div className="absolute inset-0 z-0 opacity-40 pointer-events-none"></div>

          <div className="relative z-10 w-full max-w-3xl px-margin-mobile text-center">
            {/* Hero Typography */}
            <div className="mb-lg space-y-base animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight font-bold">
                Audit any webpage instantly
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
                Extract factual metrics and get AI-powered insights grounded in real data.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-md bg-error-container/30 border border-error/20 text-on-error-container p-sm rounded-xl max-w-xl mx-auto text-sm">
                <strong>⚠️ Connection Error:</strong> {error}
              </div>
            )}

            {/* Input Container */}
            <div className="mb-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
              <UrlInput onSubmit={handleAuditSubmit} loading={loading} />
              <p className="mt-sm text-caption font-caption text-outline">
                Trusted by 5,000+ technical SEO specialists and web developers.
              </p>
            </div>

            {/* Value Props Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
              <div className="flex flex-col items-center p-md bg-surface-container-low rounded-xl border border-transparent hover:border-primary-container transition-all">
                <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center text-primary mb-sm">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
                </div>
                <span className="font-label-md text-label-md text-primary">📊 Factual Metrics</span>
              </div>
              <div className="flex flex-col items-center p-md bg-surface-container-low rounded-xl border border-transparent hover:border-primary-container transition-all">
                <div className="w-12 h-12 bg-secondary-fixed rounded-full flex items-center justify-center text-secondary mb-sm">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                </div>
                <span className="font-label-md text-label-md text-secondary">🤖 AI Insights</span>
              </div>
              <div className="flex flex-col items-center p-md bg-surface-container-low rounded-xl border border-transparent hover:border-primary-container transition-all">
                <div className="w-12 h-12 bg-tertiary-fixed rounded-full flex items-center justify-center text-tertiary mb-sm">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>rule</span>
                </div>
                <span className="font-label-md text-label-md text-tertiary">📋 Prioritized Recommendations</span>
              </div>
            </div>
          </div>

          {/* Brand logos */}
          <div className="absolute bottom-xl left-1/2 -translate-x-1/2 opacity-20 hidden md:block">
            <div className="flex items-center gap-xl grayscale">
              <img className="h-8 opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkR7Vv42GETMOD5Iz4pTzHz5R-DXZtSoLpaKQP-BLLYdk91hoJTIULPfk2WOVPgrGsbnItfndLQO3mNpVRWaBb1aUyik5bIiOlri4iFKC-PO2oB5HhixPrBMF94weky-4C4cTpyjvN3wY_sbIcEwcLwMVLI5ZlBxTKBtGLFpNyGVoMZ-qZY_1JKijChHJ8OIKJCiK5yQJJ6EbtYE-av_a3WhXYs77V313dNijsm2a10szXvMCIEz9T0gK4I--aNbjNXib2lqVsbuY" alt="logo"/>
              <img className="h-8 opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDthCYgxFCoJmhuo_YjSPEe82Z-8_-LSHrF6ux6KItXPuNEJlGwRaJpZJWg2c03d-GB8GVK1k7XxBHyltOIyRByEcsG0_DqSrMYOK9CysBNhRnmxgMUaUWYVAQWLdvq82hDbobU9LML6DS79piyH7amZ3AMSsSU2RfJQ3ooyje52ePbsY_7hSrHk0URkj0AkYTWul80gIJb4xAb-JehyZJByhgrGmRdDL7cuET0rM_n9EbHsgzM_jIcbIiF4KmlMrvZmCYiBMYyUSM" alt="logo"/>
              <img className="h-8 opacity-50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7DI0Z81xOG4coyTLXPFpJubd_HUqMDfVyf0l9htzRqJebt8GabY2XKGPiI8McliG1xX2xQ76bcQ8doreVMyKCXhuuagIQQh3QKnfHIMPed7FGi_Uh0EOltwJmo_MX6wxwUTZhwCAXGG_Lzt9rqD7IQUIj_5U60KBw5c9ZwUsOzLWHJ-yDLXviegQA46g0Ok0w8pion1f_pHMe6KymMFyZv2co2teDqfxGH7APwRbZrCoACQEHI3yDi95qX4Loy_K5rmke1ihNFzY" alt="logo"/>
            </div>
          </div>
        </main>
      )}

      {/* Screen 2: Loading State View */}
      {loading && (
        <main className="flex-grow flex flex-col items-center justify-center pt-xl px-margin-mobile relative overflow-hidden w-full">
          {/* Background Animation Effect */}
          <div className="max-w-xl w-full z-10 text-center flex flex-col items-center">
            {/* Icon/Visual State Indicator */}
            <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center mb-lg shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-5xl animate-pulse">query_stats</span>
            </div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-md font-bold">
              Analyzing Performance
            </h1>
            
            {/* Custom Loading Indicator Section */}
            <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden mb-base relative">
              <div className="absolute inset-0 bg-primary-container/20"></div>
              <div className="h-full bg-gradient-to-r from-primary-container to-secondary-container w-1/3 animate-[progress-shimmer_1.5s_infinite_linear] rounded-full"></div>
            </div>

            {/* Cycling Text Component */}
            <div className="h-8 overflow-hidden mb-xs">
              <p className="font-label-md text-label-md text-primary-container font-semibold transition-all duration-300">
                {loadingStatus}
              </p>
            </div>

            {/* Target URL */}
            <p className="font-caption text-caption text-outline font-mono opacity-80 break-all">
              {urlInput}
            </p>
          </div>

          {/* Metric Placeholders (Bento Grid Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md w-full max-w-container-max mt-xl opacity-40 grayscale pointer-events-none px-margin-mobile">
            <div className="bg-white/70 backdrop-blur-md border border-surface-variant/50 p-md rounded-xl h-32 flex flex-col justify-between animate-pulse">
              <div className="h-4 w-24 bg-surface-variant rounded"></div>
              <div className="h-8 w-16 bg-surface-variant rounded"></div>
            </div>
            <div className="bg-white/70 backdrop-blur-md border border-surface-variant/50 p-md rounded-xl h-32 flex flex-col justify-between animate-pulse">
              <div className="h-4 w-32 bg-surface-variant rounded"></div>
              <div className="h-8 w-20 bg-surface-variant rounded"></div>
            </div>
            <div className="bg-white/70 backdrop-blur-md border border-surface-variant/50 p-md rounded-xl h-32 flex flex-col justify-between animate-pulse">
              <div className="h-4 w-20 bg-surface-variant rounded"></div>
              <div className="h-8 w-12 bg-surface-variant rounded"></div>
            </div>
          </div>
        </main>
      )}

      {/* Screen 3: Audit Results View */}
      {result && !loading && (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-xl mt-md flex flex-col gap-lg w-full pb-xl">
          {/* Result Header */}
          <section className="flex flex-col gap-sm">
            <div className="flex flex-wrap items-center justify-between gap-sm">
              <div className="flex items-center gap-xs">
                <span className="font-headline-sm-mobile text-headline-sm-mobile font-bold text-on-surface break-all">
                  {urlInput}
                </span>
                <a 
                  href={urlInput.startsWith('http') ? urlInput : `https://${urlInput}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors"
                >
                  open_in_new
                </a>
              </div>
              <button 
                onClick={handleReset}
                className="px-md py-sm border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer"
              >
                Run New Audit
              </button>
            </div>
            <div className="flex items-center gap-sm">
              <span className="bg-secondary-container text-on-secondary-container px-sm py-xs rounded-xl font-label-md text-label-md font-semibold">
                {formatPageType(result.page_type) || "Landing Page"}
              </span>
              <span className="text-on-surface-variant font-caption text-caption">
                Analyzed just now
              </span>
            </div>
          </section>

          {/* Rule Engine flags (if any) */}
          {result.flags && result.flags.length > 0 && (
            <section className="bg-white border border-outline-variant p-md rounded-xl subtle-shadow">
              <div className="flex items-center gap-xs mb-md border-b border-outline-variant/10 pb-sm">
                <span className="material-symbols-outlined text-on-surface" style={{ fontSize: '24px' }}>warning</span>
                <h2 className="font-bold text-lg text-on-surface">Rule Engine Flags</h2>
              </div>
              <div className="space-y-sm">
                {result.flags.map((flag, idx) => {
                  const borderCol = getSeverityBorderColor(flag.severity);
                  const badgeClass = getSeverityBadgeClass(flag.severity);
                  return (
                    <div 
                      key={idx} 
                      className={`bg-surface-container-low border-l-4 ${borderCol} p-sm rounded-r-lg flex flex-col md:flex-row justify-between md:items-center gap-sm`}
                    >
                      <div className="flex items-center gap-sm">
                        <span className={`${badgeClass} px-sm py-xs rounded text-caption font-bold`}>
                          {flag.severity}
                        </span>
                        <span className="font-body-md text-sm md:text-base text-on-surface">
                          {flag.description || flag.issue}
                        </span>
                      </div>
                      <span className="bg-surface-container-lowest text-outline px-sm py-xs rounded text-caption font-mono max-w-max self-start md:self-auto">
                        {flag.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Metrics Panel */}
          <MetricsPanel metrics={result.metrics} />
          
          {/* AI Insights Panel */}
          <InsightsPanel insights={result.insights} />

          {/* Prioritized Recommendations */}
          <RecommendationsPanel recommendations={result.recommendations} />

          {/* Dev Prompt Logs Accordion */}
          <PromptLogViewer promptLogs={result.prompt_logs} />
        </main>
      )}

      {/* BottomNavBar (Mobile only) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile pb-base md:hidden bg-surface shadow-lg border-t border-outline-variant/10">
        <div 
          onClick={handleReset}
          className="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs cursor-pointer"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>home</span>
          <span className="text-caption font-semibold">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-primary px-sm py-xs">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>query_stats</span>
          <span className="text-caption font-semibold">Audit</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant px-sm py-xs">
          <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>auto_awesome</span>
          <span className="text-caption font-semibold">AI</span>
        </div>
      </nav>
    </div>
  );
}
