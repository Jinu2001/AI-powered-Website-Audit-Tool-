import React from 'react';

export default function InsightsPanel({ insights }) {
  if (!insights) return null;

  const sections = [
    {
      key: 'seo_structure',
      label: 'SEO Structure',
      icon: 'query_stats',
      content: insights.seo_structure
    },
    {
      key: 'messaging_clarity',
      label: 'Messaging Clarity',
      icon: 'chat_bubble_outline',
      content: insights.messaging_clarity
    },
    {
      key: 'cta_usage',
      label: 'CTA Usage',
      icon: 'touch_app',
      content: insights.cta_usage
    },
    {
      key: 'content_depth',
      label: 'Content Depth',
      icon: 'article',
      content: insights.content_depth
    },
    {
      key: 'ux_concerns',
      label: 'UX Concerns',
      icon: 'warning',
      content: insights.ux_concerns,
      isError: true
    }
  ];

  return (
    <section className="flex flex-col gap-md w-full">
      <div className="flex items-center gap-xs">
        <span className="material-symbols-outlined text-primary">auto_awesome</span>
        <h2 className="font-headline-sm-mobile text-headline-sm-mobile font-bold">AI Insights</h2>
      </div>

      <div className="space-y-sm">
        {sections.map((section, idx) => (
          <details 
            key={section.key} 
            className="group bg-white border border-outline-variant rounded-xl overflow-hidden subtle-shadow"
            defaultOpen={idx === 0}
          >
            <summary className="flex justify-between items-center p-md cursor-pointer hover:bg-surface-container-low transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-container">
              <div className="flex items-center gap-base">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${section.isError ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                  <span className="material-symbols-outlined">{section.icon}</span>
                </div>
                <span className={`font-label-md text-label-md ${section.isError ? 'text-error font-semibold' : 'text-on-surface'}`}>
                  {section.label}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline-variant group-open:rotate-180 transition-transform duration-300">
                expand_more
              </span>
            </summary>
            <div className="p-md bg-surface-container-lowest text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/30 text-left">
              {section.content || 'Analyzing...'}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
