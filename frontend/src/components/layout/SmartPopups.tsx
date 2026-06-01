'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';

export const SmartPopups = () => {
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Start popup timer directly (no traffic quality gate)
    const popupShown = sessionStorage.getItem('clarityCallPopupShown');
    if (!popupShown) {
      // 8 minutes = 480,000 ms
      const timer = setTimeout(() => {
        setShowCallPopup(true);
      }, 480000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch(`${API_BASE_URL}/mentorship/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Free Call Request',
          email: 'callback@upscwitheshwar.com',
          phone: whatsappNumber,
          stage: 'callback_request',
          goals: 'Requested free 8-min clarity call via popup.'
        })
      });
      alert('Callback requested successfully! Eshwar will reach out on WhatsApp.');
      closeCallPopup();
    } catch (err) {
      console.error(err);
      alert('Callback requested successfully!');
      closeCallPopup();
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeCallPopup = () => {
    setShowCallPopup(false);
    sessionStorage.setItem('clarityCallPopupShown', 'true');
  };

  return (
    <>
      {/* FREE CALL POPUP (8 Mins) */}
      <AnimatePresence>
        {showCallPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm"
              onClick={closeCallPopup}
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="fixed bottom-6 right-6 z-[9999] bg-slate-900 border-2 border-gold rounded-2xl p-6 w-[90%] sm:w-[380px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <button 
                onClick={closeCallPopup}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <span className="bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-gold/20 mb-4 inline-block">
                Strict Initiative
              </span>
              
              <h3 className="text-2xl font-serif text-white font-bold mb-2">Free 8-Min Clarity Call</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Discuss your strategy gaps directly with Eshwar. Strictly restricted to highly serious aspirants only to maintain traffic quality.
              </p>
              
              <form onSubmit={handleCallSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2">
                    WhatsApp Number <span className="text-[#c0392b] ml-1 text-sm font-black">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-gold outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold text-navy font-bold uppercase tracking-widest py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-70"
                >
                  {isSubmitting ? 'Requesting...' : 'Request Callback'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
