'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Lock, MapPin } from 'lucide-react';
import { api, ApiError, warmUpApi } from '@/lib/api';
import { loadRazorpay, openRazorpay, RazorpayResponse } from '@/lib/razorpay';
import { useCart, cartTotals, deliveryBy } from '@/store/useCart';
import { PriceSummary } from '@/features/books/components/PriceSummary';

const STATES = ['Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

type Address = { name: string; phone: string; line1: string; line2: string; city: string; state: string; pincode: string };
const EMPTY: Address = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };
type Step = 1 | 2 | 3;

interface CreateOrderResult {
  orderId: string; orderNumber: string; razorpayOrderId: string; amount: number; currency: string;
  keyId: string; userName: string; userEmail: string; userPhone: string;
}

const inputCls = (err?: string) =>
  `w-full rounded-lg border bg-white px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-gold ${err ? 'border-red-400' : 'border-slate-200'}`;

function validate(a: Address) {
  const e: Partial<Record<keyof Address, string>> = {};
  if (a.name.trim().length < 3) e.name = 'Enter full name';
  if (!/^[6-9]\d{9}$/.test(a.phone.trim())) e.phone = 'Enter valid 10-digit mobile';
  if (!/^\d{6}$/.test(a.pincode.trim())) e.pincode = 'Enter 6-digit pincode';
  if (a.line1.trim().length < 5) e.line1 = 'Enter house no, building, street';
  if (!a.city.trim()) e.city = 'Enter city';
  if (!a.state) e.state = 'Select state';
  return e;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [addr, setAddr] = useState<Address>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
  const [step, setStep] = useState<Step>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    warmUpApi();
    if (!localStorage.getItem('user_accessToken')) { router.replace('/login?redirect=/cart/checkout'); return; }
    api<{ email: string; address: Address }>('/orders/last-address', { auth: 'user' })
      .then((d) => {
        setEmail(d.email);
        const a = { ...EMPTY, ...Object.fromEntries(Object.entries(d.address).map(([k, v]) => [k, v ?? ''])) } as Address;
        setAddr(a);
        if (Object.keys(validate(a)).length === 0) setStep(2); // saved address is complete → skip ahead
      })
      .catch((e) => { if (e instanceof ApiError && e.status === 401) router.replace('/login?redirect=/cart/checkout'); });
  }, [router]);

  const t = cartTotals(lines);

  // Auto-fill city/state from pincode (India Post public API); silent on failure.
  const onPincode = async (pin: string) => {
    setAddr((a) => ({ ...a, pincode: pin }));
    if (!/^\d{6}$/.test(pin)) return;
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      const po = data?.[0]?.PostOffice?.[0];
      if (po) setAddr((a) => ({ ...a, city: a.city || po.District, state: STATES.find((s) => s.toLowerCase() === String(po.State).toLowerCase()) ?? a.state }));
    } catch { /* ignore */ }
  };

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(addr);
    setErrors(v);
    if (Object.keys(v).length === 0) setStep(2);
  };

  const pay = async () => {
    setError(null);
    setBusy(true);
    try {
      const [ok, order] = await Promise.all([
        loadRazorpay(),
        api<CreateOrderResult>('/orders', {
          method: 'POST', auth: 'user',
          body: JSON.stringify({ items: lines.map((l) => ({ bookId: l.bookId, quantity: l.quantity })), address: addr }),
        }),
      ]);
      if (!ok) throw new Error('Could not load the payment window. Check your internet connection.');

      openRazorpay({
        key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.razorpayOrderId,
        name: 'UPSC with Eshwar', description: `Order ${order.orderNumber}`,
        prefill: { name: order.userName, email: order.userEmail, contact: order.userPhone },
        notes: { orderNumber: order.orderNumber },
        theme: { color: '#C9A84C' },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (r: RazorpayResponse) => {
          try {
            await api('/orders/verify', {
              method: 'POST', auth: 'user',
              body: JSON.stringify({ razorpayOrderId: r.razorpay_order_id, razorpayPaymentId: r.razorpay_payment_id, razorpaySignature: r.razorpay_signature }),
            });
            clear();
            router.replace(`/dashboard/orders/${order.orderId}?placed=1`);
          } catch (e) {
            setError(`${(e as Error).message} If money was debited, it will be refunded automatically.`);
            setBusy(false);
          }
        },
      });
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) return router.replace('/login?redirect=/cart/checkout');
      setError((e as Error).message);
      setBusy(false);
    }
  };

  if (!mounted) return <div className="min-h-screen pt-32" />;
  if (lines.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center px-4">
        <p className="text-slate-600">Your cart is empty.</p>
        <Link href="/books" className="mt-4 inline-block text-gold font-semibold underline">Browse books</Link>
      </div>
    );
  }

  const StepHeader = ({ n, title, done, summary, onChange }: { n: Step; title: string; done: boolean; summary?: React.ReactNode; onChange?: () => void }) => (
    <div className={`flex items-start gap-3 px-4 sm:px-6 py-4 ${step === n ? 'bg-navy text-white' : 'bg-white'}`}>
      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${step === n ? 'bg-white text-navy' : done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
        {done && step !== n ? <Check className="w-4 h-4" /> : n}
      </span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold uppercase tracking-wider ${step === n ? 'text-white' : 'text-slate-500'}`}>{title}</p>
        {step !== n && summary && <div className="mt-1 text-sm text-slate-700">{summary}</div>}
      </div>
      {step !== n && done && onChange && (
        <button onClick={onChange} className="shrink-0 rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold text-navy hover:border-gold">CHANGE</button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-3 min-w-0">
          {/* 0. Account */}
          <div className="rounded-2xl border border-slate-200 bg-white px-4 sm:px-6 py-4 flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-100 text-emerald-700"><Check className="w-4 h-4" /></span>
            <div className="min-w-0"><p className="text-sm font-bold uppercase tracking-wider text-slate-500">Login</p><p className="text-sm truncate">{email || '…'}</p></div>
          </div>

          {/* 1. Address */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <StepHeader n={1} title="Delivery address" done={step > 1} onChange={() => setStep(1)}
              summary={<><b>{addr.name}</b>, {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - <b>{addr.pincode}</b> · {addr.phone}</>} />
            {step === 1 && (
              <form onSubmit={saveAddress} noValidate className="bg-white p-4 sm:p-6 grid sm:grid-cols-2 gap-3">
                {([
                  ['name', 'Full name', 'name', ''],
                  ['phone', '10-digit mobile number', 'tel-national', ''],
                  ['pincode', 'Pincode', 'postal-code', ''],
                  ['city', 'City / District / Town', 'address-level2', ''],
                  ['line1', 'House no., Building, Street, Area', 'address-line1', 'sm:col-span-2'],
                  ['line2', 'Landmark (optional)', 'address-line2', 'sm:col-span-2'],
                ] as [keyof Address, string, string, string][]).map(([k, label, ac, span]) => (
                  <label key={k} className={`block ${span}`}>
                    <input
                      placeholder={label} autoComplete={ac} value={addr[k]}
                      inputMode={k === 'phone' || k === 'pincode' ? 'numeric' : undefined}
                      maxLength={k === 'phone' ? 10 : k === 'pincode' ? 6 : 200}
                      onChange={(e) => (k === 'pincode' ? onPincode(e.target.value.replace(/\D/g, '')) : setAddr({ ...addr, [k]: k === 'phone' ? e.target.value.replace(/\D/g, '') : e.target.value }))}
                      className={inputCls(errors[k])}
                    />
                    {errors[k] && <span className="text-xs text-red-500">{errors[k]}</span>}
                  </label>
                ))}
                <label className="block">
                  <select value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} className={inputCls(errors.state)}>
                    <option value="">Select state</option>{STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
                </label>
                <button type="submit" className="sm:col-span-2 mt-2 rounded-xl bg-gold py-3 font-bold text-white hover:bg-gold-dark inline-flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" /> Deliver here
                </button>
              </form>
            )}
          </div>

          {/* 2. Review */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <StepHeader n={2} title="Order summary" done={step > 2} onChange={() => setStep(2)} summary={`${t.count} item${t.count > 1 ? 's' : ''} · Delivery by ${deliveryBy()}`} />
            {step === 2 && (
              <div className="bg-white p-4 sm:p-6">
                <ul className="divide-y divide-slate-100">
                  {lines.map((l) => (
                    <li key={l.bookId} className="flex gap-4 py-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={l.imageUrl} alt="" className="h-20 w-14 object-contain bg-slate-50 rounded shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">{l.title}</p>
                        <p className="text-xs text-slate-500 mt-1">Qty {l.quantity} · Delivery by {deliveryBy()}</p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">₹{(l.price * l.quantity).toLocaleString('en-IN')}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <Link href="/cart" className="text-sm text-navy underline">Edit cart</Link>
                  <button onClick={() => setStep(3)} className="rounded-xl bg-gold px-8 py-3 font-bold text-white hover:bg-gold-dark">Continue</button>
                </div>
              </div>
            )}
          </div>

          {/* 3. Payment */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <StepHeader n={3} title="Payment" done={false} />
            {step === 3 && (
              <div className="bg-white p-4 sm:p-6">
                <p className="text-sm text-slate-600">Pay securely using UPI, Cards, Net Banking or Wallets via Razorpay.</p>
                {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
                <button onClick={pay} disabled={busy} className="mt-4 w-full sm:w-auto rounded-xl bg-gold px-10 py-3.5 font-bold text-white hover:bg-gold-dark disabled:opacity-60 inline-flex items-center justify-center gap-2">
                  {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : <><Lock className="w-4 h-4" /> Pay ₹{t.total.toLocaleString('en-IN')}</>}
                </button>
                <p className="mt-3 text-xs text-slate-500">By placing this order you agree to our terms. A GST invoice is generated immediately after payment.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 h-fit"><PriceSummary lines={lines} /></aside>
      </div>
    </div>
  );
}
