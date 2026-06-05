'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, ArrowLeft, Loader2, CreditCard, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import Link from 'next/link';

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

const plans = [
  {
    id: 'study-plan',
    name: 'Study Plan',
    price: 299,
    duration: 'one-time',
    desc: 'Perfect for building a structured foundation.',
    features: [
      'Curated micro-timetable framework',
      'High-yield booklist checklist',
      'Self-tracking excel template',
    ]
  },
  {
    id: 'single-session',
    name: 'Single Session',
    price: 499,
    duration: 'one-time',
    desc: 'Resolve specific doubts and strategy blocks.',
    features: [
      '45-minute 1-on-1 strategy call',
      'Immediate query resolution',
      'Actionable diagnostic review',
    ]
  },
  {
    id: 'doubt-clearing',
    name: 'Doubt Clearing',
    price: 599,
    duration: 'monthly',
    desc: 'Quick WhatsApp access for daily queries.',
    features: [
      'Direct WhatsApp access to Eshwar',
      'Quick response (< 12 hours)',
      'Strictly strategy and booklet doubts',
    ]
  },
  {
    id: 'monthly-1on1',
    name: 'Monthly 1-on-1',
    price: 1999,
    duration: 'monthly',
    desc: 'Comprehensive guided preparation.',
    features: [
      '4 dedicated 1-on-1 calls per month',
      'Weekly goal tracking and milestones',
      'WhatsApp doubt clearing gateway',
      'Critical answer writing feedback',
    ]
  },
  {
    id: 'intensive-1on1',
    name: 'Intensive 1-on-1',
    price: 3999,
    duration: 'monthly',
    desc: 'Daily monitoring for maximum output.',
    features: [
      'Daily monitoring and alignment checks',
      'Unlimited calls on strategy blocks',
      'Priority answer feedback (< 24 hours)',
      'Direct customized test series reviews',
    ]
  },
  {
    id: 'annual-plan',
    name: 'Annual Plan',
    price: 17999,
    duration: 'yearly',
    desc: 'Full year direct private circle pass.',
    features: [
      'Full 12-month direct private circle pass',
      'Customized study calendar for Prelims & Mains',
      'Complete handholding until interview stage',
      'Massive 25% discount',
    ]
  }
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get('plan');

  const [plan, setPlan] = useState<typeof plans[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // 1. Verify user is logged in
    const token = localStorage.getItem('user_accessToken') || localStorage.getItem('accessToken');
    const storedName = localStorage.getItem('user_fullName') || localStorage.getItem('userName') || '';
    const storedEmail = localStorage.getItem('user_email') || localStorage.getItem('userEmail') || '';

    if (!token) {
      setAuthError('Authentication required. Redirecting to login page...');
      setTimeout(() => {
        router.push(`/login?redirect=/checkout?plan=${planId}`);
      }, 2000);
      setLoading(false);
      return;
    }

    setUserName(storedName);
    setUserEmail(storedEmail);

    // 2. Identify the selected plan
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) {
      setPlan(null);
    } else {
      setPlan(selectedPlan);
    }
    setLoading(false);
  }, [planId]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number for order verification.');
      return;
    }

    setPaymentLoading(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert('Failed to load payment gateway. Please check your network connection.');
      setPaymentLoading(false);
      return;
    }

    const token = localStorage.getItem('user_accessToken') || localStorage.getItem('accessToken');
    try {
      // 1. Call Backend to create order
      const res = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ planId: plan.id })
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Failed to create order.');
      }

      const orderData = result.data;

      // 2. Configure Razorpay overlay options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'UPSC with Eshwar',
        description: `Mentorship: ${plan.name}`,
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
            });

            const verifyResult = await verifyRes.json();
            if (!verifyRes.ok || !verifyResult.success) {
              throw new Error(verifyResult.message || 'Payment signature verification failed.');
            }

            // Store purchased plan in localStorage
            if (plan) {
              localStorage.setItem('user_purchasedPlanId', plan.id);
              localStorage.setItem('user_purchasedPlanName', plan.name);
            }

            // Show success state then redirect to pricing
            setSuccess(true);
            setTimeout(() => {
              router.push('/pricing');
            }, 3000);
          } catch (err: any) {
            alert(`Payment verification failed: ${err.message}`);
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: phone
        },
        notes: {
          planId: plan.id,
          userId: localStorage.getItem('user_id') || localStorage.getItem('userId')
        },
        theme: {
          color: '#C9A84C'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(`An error occurred: ${err.message}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
        <p className="text-navy dark:text-cream/70 text-sm font-semibold tracking-widest uppercase">Initializing Checkout Panel...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy flex flex-col items-center justify-center p-4 text-center">
        <div className="p-4 bg-amber-500/10 text-amber-500 rounded-full mb-6">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">Access Restricted</h3>
        <p className="text-slate-500 dark:text-cream/60 max-w-md text-sm">{authError}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-12 max-w-xl shadow-2xl relative overflow-hidden"
        >
          {/* Confetti dots */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-2 h-2 bg-gold rounded-full animate-ping" />
            <div className="absolute bottom-10 right-10 w-3 h-3 bg-emerald-500 rounded-full animate-bounce" />
            <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
          </div>

          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/10">
            <Check className="w-10 h-10" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold block mb-2">
            Payment Verified
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy dark:text-white mb-4">
            Welcome to the <span className="text-gold italic">Inner Circle</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-cream/70 mb-4 leading-relaxed max-w-md mx-auto">
            Your transaction has completed successfully! Your <strong>{plan?.name}</strong> is now active.
          </p>

          {/* Invoice email notification */}
          <div className="flex items-center justify-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3 mb-6 max-w-sm mx-auto">
            <span className="text-lg">📧</span>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-left">
              Invoice sent to <span className="font-black">{userEmail || 'your email'}</span>
              <span className="block font-normal opacity-70 mt-0.5">Check your inbox for the payment receipt.</span>
            </p>
          </div>

          {/* Redirect notice */}
          <p className="text-[10px] text-slate-400 dark:text-cream/40 uppercase tracking-widest animate-pulse">
            Redirecting to your plans in 3s...
          </p>
        </motion.div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 bg-red-500/10 text-red-500 rounded-full mb-6">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-navy dark:text-white mb-2">Invalid Plan Selection</h3>
        <p className="text-slate-500 dark:text-cream/60 max-w-md text-sm mb-6">
          The selected mentorship subscription does not exist or has been disabled.
        </p>
        <Link href="/pricing" className="px-6 py-3 bg-gold text-white font-bold rounded-full text-xs uppercase tracking-widest hover:bg-gold/80 transition-colors">
          View Pricing Plans
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy text-navy dark:text-white pt-16 pb-20">

      {/* Checkout Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-navy dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-gold" />
            Back to Pricing
          </button>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* COLUMN 1: ORDER SUMMARY (7 columns) */}
          <div className="lg:col-span-7 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-xl">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-1 block">
              Checkout Process
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy dark:text-white mb-6">
              Mentorship <span className="text-gold italic">Order Summary</span>
            </h2>

            {/* Plan Info Card */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 flex items-start justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] bg-gold/15 text-gold font-bold px-2.5 py-0.5 rounded-full border border-gold/25 uppercase tracking-wider mb-2 inline-block">
                  Selected Subscription
                </span>
                <h3 className="text-xl font-bold font-serif text-navy dark:text-white mt-1">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-cream/60 mt-1 max-w-sm">
                  {plan.desc}
                </p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-navy dark:text-white">
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] block opacity-50 uppercase tracking-wider">
                  / {plan.duration}
                </span>
              </div>
            </div>

            {/* Included Features List */}
            <div className="mb-8">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                What is included in this plan:
              </h4>
              <ul className="space-y-4">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="p-0.5 bg-gold/10 text-gold rounded-full mt-0.5 border border-gold/20">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-cream/80">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Total Computation Grid */}
            <div className="border-t border-slate-200 dark:border-white/10 pt-6 space-y-3 font-mono text-xs text-slate-500 dark:text-cream/50">
              <div className="flex justify-between">
                <span>Subtotal Plan Price</span>
                <span className="text-slate-900 dark:text-white">₹{plan.price.toLocaleString('en-IN')}.00</span>
              </div>
              <div className="flex justify-between">
                <span>Access Fees & Taxes (0%)</span>
                <span className="text-slate-900 dark:text-white">₹0.00</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-4 text-sm font-sans font-bold text-navy dark:text-white">
                <span className="flex items-center gap-1.5">
                  Total Order Amount
                  <Sparkles className="w-4 h-4 text-gold animate-pulse" />
                </span>
                <span className="text-2xl font-black text-gold">₹{plan.price.toLocaleString('en-IN')}.00</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: SECURE CHECKOUT PORTAL (5 columns) */}
          <div className="lg:col-span-5 space-y-6">

            {/* Visual Credit Card Mockup */}
            <div className="relative h-56 rounded-[2rem] bg-gradient-to-br from-slate-900 via-navy-dark to-slate-950 p-6 text-white border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-widest uppercase opacity-40">UPSC Mentorship Circle</span>
                  <span className="text-sm font-bold text-gold mt-0.5">PRIORITY MEMBER ACCESS</span>
                </div>
                <div className="w-10 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-serif text-[10px] font-black text-gold shadow-md">
                  UwE
                </div>
              </div>

              <div className="my-auto font-mono text-lg tracking-widest text-slate-200">
                **** **** **** {planId === 'annual-plan' ? '2026' : '1999'}
              </div>

              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black tracking-widest uppercase opacity-40">CARDMEMBER</span>
                  <span className="text-xs font-bold font-sans text-white">{userName || 'Member Aspirant'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[8px] block font-black tracking-widest uppercase opacity-40">EXPIRES</span>
                  <span className="text-xs font-mono text-white">05/30</span>
                </div>
              </div>
            </div>

            {/* Checkout Billing Form */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-4 h-4 text-gold" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-navy dark:text-white">
                  Secure Checkout
                </h3>
              </div>

              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Subscriber Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={userName}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-500 dark:text-cream/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={userEmail}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-500 dark:text-cream/50 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gold mb-1">
                    Mobile Number (Required for Payment)
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 focus:border-gold rounded-xl px-4 py-2.5 text-xs text-navy dark:text-white outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full mt-4 py-4.5 bg-navy dark:bg-gold text-white dark:text-navy hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg shadow-gold/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initiating Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Pay ₹{plan.price.toLocaleString('en-IN')} safely</span>
                    </>
                  )}
                </button>
              </form>

              {/* Secure payment logos / footer info */}
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[9px] text-slate-400 font-mono tracking-wider">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  SSL SECURE 256-BIT
                </span>
                <span>POWERED BY RAZORPAY</span>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-navy flex flex-col items-center justify-center p-4">
          <Loader2 className="w-12 h-12 text-gold animate-spin mb-4" />
          <p className="text-navy dark:text-cream/70 text-sm font-semibold tracking-widest uppercase">
            Loading Checkout...
          </p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}