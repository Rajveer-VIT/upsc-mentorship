'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
      className={`rounded-2xl border border-slate-200 bg-slate-100 p-6 dark:border-slate-800 dark:bg-slate-800/50 ${className}`}
    >
      <div className="mb-4 h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-700"></div>
      <div className="mb-3 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
      <div className="mt-2 h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-700"></div>
    </motion.div>
  );
};
