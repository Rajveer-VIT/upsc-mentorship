// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\frontend\src\components\layout\sidebar\Sidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, Shield } from 'lucide-react';
import { logoutUser } from '@/lib/auth-utils';

export const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Admin Panel', href: '/dashboard/admin', icon: <Shield className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-navy text-white w-64 border-r border-slate-800">
      <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-gold/30 flex items-center justify-center font-serif text-sm font-black shadow-md shadow-gold/20">
            <span className="text-[#FF9933]">U</span>
            <span className="text-white">w</span>
            <span className="text-[#138808]">E</span>
          </div>
          <span className="text-xl font-serif font-bold text-white tracking-tight">
            UPSC <span className="text-gold">with Eshwar</span>
          </span>
        </div>
        <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-1 space-y-2 px-4 py-6 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              <div className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                isActive ? 'bg-gold/10 text-gold font-medium' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-navy border-b border-slate-800 z-40 flex items-center px-4">
        <button onClick={() => setIsOpen(true)} className="text-white p-2">
          <Menu className="w-6 h-6" />
        </button>
        <div className="ml-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-gold/30 flex items-center justify-center font-serif text-sm font-black shadow-md shadow-gold/20">
            <span className="text-[#FF9933]">U</span>
            <span className="text-white">w</span>
            <span className="text-[#138808]">E</span>
          </div>
          <span className="text-lg font-serif font-bold text-white tracking-tight">
            UPSC <span className="text-gold">with Eshwar</span>
          </span>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="md:hidden fixed inset-y-0 left-0 z-50 shadow-2xl"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
