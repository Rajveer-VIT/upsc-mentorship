'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, ArrowRight } from 'lucide-react';

export const CtaSection = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-background">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="w-full max-w-5xl h-full mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[100px]" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-navy rounded-[3rem] p-10 sm:p-16 lg:p-20 text-center shadow-2xl shadow-navy/20 border border-navy-100 overflow-hidden relative"
        >
          {/* Internal glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-bl-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-tr-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 text-gold mb-8"
          >
            <PhoneCall className="w-8 h-8" />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 tracking-tight">
            Need clarity on your preparation? <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold">
              Talk to an Academic Expert
            </span>
          </h2>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 font-medium">
            Get a personalized roadmap and strategy assessment from our elite mentors who have successfully cleared the examination.
          </p>

          <div className="flex items-center justify-center">
            <motion.button 
              onClick={() => window.dispatchEvent(new Event('openFreeCallModal'))}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-gold text-navy font-bold uppercase tracking-widest flex items-center gap-2 shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:bg-white transition-colors"
            >
              Book a Free Call
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
