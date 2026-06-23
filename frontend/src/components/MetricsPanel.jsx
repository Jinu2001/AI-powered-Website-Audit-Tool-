import React from 'react';

export default function MetricsPanel({ metrics }) {
  // Determine color dot for Word Count
  const getWordCountDot = () => {
    if (metrics.word_count < 100) return 'bg-error'; // Red
    if (metrics.word_count < 300) return 'bg-amber-500'; // Amber
    return 'bg-green-500'; // Green
  };

  // Determine color dot for Headings
  const getHeadingsDot = () => {
    if (metrics.h1_count === 0) return 'bg-error';
    if (metrics.h1_count > 1) return 'bg-amber-500';
    return 'bg-green-500';
  };

  // Determine color dot for CTAs
  const getCtaDot = () => {
    if (metrics.cta_count === 0) return 'bg-amber-500';
    return 'bg-green-500';
  };

  // Determine color dot for Image Alt Tags
  const getAltTagsDot = () => {
    if (metrics.images_total === 0) return 'bg-green-500';
    const pct = metrics.images_missing_alt / metrics.images_total;
    if (pct > 0.5) return 'bg-error';
    if (pct > 0.1) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <section className="bg-surface-container-low p-md rounded-xl border border-outline-variant w-full">
      <div className="flex items-center gap-xs mb-md">
        <span className="material-symbols-outlined text-on-surface">list_alt</span>
        <h2 className="font-headline-sm-mobile text-headline-sm-mobile font-bold">Factual Metrics</h2>
      </div>

      {metrics.is_spa && (
        <div className="mb-md bg-error-container/30 border border-error/20 text-on-error-container rounded-lg p-sm text-caption">
          <strong>⚠️ SPA Alert:</strong> Low word count ({metrics.word_count}) detected. Fully client-side rendered page limits static HTML scraper accuracy.
        </div>
      )}

      <div className="grid grid-cols-1 gap-base">
        {/* Word Count */}
        <div className="flex justify-between items-center bg-surface-container-lowest p-sm rounded-lg">
          <span className="text-on-surface-variant font-body-md">Word Count</span>
          <div className="flex items-center gap-sm">
            <span className="font-bold text-on-surface">{metrics.word_count.toLocaleString()}</span>
            <div className={`w-3 h-3 rounded-full ${getWordCountDot()}`}></div>
          </div>
        </div>

        {/* Headings */}
        <div className="flex justify-between items-center bg-surface-container-lowest p-sm rounded-lg">
          <span className="text-on-surface-variant font-body-md">H1 / H2 / H3</span>
          <div className="flex items-center gap-sm">
            <span className="font-bold text-on-surface">
              {metrics.h1_count} / {metrics.h2_count} / {metrics.h3_count}
            </span>
            <div className={`w-3 h-3 rounded-full ${getHeadingsDot()}`}></div>
          </div>
        </div>

        {/* CTA Count */}
        <div className="flex justify-between items-center bg-surface-container-lowest p-sm rounded-lg">
          <span className="text-on-surface-variant font-body-md">CTA Count</span>
          <div className="flex items-center gap-sm">
            <span className="font-bold text-on-surface">{metrics.cta_count}</span>
            <div className={`w-3 h-3 rounded-full ${getCtaDot()}`}></div>
          </div>
        </div>

        {/* Internal Links */}
        <div className="flex justify-between items-center bg-surface-container-lowest p-sm rounded-lg">
          <span className="text-on-surface-variant font-body-md">Internal Links</span>
          <div className="flex items-center gap-sm">
            <span className="font-bold text-on-surface">{metrics.internal_links}</span>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* External Links */}
        <div className="flex justify-between items-center bg-surface-container-lowest p-sm rounded-lg">
          <span className="text-on-surface-variant font-body-md">External Links</span>
          <div className="flex items-center gap-sm">
            <span className="font-bold text-on-surface">{metrics.external_links}</span>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Images Total */}
        <div className="flex justify-between items-center bg-surface-container-lowest p-sm rounded-lg">
          <span className="text-on-surface-variant font-body-md">Images Total</span>
          <div className="flex items-center gap-sm">
            <span className="font-bold text-on-surface">{metrics.images_total}</span>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Missing Alt Text */}
        <div className="flex justify-between items-center bg-surface-container-lowest p-sm rounded-lg">
          <span className="text-on-surface-variant font-body-md">Missing Alt Tags</span>
          <div className="flex items-center gap-sm">
            <span className={`font-bold text-on-surface ${metrics.images_missing_alt > 0 ? 'text-error' : ''}`}>
              {metrics.images_missing_alt}
            </span>
            <div className={`w-3 h-3 rounded-full ${getAltTagsDot()} ${metrics.images_missing_alt > 0 ? 'animate-pulse' : ''}`}></div>
          </div>
        </div>
      </div>
      
      {/* Meta Title and Description (Added below the grid) */}
      <div className="mt-base grid grid-cols-1 gap-base">
        <div className="bg-surface-container-lowest p-sm rounded-lg text-left">
          <span className="text-on-surface-variant text-caption font-label-md uppercase block mb-xs">Meta Title</span>
          <p className="text-body-md text-on-surface leading-tight break-words">
            {metrics.meta_title || <span className="text-error italic">Not set</span>}
          </p>
        </div>
        <div className="bg-surface-container-lowest p-sm rounded-lg text-left">
          <span className="text-on-surface-variant text-caption font-label-md uppercase block mb-xs">Meta Description</span>
          <p className="text-body-md text-on-surface leading-tight line-clamp-4 break-words">
            {metrics.meta_description || <span className="text-error italic">Not set</span>}
          </p>
        </div>
      </div>
    </section>
  );
}
