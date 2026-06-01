'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface PrimaryButtonProps extends HTMLMotionProps<"button"> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className = '', isLoading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gold px-8 py-4 font-bold uppercase tracking-widest text-navy shadow-lg shadow-gold/20 transition-all hover:bg-gold-light hover:shadow-gold/30 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <span className="absolute left-4">
            <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
        <span className={isLoading ? 'ml-6' : ''}>{children}</span>
      </motion.button>
    );
  }
);
PrimaryButton.displayName = 'PrimaryButton';
