'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, ShieldCheck, Trash2, Truck } from 'lucide-react';
import { warmUpApi } from '@/lib/api';
import { useCart, cartTotals, deliveryBy, FREE_SHIPPING_ABOVE } from '@/store/useCart';
import { useUserAuth } from '@/store/useUserAuth';
import { PriceSummary } from '@/features/books/components/PriceSummary';

export default function CartPage() {
  const router = useRouter();
  const { lines, setQty, remove } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); warmUpApi(); useUserAuth.getState().getUserAuth(); }, []);

  const t = cartTotals(lines);
  const proceed = () => {
    const loggedIn = !!localStorage.getItem('user_accessToken');
    router.push(loggedIn ? '/cart/checkout' : '/login?redirect=/cart/checkout');
  };

  if (!mounted) return <div className="min-h-screen pt-32" />;

  if (lines.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 text-center px-4">
        <h1 className="text-2xl font-bold text-navy">Your cart is empty</h1>
        <p className="text-slate-500 mt-2">Add the books you need for your preparation.</p>
        <Link href="/books" className="mt-6 inline-block rounded-xl bg-navy px-6 py-3 text-white font-semibold hover:bg-gold">Browse books</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-32 pb-28 lg:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-6 lg:gap-8">
        <section className="lg:col-span-2 min-w-0 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 h-fit">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
            <h1 className="text-xl font-bold text-navy">Shopping Cart ({t.count})</h1>
            <p className="text-sm text-slate-600 flex items-center gap-1"><Truck className="w-4 h-4 text-gold" /> Delivery by <b>{deliveryBy()}</b></p>
          </div>
          {t.shipping > 0 && (
            <p className="mb-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">Add items worth ₹{FREE_SHIPPING_ABOVE - t.subtotal} more for FREE delivery.</p>
          )}
          <ul className="divide-y divide-slate-100">
            {lines.map((l) => (
              <li key={l.bookId} className="flex gap-4 py-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.imageUrl} alt="" className="h-28 w-20 object-contain bg-slate-50 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 line-clamp-2">{l.title}</p>
                  <p className="mt-1 text-xs text-emerald-700">{l.stock > 0 ? 'In stock' : 'Out of stock'}</p>
                  <p className="mt-1 text-sm"><b>₹{l.price.toLocaleString('en-IN')}</b>{l.mrp > l.price && <span className="ml-2 text-slate-400 line-through">₹{l.mrp.toLocaleString('en-IN')}</span>}</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button aria-label="Decrease" onClick={() => setQty(l.bookId, l.quantity - 1)} className="p-2 disabled:opacity-30" disabled={l.quantity <= 1}><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-semibold">{l.quantity}</span>
                      <button aria-label="Increase" onClick={() => setQty(l.bookId, l.quantity + 1)} className="p-2 disabled:opacity-30" disabled={l.quantity >= Math.min(10, l.stock)}><Plus className="w-3 h-3" /></button>
                    </div>
                    <button onClick={() => remove(l.bookId)} className="text-sm text-slate-500 hover:text-red-600 inline-flex items-center gap-1"><Trash2 className="w-4 h-4" /> Remove</button>
                  </div>
                </div>
                <p className="hidden sm:block font-semibold shrink-0">₹{(l.price * l.quantity).toLocaleString('en-IN')}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="lg:sticky lg:top-28 h-fit">
          <PriceSummary lines={lines} />
          {/* Desktop button */}
          <button onClick={proceed} className="hidden lg:block mt-4 w-full rounded-xl bg-gold py-3.5 font-bold text-white hover:bg-gold-dark">
            Proceed to Buy ({t.count} {t.count === 1 ? 'item' : 'items'})
          </button>
          <p className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-500"><ShieldCheck className="w-4 h-4" /> Safe and secure payments · Easy cancellation</p>
        </aside>
      </div>

      {/* Mobile sticky bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-slate-200 bg-white p-3">
        <div><p className="text-lg font-bold">₹{t.total.toLocaleString('en-IN')}</p>{t.savings > 0 && <p className="text-xs text-emerald-700">You save ₹{t.savings.toLocaleString('en-IN')}</p>}</div>
        <button onClick={proceed} className="rounded-xl bg-gold px-6 py-3 font-bold text-white">Proceed to Buy</button>
      </div>
    </div>
  );
}
