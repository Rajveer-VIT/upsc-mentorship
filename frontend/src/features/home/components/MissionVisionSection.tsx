'use client';

import React from 'react';
import { motion } from 'framer-motion';

const MissionCard = ({ title, subtitle, description, tagline, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ 
      y: -12,
      transition: { duration: 0.3 }
    }}
    className="group relative overflow-hidden rounded-lg border border-gold/40 bg-gradient-to-br from-navy-dark/80 to-navy/80 backdrop-blur-sm p-8 transition-all duration-300 hover:border-gold/70"
  >
    {/* Animated glow */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    />

    <div className="relative z-10">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.1 }}
        className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-3"
      >
        {tagline}
      </motion.p>

      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
        className="text-2xl font-bold text-white mb-1 drop-shadow-lg"
      >
        {title}
      </motion.h3>

      <motion.h4 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.25 }}
        className="text-lg font-bold text-white mb-4 drop-shadow-md"
      >
        {subtitle}
      </motion.h4>
      
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: delay + 0.3 }}
        className="text-white/90 leading-relaxed text-base font-medium drop-shadow-sm"
      >
        {description}
      </motion.p>

      {/* Bottom line animation */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-gold via-gold to-transparent"
        initial={{ width: 0 }}
        whileInView={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.3 }}
      />
    </div>
  </motion.div>
);

export const MissionVisionSection = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-navy-dark via-navy to-navy-dark overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-40 w-80 h-80 bg-gold/5 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-gold uppercase tracking-[0.3em] font-semibold text-xs mb-6"
          >
            PRIVATE UPSC MENTORSHIP
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold text-gold mb-8"
          >
            UPSC with Eshwar
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl sm:text-3xl italic text-white font-semibold drop-shadow-md"
          >
            "Clarity Over Confusion. Strategy Over Struggle."
          </motion.p>

          {/* Decorative line */}
          <motion.div
            className="mt-8 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: '100%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <MissionCard
            tagline="OUR MISSION"
            title="Empower every"
            subtitle="serious aspirant"
            description="Empower every serious aspirant with a clear path to civil services"
            delay={0}
          />
          <MissionCard
            tagline="OUR VISION"
            title="No aspirant"
            subtitle="should lose years"
            description="No aspirant should lose years to wrong strategy or lack of guidance"
            delay={0.15}
          />
          <MissionCard
            tagline="OUR PROMISE"
            title="Personalised."
            subtitle="Honest. Real."
            description="Personalised. Honest. Real mentorship — not a factory approach"
            delay={0.3}
          />
        </div>

        {/* Promise Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gold/20 pt-16"
        >
          <motion.div 
            className="text-center md:text-left"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h4 
              className="text-xl font-bold text-yellow-300 mb-2 drop-shadow-md"
              animate={{ letterSpacing: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              No Shortcuts
            </motion.h4>
            <p className="text-white/90 font-medium drop-shadow-sm">Just the honest path forward</p>
          </motion.div>

          <motion.div 
            className="text-center"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h4 
              className="text-xl font-bold text-yellow-300 mb-2 drop-shadow-md"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              No Noise
            </motion.h4>
            <p className="text-white/90 font-medium drop-shadow-sm">Just what truly matters</p>
          </motion.div>

          <motion.div 
            className="text-center md:text-right"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.h4 
              className="text-xl font-bold text-yellow-300 mb-2 drop-shadow-md"
              animate={{ color: ['#FCD34D', '#FBBF24', '#FCD34D'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Just Clarity
            </motion.h4>
            <p className="text-white/90 font-medium drop-shadow-sm">Every step of your journey</p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 pt-16 border-t border-gold/20"
        >
          <p className="text-white/80 font-serif text-lg font-semibold drop-shadow-sm">upscwitheshwar.com</p>
        </motion.div>
      </div>
    </section>
  );
};
