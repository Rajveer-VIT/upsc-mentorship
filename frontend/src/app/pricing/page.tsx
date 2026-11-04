'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heading } from '@/components/ui';
import FreeCallModal from '@/features/home/components/FreeCallModal';
import { Navbar } from '@/components/navbar/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const PricingPage = () => {
  const [purchasedPlanId, setPurchasedPlanId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user_purchasedPlanId');
    if (stored) setPurchasedPlanId(stored);
  }, []);

  const handlePurchasePlan = async (planId: string) => {
    const token = localStorage.getItem('user_accessToken') || localStorage.getItem('accessToken');
    if (!token) {
      alert('Please log in or sign up to purchase a mentorship plan.');
      router.push(`/login?redirect=/checkout?plan=${planId}`);
      return;
    }
    router.push(`/checkout?plan=${planId}`);
  };

  const blueprints = [
    {
      id: 'prelims-blueprint',
      name: 'Prelims Blueprint',
      price: '299',
      billing: 'one time',
      type: 'ONE TIME',
      desc: 'Build a strong foundation. Stop guessing where to start.',
      features: [
        '12-month study roadmap',
        'Subject-wise booklist',
        'PYQ analysis framework',
        'Revision tracker system',
        'Daily & weekly planner',
        'What to skip — clearly listed',
      ],
      icon: '📚',
      callout: 'Perfect for beginners and self-study aspirants.',
      buttonText: 'Get Started'
    },
    {
      id: 'mains-blueprint',
      name: 'Mains Mastery Blueprint',
      price: '499',
      billing: 'one time',
      type: 'ONE TIME',
      desc: 'Learn the art of writing marks-winning answers.',
      features: [
        'GS Paper strategy (GS1–GS4)',
        'Essay writing framework',
        'Answer writing structure',
        'Value addition techniques',
        'Mains revision system',
        'Common mistakes to avoid',
      ],
      icon: '📱',
      callout: 'Perfect for aspirants preparing for Mains.',
      buttonText: 'Access Blueprint'
    },
    {
      id: 'current-affairs',
      name: 'Current Affairs Decoded',
      price: '399',
      billing: '/month',
      type: 'MONTHLY',
      desc: 'Stop reading everything. Study only what matters.',
      features: [
        'Weekly current affairs — filtered',
        'Prelims + Mains integration',
        'Editorial simplification',
        'Important schemes & reports',
        'Monthly revision magazine',
        'What\'s irrelevant — clearly flagged',
      ],
      icon: '📰',
      callout: 'Perfect for working professionals and repeat aspirants.',
      buttonText: 'Join Club'
    }
  ];

  const sociology = {
    id: 'sociology-circle',
    name: 'Sociology Mentorship Circle',
    price: '2,999',
    billing: '/month',
    desc: 'Sociology feels like memorising a dictionary — until you understand the patterns. This circle changes everything. Small group. Deep guidance. Real results.',
    features: [
      'Sociology answer writing guidance',
      'Weekly mentorship call',
      'Thinker–theory–example framework',
      'PYQ Sociology trend discussions',
      'Paper 1 & Paper 2 strategy',
      'Current affairs to Sociology linking',
      'Monthly progress check',
      'WhatsApp doubt support Mon–Sat',
      'Answer review — 2 per week',
      'Group discussion sessions',
    ],
    icon: '🎯',
    limit: 'Limited to 20 students only',
    callout: 'Perfect for Sociology optional students who want to make it their strongest subject — not their biggest risk.',
    buttonText: 'Join the Circle'
  };

  const premiumMentorship = [
    {
      id: 'personal-mentorship',
      name: 'Personal UPSC Mentorship',
      price: '4,999',
      billing: '/month',
      type: 'PERSONAL MENTORSHIP',
      desc: 'Structured, personal, honest. Built around your schedule, your stage, your weaknesses.',
      features: [
        '2 x 1-on-1 calls per month (45 min each)',
        'Personalised monthly roadmap',
        'Weekly targets & accountability',
        'WhatsApp support Mon–Sat',
        'Monthly review & progress report',
        'Daily Activity Tracker',
        'PYQ discussion & mock analysis',
        'Current affairs direction',
        'Honest feedback — no sugarcoating',
      ],
      icon: '⭐',
      limit: 'Limited to 12 students only',
      callout: 'Perfect for serious aspirants who want one trusted mentor through the entire UPSC journey.',
      buttonText: 'Apply for a Seat',
      popular: true
    },
    {
      id: 'intensive-mentorship',
      name: 'Intensive UPSC Mentorship',
      price: '9,999',
      billing: '/month',
      type: 'INTENSIVE MENTORSHIP',
      desc: 'For the all-in aspirant. Weekly calls, daily accountability, priority everything. Only 3 seats ever.',
      features: [
        '4 x weekly 1-on-1 calls (45 min each)',
        'Daily accountability check-in',
        'Priority WhatsApp — response within 2 hrs',
        'Customised system — built only for you',
        'Weekly progress report',
        'Full Prelims + Mains roadmap',
        'Answer writing & essay direction',
        'Mock test analysis every week',
        'Exam day strategy session',
      ],
      icon: '🔥',
      limit: 'Only 3 students at any time',
      callout: 'Perfect for aspirants who are fully committed and want Eshwar\'s complete attention on their preparation.',
      buttonText: 'Apply for a Seat',
      popular: false
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#FAF6F0] dark:bg-[#060B13] text-[#0A1128] dark:text-white pt-32 pb-20 overflow-hidden transition-colors duration-300">
        {/* Background Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
           <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C9A84C]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
           <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C9A84C]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs & Navigation */}
          <div className="flex items-center justify-between mb-12">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#0A1128]/60 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
            
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#0A1128]/40 dark:text-white/40">
              <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#0A1128] dark:text-white">Pricing</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A84C] mb-4 block">Transparent Pricing</span>
              <Heading level={1} className="text-5xl md:text-7xl mb-6">
                Invest in your <span className="text-[#C9A84C] italic font-serif">Legacy.</span>
              </Heading>
              <p className="text-xl text-slate-500 dark:text-slate-400 font-light">
                Premium mentorship shouldn't be a mystery. Choose a plan that 
                accelerates your journey to the LBSNAA.
              </p>
            </motion.div>
          </div>

          {/* SECTION 1: Blueprint & Club Light Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {blueprints.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative bg-[#FFFDF9] dark:bg-[#0F1622] border border-[#EAE2D5] dark:border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-[0_4px_24px_rgba(201,168,76,0.04)] hover:shadow-[0_12px_40px_rgba(201,168,76,0.08)] hover:-translate-y-1 transition-all duration-300`}
              >
                {purchasedPlanId === plan.id && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-md flex items-center gap-1.5 z-20">
                    <span>✓</span> Plan Active
                  </div>
                )}

                <div>
                  {/* Icon */}
                  <div className="text-3xl mb-4 bg-[#FAF6F0] dark:bg-[#1C2635] w-14 h-14 rounded-2xl flex items-center justify-center border border-[#EAE2D5]/30 dark:border-white/5">
                    {plan.icon}
                  </div>

                  {/* Plan Type */}
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A84C] mb-2 block">
                    {plan.type}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-2xl font-bold text-[#0A1128] dark:text-white mb-2 leading-tight">
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-light mb-6 leading-relaxed">
                    {plan.desc}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 mb-6">
                    <span className="font-serif text-xl font-bold text-[#0A1128] dark:text-white">₹</span>
                    <span className="font-serif text-5xl font-extrabold text-[#0A1128] dark:text-white tracking-tight">{plan.price}</span>
                    <span className="text-xs text-slate-400 font-medium mb-1 ml-1">{plan.billing}</span>
                  </div>

                  {/* Features List */}
                  <ul className="divide-y divide-[#F0ECE3] dark:divide-white/5 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 py-3">
                        <span className="text-[#C9A84C] font-semibold text-sm select-none">✓</span>
                        <span className="text-xs text-[#0A1128]/85 dark:text-slate-300 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Callout Box & Button */}
                <div className="mt-auto space-y-6">
                  <div className="border-l-2 border-[#C9A84C] bg-[#FAF6F0] dark:bg-[#151D2A] p-4 rounded-r-2xl">
                    <p className="text-[11px] italic text-[#6B5A43] dark:text-slate-300 leading-relaxed font-semibold">
                      ✨ {plan.callout}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePurchasePlan(plan.id)}
                    disabled={purchasedPlanId === plan.id}
                    className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 
                      ${purchasedPlanId === plan.id
                        ? 'bg-emerald-600/10 border border-emerald-600/30 text-emerald-600 cursor-default'
                        : 'bg-[#EAE2D5] hover:bg-[#DED5C6] dark:bg-[#1D2736] dark:hover:bg-[#253245] text-[#0A1128] dark:text-white'
                      }`}
                  >
                    {purchasedPlanId === plan.id ? 'Purchased Plan' : `${plan.buttonText} →`}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* SECTION 2: Sociology Mentorship Circle (Forest Green Full Width) */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-[#0D2E27] dark:bg-[#071F1B] border border-[#C9A84C]/40 rounded-[2.5rem] p-8 md:p-12 shadow-[0_12px_48px_rgba(13,46,39,0.15)] overflow-hidden"
            >
              {purchasedPlanId === sociology.id && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-md flex items-center gap-1.5 z-20">
                  <span>✓</span> Plan Active
                </div>
              )}

              {/* Decorative corner highlights */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/5 rounded-full blur-[80px] pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch relative z-10">
                
                {/* Left Side: Plan Info */}
                <div className="flex flex-col justify-between">
                  <div>
                    {/* Badge */}
                    <div className="flex items-center gap-1 bg-[#D4AF37] text-[#0A1128] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full w-fit mb-6 shadow-sm">
                      ★ MOST POWERFUL PLAN
                    </div>

                    {/* Icon */}
                    <div className="text-4xl mb-4 select-none">
                      {sociology.icon}
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                      {sociology.name}
                    </h3>

                    {/* Desc */}
                    <p className="text-sm text-slate-300 font-light mb-8 leading-relaxed max-w-lg">
                      {sociology.desc}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Price and limits */}
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif text-xl font-bold text-white">₹</span>
                        <span className="font-serif text-5xl font-extrabold text-white tracking-tight">{sociology.price}</span>
                        <span className="text-xs text-slate-300 font-medium ml-1">{sociology.billing}</span>
                      </div>
                      <p className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1.5 mt-2">
                        <span>🔒</span> {sociology.limit}
                      </p>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => handlePurchasePlan(sociology.id)}
                      disabled={purchasedPlanId === sociology.id}
                      className={`px-8 py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 w-full sm:w-fit
                        ${purchasedPlanId === sociology.id
                          ? 'bg-emerald-600/10 border border-emerald-600/30 text-emerald-400 cursor-default'
                          : 'bg-[#D4AF37] hover:bg-[#C9A84C] text-[#0D2E27] font-extrabold shadow-lg shadow-[#D4AF37]/10'
                        }`}
                    >
                      {purchasedPlanId === sociology.id ? 'Purchased Plan' : `${sociology.buttonText} →`}
                    </button>
                  </div>
                </div>

                {/* Right Side: Features */}
                <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-10">
                  <div>
                    <h4 className="text-[10px] text-[#D4AF37] font-black tracking-[0.2em] uppercase mb-4">
                      WHAT'S INCLUDED EVERY MONTH
                    </h4>
                    <ul className="divide-y divide-white/10 mb-8">
                      {sociology.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 py-3">
                          <span className="text-[#D4AF37] font-semibold text-sm select-none">✓</span>
                          <span className="text-xs text-slate-200 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-l-2 border-[#D4AF37] bg-white/5 p-4 rounded-r-2xl">
                    <p className="text-xs italic text-slate-300 leading-relaxed font-semibold">
                      ✨ {sociology.callout}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

          {/* SECTION 3: Premium UPSC Mentorship Cards (Dark Theme) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            {premiumMentorship.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative bg-[#0F192A] border border-[#C9A84C]/25 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between shadow-[0_12px_40px_rgba(15,25,42,0.2)] overflow-hidden"
              >
                {purchasedPlanId === plan.id && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-md flex items-center gap-1.5 z-20">
                    <span>✓</span> Plan Active
                  </div>
                )}

                {/* Popular Corner sash */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 overflow-hidden w-24 h-24 pointer-events-none">
                    <div className="bg-[#D4AF37] text-[#0A1128] text-[8px] font-black uppercase tracking-widest text-center py-1 absolute top-4 -right-8 w-28 rotate-45 shadow-sm">
                      POPULAR
                    </div>
                  </div>
                )}

                <div>
                  {/* Icon */}
                  <div className="text-3xl mb-4 bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5">
                    {plan.icon}
                  </div>

                  {/* Plan Type */}
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A84C] mb-2 block">
                    {plan.type}
                  </span>

                  {/* Title */}
                  <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                    {plan.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-400 font-light mb-6 leading-relaxed">
                    {plan.desc}
                  </p>

                  {/* Price and Limit */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-xl font-bold text-white">₹</span>
                      <span className="font-serif text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
                      <span className="text-xs text-slate-400 font-medium ml-1">{plan.billing}</span>
                    </div>
                    <p className="text-[11px] text-[#C9A84C] font-semibold flex items-center gap-1.5 mt-2">
                      <span>🔒</span> {plan.limit}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="divide-y divide-white/5 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 py-3">
                        <span className="text-[#C9A84C] font-semibold text-sm select-none">✓</span>
                        <span className="text-xs text-slate-300 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Callout Box & Button */}
                <div className="mt-auto space-y-6">
                  <div className="border-l-2 border-[#C9A84C] bg-white/5 p-4 rounded-r-2xl">
                    <p className="text-xs italic text-slate-300 leading-relaxed font-semibold">
                      ✨ {plan.callout}
                    </p>
                  </div>

                  <button
                    onClick={() => handlePurchasePlan(plan.id)}
                    disabled={purchasedPlanId === plan.id}
                    className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200
                      ${purchasedPlanId === plan.id
                        ? 'bg-emerald-600/10 border border-emerald-600/30 text-emerald-400 cursor-default'
                        : 'bg-[#D4AF37] hover:bg-[#C9A84C] text-[#0A1128] font-extrabold'
                      }`}
                  >
                    {purchasedPlanId === plan.id ? 'Purchased Plan' : `${plan.buttonText} →`}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-[#C9A84C] rounded-[3rem] p-12 md:p-20 text-[#0A1128] relative overflow-hidden group"
          >
             <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-xl">
                   <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">Still confused about <br /> the right choice?</h2>
                   <p className="text-lg font-medium opacity-80">Book a free 15-minute diagnostic call with your UPSC mentor to find your perfect path.</p>
                </div>
                  <button onClick={() => window.dispatchEvent(new Event('openFreeCallModal'))} className="whitespace-nowrap px-10 py-5 bg-[#0A1128] text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-[#0A1128]/95 transition-all shadow-2xl">
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
