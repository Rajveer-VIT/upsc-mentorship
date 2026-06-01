'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Zap, Shield, HelpCircle, ArrowRight, Minus, ChevronRight, ArrowLeft } from 'lucide-react';
import { PrimaryButton, GhostButton, Heading } from '@/components/ui';
import FreeCallModal from '@/features/home/components/FreeCallModal';
import { Navbar } from '@/components/navbar/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);
  const router = useRouter();

  const handlePurchasePlan = async (planId: string) => {
    const token = localStorage.getItem('user_accessToken') || localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in or sign up to purchase a mentorship plan.');
      router.push(`/login?redirect=/checkout?plan=${planId}`);
      return;
    }
    router.push(`/checkout?plan=${planId}`);
  };

  const plans = [
    {
      id: 'study-plan',
      name: 'Study Plan',
      price: '299',
      duration: 'one-time',
      desc: 'Perfect for building a structured foundation.',
      features: [
        'Curated micro-timetable framework',
        'High-yield booklist checklist',
        'Self-tracking excel template',
      ],
      icon: <Zap className="w-6 h-6" />,
      color: 'gold',
      popular: false
    },
    {
      id: 'single-session',
      name: 'Single Session',
      price: '499',
      duration: 'per session',
      desc: 'Resolve specific doubts and strategy blocks.',
      features: [
        '45-minute 1-on-1 strategy call',
        'Immediate query resolution',
        'Actionable diagnostic review',
      ],
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'gold',
      popular: false
    },
    {
      id: 'doubt-clearing',
      name: 'Doubt Clearing',
      price: '599',
      duration: '/ month',
      desc: 'Quick WhatsApp access for daily queries.',
      features: [
        'Direct WhatsApp access to Eshwar',
        'Quick response (< 12 hours)',
        'Strictly strategy and booklet doubts',
      ],
      icon: <Shield className="w-6 h-6" />,
      color: 'gold',
      popular: false
    },
    {
      id: 'monthly-1on1',
      name: 'Monthly 1-on-1',
      price: '1,999',
      duration: '/ month',
      desc: 'Comprehensive guided preparation.',
      features: [
        '4 dedicated 1-on-1 calls per month',
        'Weekly goal tracking and milestones',
        'WhatsApp doubt clearing gateway',
        'Critical answer writing feedback',
      ],
      icon: <Star className="w-6 h-6" />,
      color: 'gold',
      popular: true
    },
    {
      id: 'intensive-1on1',
      name: 'Intensive 1-on-1',
      price: '3,999',
      duration: '/ month',
      desc: 'Daily monitoring for maximum output.',
      features: [
        'Daily monitoring and alignment checks',
        'Unlimited calls on strategy blocks',
        'Priority answer feedback (< 24 hours)',
        'Direct customized test series reviews',
      ],
      icon: <Zap className="w-6 h-6" />,
      color: 'gold',
      popular: false
    },
    {
      id: 'annual-plan',
      name: 'Annual Plan',
      price: '17,999',
      duration: '/ year',
      desc: 'Full year direct private circle pass.',
      features: [
        'Full 12-month direct private circle pass',
        'Customized study calendar for Prelims & Mains',
        'Complete handholding until interview stage',
        'Massive 25% discount',
      ],
      icon: <Shield className="w-6 h-6" />,
      color: 'gold',
      popular: false
    }
  ];

  const comparison = [
    { feature: 'Daily Practice Questions', foundation: true, elite: true, pro: true },
    { feature: 'Personalized Mentor', foundation: false, elite: true, pro: true },
    { feature: '1-on-1 Strategy Calls', foundation: false, elite: '2/Month', pro: 'Unlimited' },
    { feature: 'Answer Evaluation', foundation: '5/Month', elite: 'Unlimited', pro: 'Unlimited' },
    { feature: 'Interview Guidance', foundation: false, elite: true, pro: true },
    { feature: 'Smart Analytics', foundation: 'Basic', elite: 'Advanced', pro: 'Predictive' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white dark:bg-navy text-navy dark:text-white pt-32 pb-20 overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-navy/60 hover:text-navy transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-navy/40">
              <Link href="/" className="hover:text-gold transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-navy">Pricing</span>
            </div>
          </div>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-4 block">Transparent Pricing</span>
            <Heading level={1} className="text-5xl md:text-7xl mb-6">
              Invest in your <span className="text-gold italic">Legacy.</span>
            </Heading>
            <p className="text-xl text-slate-500 dark:text-cream/60 font-light">
              Premium mentorship shouldn't be a mystery. Choose a plan that 
              accelerates your journey to the LBSNAA.
            </p>
          </motion.div>

          {/* Toggle */}
          <div className="mt-12 flex items-center justify-center gap-4">
             <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-navy dark:text-white' : 'text-slate-400'}`}>Monthly</span>
             <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-16 h-8 bg-slate-200 dark:bg-white/10 rounded-full p-1 transition-colors"
             >
               <motion.div 
                animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                className="w-6 h-6 bg-gold rounded-full shadow-lg" 
               />
             </button>
             <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-navy dark:text-white' : 'text-slate-400'}`}>Yearly</span>
                <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Save 20%</span>
             </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative group rounded-[3rem] p-10 transition-all duration-500 hover:-translate-y-2
                ${plan.popular 
                  ? 'bg-navy-dark border-2 border-gold shadow-[0_30px_60px_rgba(201,168,76,0.15)] text-white' 
                  : 'bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-gold/30'}`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-navy shadow-xl">
                  Most Popular
                </div>
              )}

              <div className="mb-10 flex justify-between items-start">
                <div className={`p-4 rounded-2xl ${plan.popular ? 'bg-gold/10 text-gold' : 'bg-navy/5 dark:bg-white/5 text-gold'}`}>
                   {plan.icon}
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold uppercase tracking-tighter">{plan.name}</h3>
                  <p className={`text-xs mt-1 ${plan.popular ? 'text-cream/50' : 'text-slate-500'}`}>{plan.desc}</p>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold opacity-50">₹</span>
                  <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                  <span className="text-sm font-medium opacity-50">/ month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-xs text-emerald-500 font-bold mt-2">Billed annually (₹{parseInt(plan.price.replace(',','')) * 12})</p>
                )}
              </div>

              <ul className="space-y-5 mb-12">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.popular ? 'bg-gold/20 text-gold' : 'bg-navy/10 dark:bg-white/10 text-gold'}`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className={`text-sm ${plan.popular ? 'text-cream/80' : 'text-slate-600 dark:text-cream/70'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <PrimaryButton 
                  onClick={() => handlePurchasePlan(plan.id)}
                  disabled={paymentLoading !== null}
                  className={`w-full py-5 text-sm group ${!plan.popular && 'bg-navy dark:bg-white text-white dark:text-navy hover:bg-navy-dark dark:hover:bg-cream'}`}
                >
                   {paymentLoading === plan.id ? 'Connecting...' : plan.popular ? 'Claim Your Rank' : 'Get Started'}
                   <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </PrimaryButton>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="bg-gold rounded-[3rem] p-12 md:p-20 text-navy relative overflow-hidden group"
        >
           <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="max-w-xl">
                 <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">Still confused about <br /> the right choice?</h2>
                 <p className="text-lg font-medium opacity-80">Book a free 15-minute diagnostic call with an ex-IAS mentor to find your perfect path.</p>
              </div>
                <button onClick={() => window.dispatchEvent(new Event('openFreeCallModal'))} className="whitespace-nowrap px-10 py-5 bg-navy text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-navy-dark transition-all shadow-2xl">
                  Book a Free Call
                </button>
           </div>
        </motion.div>
      </div>
    </div>
        <FreeCallModal />
      </>
  );
};

export default PricingPage;

// Mount modal for this page so 'Book Consultation' opens it
// (FreeCallModal uses localStorage-based rate limiting)


