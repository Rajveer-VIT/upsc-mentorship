'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface GhostButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const GhostButton = React.forwardRef<HTMLButtonElement, GhostButtonProps>(
  ({ className = '', children, disabled, isLoading, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !isLoading ? { scale: 1.02, backgroundColor: 'rgba(201, 168, 76, 0.1)' } : {}}
        whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
        className={`inline-flex items-center justify-center rounded-2xl border-2 border-gold/30 bg-transparent px-8 py-4 font-bold uppercase tracking-widest text-gold transition-all hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
            </svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);
GhostButton.displayName = 'GhostButton';
