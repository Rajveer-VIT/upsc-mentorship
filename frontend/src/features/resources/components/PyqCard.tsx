'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface PyqCardProps {
  id?: string;
  year?: number;
  subject?: string;
  examType?: string;
  paperCode?: string;
  title: string;
  file: string;
}

export const PyqCard: React.FC<PyqCardProps> = ({
  title,
  file,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h3 className="text-lg font-bold text-navy mb-3">
            {title}
          </h3>

          <p className="text-sm text-gray-500">
            Download PDF Resource
          </p>
        </div>

        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center justify-center gap-2 bg-gold text-white font-semibold py-3 rounded-xl hover:opacity-90 transition"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </a>
      </div>
    </div>
  );
};