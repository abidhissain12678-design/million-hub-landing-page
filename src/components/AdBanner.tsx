import React from 'react';

interface AdBannerProps {
  adUrl?: string;
  position: 'top' | 'middle' | 'bottom';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ adUrl, position, className = '' }) => {
  if (!adUrl) return null;

  const positionClasses = {
    top: 'w-full h-24 mb-4',
    middle: 'w-full h-32 my-8',
    bottom: 'w-full h-24 mt-8'
  };

  return (
    <div className={`ad-banner ${positionClasses[position]} ${className}`}>
      <iframe
        src={adUrl}
        className="w-full h-full border-0"
        title={`Ad ${position}`}
      />
    </div>
  );
};

export default AdBanner;