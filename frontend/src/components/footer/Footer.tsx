'use client';

import React from 'react';
import { FooterLinks } from './FooterLinks';
import { FooterSocials } from './FooterSocials';
import { FooterBottom } from './FooterBottom';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer className="bg-[#0B1426] relative overflow-hidden pt-24 pb-8 border-t border-white/5">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
          
          {/* Brand & CTA */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center gap-3 mb-6 group cursor-default">
              {/* Premium circular tricolor logo — footer variant */}
              <div className="relative h-12 w-12 shrink-0">
                {/* Outer gradient ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF9933] via-white to-[#138808] p-[2.5px] shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-all duration-300">
                  <div className="w-full h-full rounded-full bg-[#060e1f] flex items-center justify-center">
                    <span className="font-serif font-black text-base leading-none tracking-tight">
                      <span className="text-[#FF9933]">U</span>
                      <span className="text-white">W</span>
                      <span className="text-[#138808]">E</span>
                    </span>
                  </div>
                </div>
                {/* Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF9933]/15 to-[#138808]/15 blur-md opacity-60 -z-10" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                UPSC <span className="font-sans font-light italic text-sm lowercase text-slate-400 mx-1">with</span> <span className="text-gold">Eshwar</span>
              </span>
            </div>
            
            <p className="text-gray-400 font-medium leading-relaxed mb-8 max-w-sm">
              India's most exclusive UPSC mentorship ecosystem. We transform serious aspirants into top rankers through data-driven strategies and elite guidance.
            </p>

            <FooterSocials />
          </div>

          {/* Links Section */}
          <div className="lg:col-span-7">
            <FooterLinks />
          </div>
          
        </div>

        <FooterBottom />
      </div>
    </footer>
  );
};
