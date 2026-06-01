'use client';

import React from 'react';

export const FooterBottom = () => {
  return (
    <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-gray-500 text-sm font-medium">
        © {new Date().getFullYear()} UPSC with Eshwar. All Rights Reserved.
      </p>
      <div className="flex items-center gap-6">
        <span className="text-gray-500 text-sm font-medium">Designed for Excellence</span>
        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
        <span className="text-gray-500 text-sm font-medium">Made in India</span>
      </div>
    </div>
  );
};
