'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Target,
  BookOpen,
  PenTool,
  CheckCircle,
  MessageCircle,
  CalendarCheck,
} from 'lucide-react';

const BentoCard = ({
  title,
  desc,
  icon,
  className = "",
  delay = 0,
  image,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 transition-all hover:border-gold/50 hover:shadow-2xl dark:border-slate-800 dark:bg-navy-dark ${className}`}
  >
    {image && (
      <>
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60" />
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
      </>
    )}
    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

    <div className="relative z-10">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold transition-transform group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mb-2 text-xl font-bold text-navy dark:text-white">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {desc}
      </p>
    </div>
  </motion.div>
);

export const FeaturesSection = () => {
  return (
    <section
      id="mentorship"
      className="bg-cream py-24 sm:py-32 dark:bg-navy overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="font-serif text-5xl font-bold text-navy dark:text-white sm:text-6xl lg:text-7xl leading-tight">
              Everything You Need For
              <br />
              <span className="text-gold">
                Focused UPSC Preparation
              </span>
            </h2>

            <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 font-light">
              Personal mentorship, proven strategies, and structured guidance
              designed to help serious aspirants prepare with clarity,
              consistency, and confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:block"
          >
            <div className="flex items-center gap-4 text-navy dark:text-white font-bold">
              <div className="h-1 w-20 bg-gold" />
              WHAT YOU GET
            </div>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <BentoCard
            title="1-on-1 Private Mentorship"
            desc="Direct strategy sessions with Eshwar tailored to your preparation stage, strengths, weaknesses, and goals."
            icon={<ShieldCheck className="w-6 h-6" />}
            className="md:col-span-3 md:row-span-2"
            image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
          />

          <BentoCard
            title="Personalized Study Plans"
            desc="Custom study roadmaps built around your work schedule, college commitments, and UPSC targets."
            icon={<Target className="w-6 h-6" />}
            className="md:col-span-3"
            image="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80"
            delay={0.1}
          />

          <BentoCard
            title="PYQ Framework"
            desc="Master UPSC patterns through structured analysis of Previous Year Questions."
            icon={<BookOpen className="w-6 h-6" />}
            className="md:col-span-3 lg:col-span-2"
            delay={0.2}
          />

          <BentoCard
            title="Sociology Optional Guidance"
            desc="Concept clarity, answer-writing structure, and strategic preparation support."
            icon={<PenTool className="w-6 h-6" />}
            className="md:col-span-3 lg:col-span-1"
            delay={0.3}
          />
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <BentoCard
            title="Answer Writing Feedback"
            desc="Detailed evaluation with practical improvements to enhance answer quality and scoring potential."
            icon={<CheckCircle className="w-6 h-6" />}
            delay={0.4}
          />

          <BentoCard
            title="WhatsApp Doubt Support"
            desc="Quick guidance and doubt resolution whenever you feel stuck in your preparation."
            icon={<MessageCircle className="w-6 h-6" />}
            delay={0.5}
          />

          <BentoCard
            title="Accountability & Progress Tracking"
            desc="Regular reviews, milestone checks, and preparation monitoring to keep you consistent."
            icon={<CalendarCheck className="w-6 h-6" />}
            className="md:col-span-2"
            delay={0.6}
          />
        </div>
      </div>
    </section>
  );
};