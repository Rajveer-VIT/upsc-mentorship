'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import Link from 'next/link';
import { PLANS, formatINR } from '@/lib/plans';

export const PricingSection = () => {
  const tiers = PLANS.map((p) => ({
    id: p.id,
    name: p.name,
    price: formatINR(p.price),
    duration: p.duration === 'monthly' ? '/ month' : 'one-time',
    description: p.desc,
    features: p.features.slice(0, 5),
    isPopular: !!p.popular,
    cta: 'Choose Plan',
    buttonVariant: p.popular ? 'solid' : 'outline',
  }));

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden" id="pricing">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative rounded-[2rem] p-7 sm:p-8 transition-all duration-300 flex flex-col ${
                tier.isPopular 
                  ? 'bg-navy text-white shadow-2xl shadow-navy/20 lg:scale-[1.03] border-2 border-gold z-10' 
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
                href={`/checkout?plan=${tier.id}`}
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
