'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const TrustedBySection = () => {
  const logos = [
    { name: 'Elite Cohort', label: 'Great' },
    { name: '4+ year of experience', label: 'Mentors' },
    { name: 'Community', label: '17000+ linkedin' },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy mb-2">
            Trusted by <span className="text-gold">Aspirants</span> 
          </h2>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">
            Join the most exclusive UPSC preparation ecosystem
          </p>
        </motion.div>

        <div className="relative">
          {/* Fading edges for infinite scroll effect */}
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

          {/* Scrolling Container */}
          <div className="flex justify-center items-center gap-8 sm:gap-16 flex-wrap">
            {logos.map((logo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center py-4 px-6 rounded-2xl bg-gray-50/50 border border-gray-100 min-w-[160px] hover:bg-gold/5 hover:border-gold/30 transition-all cursor-default group"
              >
                <span className="text-2xl font-black text-navy group-hover:text-gold transition-colors mb-1">
                  {logo.label.split(' ')[0]}
                </span>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider group-hover:text-navy transition-colors">
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
