import React from 'react';

export default function RecommendationsPanel({ recommendations }) {
  if (!recommendations || !recommendations.length) return null;

  // Sort recommendations by priority (ascending, so Priority 1 is first)
  const sortedRecs = [...recommendations].sort((a, b) => a.priority - b.priority);

  const getPriorityColorClasses = (priority) => {
    if (priority === 1) return { border: 'border-error', badge: 'bg-error-container text-on-error-container' };
    if (priority === 2) return { border: 'border-amber-500', badge: 'bg-amber-100 text-amber-800' };
    return { border: 'border-primary', badge: 'bg-primary-fixed text-on-primary-fixed' };
  };

  // Mock effort tags just for design richness if the AI model doesn't output it
  const getEffortTag = (priority) => {
    if (priority === 1) return { text: 'Low Effort', classes: 'bg-green-100 text-green-800' };
    if (priority === 2) return { text: 'Medium Effort', classes: 'bg-amber-100 text-amber-800' };
    return { text: 'High Effort', classes: 'bg-red-100 text-red-800' };
  };

  return (
    <section className="flex flex-col gap-md">
      <div className="flex items-center gap-xs">
        <span className="material-symbols-outlined text-tertiary">rule</span>
        <h2 className="font-headline-sm-mobile text-headline-sm-mobile font-bold">Prioritized Recommendations</h2>
      </div>

      <div className="space-y-sm">
        {sortedRecs.map((rec, index) => {
          const { border } = getPriorityColorClasses(rec.priority);
          const effort = getEffortTag(rec.priority);
          
          let priorityBadgeClass = 'bg-primary text-on-primary';
          if (rec.priority === 1) priorityBadgeClass = 'bg-error text-on-error';
          else if (rec.priority === 2) priorityBadgeClass = 'bg-amber-500 text-on-primary'; // Adjust as needed
          
          return (
            <div 
              key={index} 
              className={`bg-surface-container-low border-l-4 ${border} p-md rounded-r-xl relative overflow-hidden subtle-shadow group hover:-translate-y-1 transition-transform duration-300 text-left`}
            >
              <div className={`absolute top-0 right-0 ${priorityBadgeClass} px-sm py-xs rounded-bl-lg font-label-md text-caption font-bold`}>
                Priority {rec.priority}
              </div>
              <h3 className="font-bold text-lg text-on-surface mb-xs pr-xl">{rec.action}</h3>
              <p className="text-on-surface-variant font-body-md leading-relaxed mb-sm">
                {rec.reason}
              </p>
              
              <div className="flex items-center gap-sm flex-wrap">
                {rec.metric && (
                  <span className="bg-surface-container-lowest text-outline px-sm py-xs rounded text-caption font-mono">
                    Source: {rec.metric}
                  </span>
                )}
                <span className={`${effort.classes} px-sm py-xs rounded text-caption font-semibold`}>
                  {effort.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
