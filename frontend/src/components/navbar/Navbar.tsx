'use client';

import React, { useEffect, useState } from 'react';
import { useNavStore } from '@/store/useNavStore';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/store/useCart';
import { warmUpApi } from '@/lib/api';
import { useUserAuth } from '@/store/useUserAuth';
import { useAdminAuth } from '@/store/useAdminAuth';
import { logoutUser, logoutAdmin } from '@/lib/auth-utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuOpen = useNavStore(state => state.mobileMenuOpen);
  const setMobileMenuOpen = useNavStore(state => state.setMobileMenuOpen);

  const userName = useUserAuth((s) => s.fullName);
  const adminName = useAdminAuth((s) => s.fullName);
  const cartCount = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    warmUpApi(); // wake the API early so login/checkout respond fast
    useUserAuth.getState().getUserAuth();
    useAdminAuth.getState().getAdminAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserLogout = () => {
    logoutUser();
    window.location.href = '/';
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    window.location.href = '/admin-login';
  };

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Mentorship', href: '/#mentorship' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Books', href: '/books' },
    { label: 'Resources', href: '/resources/pyqs' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled ? 'py-3' : 'py-5'
        }`}
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`mx-auto max-w-[1440px] flex items-center justify-between gap-4 rounded-full px-4 sm:px-6 py-3 transition-all duration-500
            ${isScrolled 
              ? 'bg-white/90 backdrop-blur-md border border-gray-200 shadow-sm' 
              : 'bg-white/70 backdrop-blur-sm border border-transparent'}`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden ring-2 ring-gold/30 shadow-md shadow-gold/20 transition-all duration-300 group-hover:ring-gold/70 group-hover:shadow-gold/40 group-hover:scale-105">
              <Image
                src="/images/logo.png"
                alt="UPSC with Eshwar"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="whitespace-nowrap text-xl sm:text-2xl font-serif font-bold text-navy tracking-tight">
              UPSC <span className="font-sans font-light italic text-sm lowercase text-slate-400 mx-1">with</span> <span className="text-gold">Eshwar</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-5 2xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-navy/70 hover:text-navy transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Cart */}
          <Link href="/cart" aria-label="Cart" className="relative ml-auto mr-3 md:mr-0 md:order-last md:ml-4 p-2 rounded-full text-navy hover:bg-slate-100 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-[10px] font-bold text-white flex items-center justify-center">{cartCount}</span>
            )}
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {adminName || userName ? (
              <>
                {/* Compact account chip: icon + first name, never pushes into the links */}
                <Link
                  href={adminName ? '/dashboard/admin' : '/dashboard/orders'}
                  title={adminName ? `Admin: ${adminName}` : `My account: ${userName}`}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-3 text-xs font-semibold text-navy hover:border-gold transition-colors"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-white"><User className="w-3.5 h-3.5" /></span>
                  <span className="max-w-[110px] truncate">{(adminName || userName)!.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={adminName ? handleAdminLogout : handleUserLogout}
                  className="rounded-full bg-navy px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md shadow-navy/20 transition-colors hover:bg-gold whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-widest text-navy/70 hover:text-navy transition-colors whitespace-nowrap"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-navy px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md shadow-navy/20 transition-colors hover:bg-gold whitespace-nowrap"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-navy hover:bg-gray-100 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl p-8 xl:hidden flex flex-col pt-32"
          >
            <nav className="flex flex-col gap-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl font-serif font-bold text-navy hover:text-gold flex items-center justify-between group"
                  >
                    {link.label}
                    <ChevronRight className="w-6 h-6 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-4">
              {adminName ? (
                <>
                  <span className="text-xl font-bold text-navy text-center bg-slate-50 border border-slate-100 py-3 rounded-2xl shadow-sm">
                    Hi, {adminName} (Admin)
                  </span>
                  <button
                    onClick={() => {
                      handleAdminLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-4 rounded-xl bg-navy text-center text-white font-bold uppercase tracking-widest shadow-lg shadow-navy/30 hover:bg-gold transition-colors"
                  >
                    Admin Logout
                  </button>
                </>
              ) : userName ? (
                <>
                  <span className="text-xl font-bold text-navy text-center bg-slate-50 border border-slate-100 py-3 rounded-2xl shadow-sm">
                    Hi, {userName}
                  </span>
                  <button
                    onClick={() => {
                      handleUserLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-4 rounded-xl bg-navy text-center text-white font-bold uppercase tracking-widest shadow-lg shadow-navy/30 hover:bg-gold transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 rounded-xl border-2 border-navy text-center text-navy font-bold uppercase tracking-widest transition-colors hover:bg-navy hover:text-white">
                    Log In
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full py-4 rounded-xl bg-gold text-center text-white font-bold uppercase tracking-widest shadow-lg shadow-gold/30 hover:bg-gold-dark transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
