'use client';

import React from 'react';
import { Twitter, Send, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export const FooterSocials = () => {
  const socials = [
    { icon: <Send className="w-5 h-5" />, href: 'https://t.me/upscwitheshwar', label: 'Telegram' },
    { icon: <Instagram className="w-5 h-5" />, href: 'https://www.instagram.com/upsc_with_eshwar?igsh=ejRzemJ2ZHRxMzhq', label: 'Instagram' },
    { icon: <Twitter className="w-5 h-5" />, href: 'https://x.com/upscwithEshwar', label: 'Twitter' },
  ];

  return (
    <div className="flex items-center gap-4">
      {socials.map((social) => (
        <motion.a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold/50 hover:bg-gold/10 transition-colors"
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
};
