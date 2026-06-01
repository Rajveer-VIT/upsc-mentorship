'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Compass, Eye, ShieldCheck, Target, Users, BookOpen, MessageSquare, Briefcase } from 'lucide-react';
import { Heading } from '@/components/ui';

export const PlatformDescriptionSection = () => {
  const whoItIsFor = [
    {
      title: 'Corporate Professionals',
      desc: 'Preparing alongside a career; requires maximum output in minimal time.',
      icon: <Briefcase className="w-5 h-5 text-gold" />,
    },
    {
      title: 'Fresh Graduates',
      desc: 'Starting the UPSC journey with ambition, needing the correct roadmap.',
      icon: <Users className="w-5 h-5 text-gold" />,
    },
    {
      title: 'Aspirants Stuck in Loops',
      desc: 'Stuck despite months of preparation, needing diagnostic reviews.',
      icon: <Target className="w-5 h-5 text-gold" />,
    },
    {
      title: 'Sociology Optional Students',
      desc: 'Aspirants seeking deep-dive conceptual clarity and structural guidance.',
      icon: <BookOpen className="w-5 h-5 text-gold" />,
    },
  ];

  const whatYouGet = [
    '1-on-1 private strategy sessions with Eshwar',
    'Personalised study plans built around your lifestyle',
    'Prelims diagnostic reviews and GS roadmaps',
    'Sociology optional conceptual deep-dives',
    'Current affairs framework — what to read and skip',
    'Critical answer writing evaluation & feedback',
    'WhatsApp private gateway for daily doubt clearing',
    'Mindset, consistency, and accountability checks',
  ];

  return (
    <section className="py-24 bg-[#FAF8F3] text-[#0F172A] relative overflow-hidden">
      {/* Background Patriotic Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Saffron Glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[130px]" />
        {/* Green Glow */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-3 block">
              Platform Dossier
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl mb-6 font-black text-green-500" style={{ color: '#22C55E' }}>
              UPSC with Eshwar
            </h2>
            <p className="text-lg text-slate-600 dark:text-cream/85 font-light leading-relaxed">
              A private mentorship platform built for serious UPSC aspirants—especially working 
              professionals and corporate individuals who prepare alongside their careers and need 
              <span className="text-gold font-semibold"> clarity, not noise.</span>
            </p>
          </motion.div>
        </div>

        {/* Grid 1: Mission & The Human Truth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm relative overflow-hidden group hover:border-gold/30 transition-colors"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full" />
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#1F7B34]/15 rounded-full blur-[100px] pointer-events-none" />
            <Compass className="w-10 h-10 text-amber-600 mb-6" />
            <h3 className="text-2xl font-serif font-bold text-[#22C55E] dark:text-[#22C55E] mb-4">Our Mission</h3>
            <p className="text-slate-800 dark:text-cream/90 font-medium leading-relaxed mb-6">
              Most aspirants don't fail because they lack intelligence. They fail because they lack the 
              right guidance at the right time. 
            </p>
            <p className="text-slate-800 dark:text-cream/90 font-medium leading-relaxed">
              We believe <span className="text-amber-700 dark:text-gold font-bold">one honest conversation</span> can save an aspirant two years of wasted effort. That's why this platform exists—to give you direct, personalised strategy that actually moves the needle.
            </p>
          </motion.div>

          {/* The Human Truth Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0F172A] text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border border-[#D4A017]/20 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1F7B34]/20 rounded-bl-full -z-10" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4A017] dark:text-[#1FD34E] mb-4 block">The Human Truth</span>
              <p className="text-xl sm:text-2xl font-serif font-bold leading-relaxed italic text-white dark:text-white mb-6">
                "Somewhere between your job, your family, your self-doubt, and your massive syllabus—UPSC preparation gets overwhelming. You don't need more content. You need someone who has been exactly where you are to look at your prep and say: Here is what is wrong, and here is how to fix it."
              </p>
            </div>
            <p className="text-xl sm:text-2xl font-serif font-bold leading-relaxed italic text-white/95 mb-6">
              — Private Mentorship Circle
            </p>
          </motion.div>
        </div>

        {/* Grid 2: Who It Is For & What You Get */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-stretch">
          {/* Who is it for */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-serif font-bold mb-6 text-[#22C55E] dark:text-[#22C55E]">Who is it for?</h3>
              <div className="space-y-6">
                {whoItIsFor.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="p-2.5 bg-amber-100 dark:bg-white/5 rounded-xl mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#22C55E] dark:text-[#22C55E] text-base">{item.title}</h4>
                      <p className="text-sm text-slate-700 dark:text-cream/80 mt-1 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* What you get */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-10 shadow-sm flex flex-col justify-between"
          >
            <div>
              <h3 className="text-2xl font-serif font-bold mb-6 text-[#22C55E] dark:text-[#22C55E]">What you get</h3>
              <ul className="space-y-4">
                {whatYouGet.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="p-0.5 bg-[#1F7B34]/10 dark:bg-[#1F7B34]/20 rounded-full mt-1">
                      <Check className="w-4 h-4 text-[#1F7B34] dark:text-[#1FD34E]" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-cream/80 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1F7B34] dark:text-[#1FD34E]" />
              <span className="text-xs text-[#1F7B34] dark:text-[#1FD34E] font-bold uppercase tracking-wider">No generic classes — 100% Personalised</span>
            </div>
          </motion.div>
        </div>

        {/* Grid 3: Why Different? */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-[2.5rem] p-10 sm:p-12 shadow-sm mb-20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full" />
          <h3 className="text-3xl font-serif font-bold mb-6 text-[#22C55E] dark:text-[#22C55E]">Why UPSC with Eshwar is Different?</h3>
          <p className="text-slate-800 dark:text-cream/90 font-medium leading-relaxed mb-8 max-w-4xl">
            This isn’t a coaching factory. There are no batch lectures, no 200-student classrooms, and no one-size-fits-all templates. Every student gets direct access to Eshwar—a mentor who spent 4 years inside the UPSC journey, worked as a Business Analyst, studied International Affairs, and built a 17,000+ community on LinkedIn.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 bg-amber-50 dark:bg-white/5 rounded-2xl border border-amber-200 dark:border-white/5">
              <h4 className="font-bold text-amber-900 dark:text-gold mb-2">Private & Personalised</h4>
              <p className="text-sm text-amber-900 dark:text-cream/85 leading-relaxed font-medium">Custom guidance tailored strictly to your lifecycle and study speed.</p>
            </div>
            <div className="p-6 bg-amber-50 dark:bg-white/5 rounded-2xl border border-amber-200 dark:border-white/5">
              <h4 className="font-bold text-amber-900 dark:text-gold mb-2">Corporate Friendly</h4>
              <p className="text-sm text-amber-900 dark:text-cream/85 leading-relaxed font-medium">Schedules engineered around busy office rosters and project milestones.</p>
            </div>
            <div className="p-6 bg-amber-50 dark:bg-white/5 rounded-2xl border border-amber-200 dark:border-white/5">
              <h4 className="font-bold text-amber-900 dark:text-gold mb-2">Honest Counsel</h4>
              <p className="text-sm text-amber-900 dark:text-cream/85 leading-relaxed font-medium">No false guarantees, no fake shortcuts. Only strategy that works.</p>
            </div>
            <div className="p-6 bg-amber-50 dark:bg-white/5 rounded-2xl border border-amber-200 dark:border-white/5">
              <h4 className="font-bold text-amber-900 dark:text-gold mb-2">Highly Affordable</h4>
              <p className="text-sm text-amber-900 dark:text-cream/85 leading-relaxed font-medium">Available at a fraction of the costs charged by massive coaching conglomerates.</p>
            </div>
            <div className="p-6 bg-amber-50 dark:bg-white/5 rounded-2xl border border-amber-200 dark:border-white/5">
              <h4 className="font-bold text-amber-900 dark:text-gold mb-2">Instant Accessibility</h4>
              <p className="text-sm text-amber-900 dark:text-cream/85 leading-relaxed font-medium">Direct WhatsApp gateway support for daily syllabus and strategy roadblocks.</p>
            </div>
            <div className="p-6 bg-amber-50 dark:bg-white/5 rounded-2xl border border-amber-200 dark:border-white/5">
              <h4 className="font-bold text-amber-900 dark:text-gold mb-2">Real Experience</h4>
              <p className="text-sm text-amber-900 dark:text-cream/85 leading-relaxed font-medium">Guidance built on raw experience, failures, and structural diagnostic realities.</p>
            </div>
          </div>
        </motion.div>

        {/* Future Vision & Tagline Callout */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gold text-navy rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden group shadow-xl"
        >
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-90 mb-3 block">Future Vision</span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-navy-dark">To become India's most trusted private UPSC mentorship platform.</h3>
            <p className="text-base font-semibold mb-8 leading-relaxed text-slate-950">
              Helping thousands of working professionals and serious aspirants secure clarity and strategy without spending lakhs on institutes that don't know their names.
            </p>
            
            {/* Tagline Callout */}
            <div className="inline-block px-8 py-4 bg-navy text-white rounded-full font-black uppercase tracking-widest text-xs sm:text-sm shadow-2xl transition-transform hover:scale-105 duration-300">
              Private Mentorship. Real Clarity. Your UPSC Journey Starts Here.
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
