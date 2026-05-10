import React from 'react';

interface CTASectionProps {
  ctaText: string;
  ctaLink: string;
}

const CTASection: React.FC<CTASectionProps> = ({ ctaText, ctaLink }) => {
  return (
    <div className="cta-section text-center my-8">
      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
      >
        {ctaText}
      </a>
    </div>
  );
};

export default CTASection;