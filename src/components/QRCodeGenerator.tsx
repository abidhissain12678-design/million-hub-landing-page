import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeGeneratorProps {
  taskSlug: string;
  taskTitle: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ taskSlug, taskTitle }) => {
  const taskUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/task/${taskSlug}`;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-lg">
      <h3 className="text-black font-bold mb-4">Task QR Code</h3>
      <QRCodeCanvas value={taskUrl} size={256} level="H" />
      <p className="text-black text-sm mt-4 text-center">{taskTitle}</p>
    </div>
  );
};

export default QRCodeGenerator;