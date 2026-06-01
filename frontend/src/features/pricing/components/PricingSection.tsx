'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';

export const PricingSection = () => {
  const tiers = [
    {
      name: 'Study Plan',
      price: '₹299',
      duration: 'one-time',
      description: 'Perfect for building a structured foundation.',
      features: [
        'Curated micro-timetable framework',
        'High-yield booklist checklist',
        'Self-tracking excel template',
      ],
      isPopular: false,
      cta: 'Book Plan Now',
      buttonVariant: 'outline',
    },
    {
      name: 'Single Session',
      price: '₹499',
      duration: 'per session',
      description: 'Resolve specific doubts and strategy blocks.',
      features: [
        '45-minute 1-on-1 strategy call',
        'Immediate query resolution',
        'Actionable diagnostic review',
      ],
      isPopular: false,
      cta: 'Book Session',
      buttonVariant: 'outline',
    },
    {
      name: 'Doubt Clearing',
      price: '₹599',
      duration: '/month',
      description: 'Quick WhatsApp access for daily queries.',
      features: [
        'Direct WhatsApp access to Eshwar',
        'Quick response (< 12 hours)',
        'Strictly strategy and booklet doubts',
      ],
      isPopular: false,
      cta: 'Activate Gateway',
      buttonVariant: 'outline',
    },
    {
      name: 'Monthly 1-on-1',
      price: '₹1,999',
      duration: '/month',
      description: 'Comprehensive guided preparation.',
      features: [
        '4 dedicated 1-on-1 calls per month',
        'Weekly goal tracking and milestones',
        'WhatsApp doubt clearing gateway',
        'Critical answer writing feedback',
      ],
      isPopular: true,
      cta: 'Secure Spot',
      buttonVariant: 'solid',
    },
    {
      name: 'Intensive 1-on-1',
      price: '₹3,999',
      duration: '/month',
      description: 'Daily monitoring for maximum output.',
      features: [
        'Daily monitoring and alignment checks',
        'Unlimited calls on strategy blocks',
        'Priority answer feedback (< 24 hours)',
        'Direct customized test series reviews',
      ],
      isPopular: false,
      cta: 'Apply for Intensive',
      buttonVariant: 'outline',
    },
    {
      name: 'Annual Plan',
      price: '₹17,999',
      duration: '/year',
      description: 'Full year direct private circle pass.',
      features: [
        'Full 12-month direct private circle pass',
        'Customized study calendar for Prelims & Mains',
        'Complete handholding until interview stage',
        'Massive 25% discount',
      ],
      isPopular: false,
      cta: 'Secure Annual Pass',
      buttonVariant: 'outline',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-gold font-black uppercase tracking-[0.2em] text-xs mb-4 block">
            Transparent Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-navy mb-6">
            Strictly Selective Packages.
          </h2>
          <p className="text-lg text-gray-500 font-medium">
            No hidden fees. Exactly what you see is what you get.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-[2.5rem] p-8 sm:p-10 transition-all duration-300 flex flex-col ${
                tier.isPopular 
                  ? 'bg-navy text-white shadow-2xl shadow-navy/20 scale-100 md:scale-105 border-2 border-gold z-10' 
                  : 'bg-white text-navy border border-gray-200 shadow-xl shadow-gray-100 hover:border-gold/50'
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg">
                  <Star className="w-3 h-3 fill-current" />
                  Most Chosen
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-2xl font-serif font-bold mb-2 ${tier.isPopular ? 'text-white' : 'text-navy'}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm ${tier.isPopular ? 'text-gray-300' : 'text-gray-500'}`}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-8">
                <span className={`text-4xl font-bold tracking-tight ${tier.isPopular ? 'text-white' : 'text-navy'}`}>
                  {tier.price}
                </span>
                <span className={`text-sm font-medium ${tier.isPopular ? 'text-gray-400' : 'text-gray-500'}`}>
                  {tier.duration.startsWith('/') ? '' : ' '}{tier.duration}
                </span>
              </div>

              <ul className="space-y-4 mb-10 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className={`w-5 h-5 shrink-0 ${tier.isPopular ? 'text-gold' : 'text-gold'}`} />
                    <span className={tier.isPopular ? 'text-gray-200' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/pricing"
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center ${
                  tier.buttonVariant === 'solid'
                    ? 'bg-gold text-navy hover:bg-white hover:shadow-lg'
                    : 'bg-transparent border-2 border-gray-200 text-navy hover:border-navy hover:bg-navy hover:text-white'
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
