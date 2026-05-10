import React from 'react';

interface StickyAdProps {
  adUrl?: string;
  position: 'left' | 'right';
}

const StickyAd: React.FC<StickyAdProps> = ({ adUrl, position }) => {
  if (!adUrl) return null;

  const positionClasses = position === 'left'
    ? 'fixed left-4 top-1/2 transform -translate-y-1/2 z-50'
    : 'fixed right-4 top-1/2 transform -translate-y-1/2 z-50';

  return (
    <div className={`sticky-ad ${positionClasses} w-32 h-64`}>
      <iframe
        src={adUrl}
        className="w-full h-full border-0"
        title={`Sticky Ad ${position}`}
      />
    </div>
  );
};

export default StickyAd;