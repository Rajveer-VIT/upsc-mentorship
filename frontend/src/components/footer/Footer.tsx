'use client';

import React from 'react';
import Image from 'next/image';
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
              {/* Logo image with gold ring */}
              <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden ring-2 ring-gold/40 shadow-lg shadow-gold/20 transition-all duration-300 group-hover:ring-gold/70 group-hover:shadow-gold/40">
                <Image
                  src="/images/logo.png"
                  alt="UPSC with Eshwar"
                  fill
                  className="object-cover"
                />
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
