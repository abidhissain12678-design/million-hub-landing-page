import React from 'react';

interface VideoGuideProps {
  youtubeUrl: string;
}

const VideoGuide: React.FC<VideoGuideProps> = ({ youtubeUrl }) => {
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="video-guide my-8">
      <h2 className="text-2xl font-bold mb-4 text-white">Video Guide</h2>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={getYouTubeEmbedUrl(youtubeUrl)}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          allowFullScreen
          title="YouTube Video Guide"
        />
      </div>
    </div>
  );
};

export default VideoGuide;