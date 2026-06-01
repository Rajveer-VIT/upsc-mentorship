'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, className = '' }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white/50 p-6 backdrop-blur-md shadow-lg transition-all hover:bg-white/80 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 ${className}`}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-500">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </motion.div>
  );
};
