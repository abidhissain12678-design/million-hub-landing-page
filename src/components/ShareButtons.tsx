import React from 'react';

interface ShareButtonsProps {
  taskTitle: string;
  taskSlug: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ taskTitle, taskSlug }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://millionhub.com';
  const taskUrl = `${baseUrl}/task/${taskSlug}`;
  const encodedUrl = encodeURIComponent(taskUrl);
  const encodedTitle = encodeURIComponent(taskTitle);

  return (
    <div className="flex gap-4 justify-center my-6">
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Telegram
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-sky-400 text-white rounded-lg hover:bg-sky-500 transition-colors"
      >
        Twitter
      </a>
    </div>
  );
};

export default ShareButtons;