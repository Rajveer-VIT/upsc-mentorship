'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronLeft, ShieldCheck, Truck } from 'lucide-react';
import { api } from '@/lib/api';
import { Book, useCart, discountPct, deliveryBy, FREE_SHIPPING_ABOVE } from '@/store/useCart';

export default function BookDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const add = useCart((s) => s.add);
  const cartLines = useCart((s) => s.lines);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    api<Book>(`/books/${encodeURIComponent(slug)}`).then(setBook).catch((e) => setError(e.message));
  }, [slug]);

  if (error) return <div className="min-h-screen pt-32 text-center text-slate-500">{error} <Link href="/books" className="text-gold underline">Back to books</Link></div>;
  if (!book) return <div className="min-h-screen pt-32 max-w-5xl mx-auto px-4"><div className="h-96 rounded-2xl bg-slate-100 animate-pulse" /></div>;

  const off = discountPct(book.price, book.mrp);
  const inCart = cartLines.some((l) => l.bookId === book.id);
  const out = book.stock <= 0;
  const maxQty = Math.min(10, book.stock);

  return (
    <div className="min-h-screen bg-background pt-28 md:pt-32 pb-28 md:pb-20">
      <Toaster position="bottom-center" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/books" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-navy mb-6">
          <ChevronLeft className="w-4 h-4" /> All books
        </Link>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 bg-white rounded-3xl border border-slate-200 p-5 sm:p-8">
          <div className="bg-slate-50 rounded-2xl p-6 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={book.imageUrl} alt={book.title} className="max-h-[420px] w-auto object-contain" />
          </div>
          <div className="min-w-0">
            {book.category && <p className="text-xs font-bold uppercase tracking-widest text-gold mb-2">{book.category}</p>}
            <h1 className="text-2xl sm:text-3xl font-bold text-navy break-words">{book.title}</h1>
            <p className="text-slate-500 mt-2">by {book.author}{book.publisher ? ` · ${book.publisher}` : ''}</p>

            <div className="mt-6 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-slate-900">₹{book.price.toLocaleString('en-IN')}</span>
              {off > 0 && <>
                <span className="text-lg text-slate-400 line-through">₹{book.mrp.toLocaleString('en-IN')}</span>
                <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-sm font-semibold text-emerald-700">{off}% OFF</span>
              </>}
            </div>
            <p className={`mt-2 text-sm font-medium ${out ? 'text-red-600' : book.stock < 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {out ? 'Out of stock' : book.stock < 5 ? `Only ${book.stock} left` : 'In stock'}
            </p>

            {!out && (
              <div className="mt-6 flex items-center gap-3">
                <label className="text-sm text-slate-600">Qty</label>
                <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="rounded-lg border border-slate-200 px-3 py-2">
                  {Array.from({ length: maxQty }, (_, i) => i + 1).map((n) => <option key={n}>{n}</option>)}
                </select>
              </div>
            )}

            {!out && <p className="mt-4 text-sm text-slate-700">Delivery by <b>{deliveryBy()}</b> · Cash-free secure checkout</p>}

            {/* Desktop: inline. Mobile: sticky bottom bar (Flipkart-style). */}
            <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3 md:static md:mt-6 md:border-0 md:p-0 md:gap-3">
              <button disabled={out} onClick={() => { if (inCart) return router.push('/cart'); add(book, qty); toast.success('Added to cart'); }}
                className="rounded-xl border-2 border-navy py-3 font-semibold text-navy hover:bg-navy hover:text-white disabled:opacity-40 transition-colors">
                {inCart ? 'Go to cart' : 'Add to cart'}
              </button>
              <button disabled={out} onClick={() => { if (!inCart) add(book, qty); router.push('/cart/checkout'); }}
                className="rounded-xl bg-gold py-3 font-semibold text-white hover:bg-gold-dark disabled:opacity-40 transition-colors">
                {out ? 'Out of stock' : 'Buy now'}
              </button>
            </div>

            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Truck className="w-4 h-4 text-gold" /> Free delivery on orders above ₹{FREE_SHIPPING_ABOVE}</p>
              <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gold" /> Secure payment via Razorpay · Invoice emailed on delivery</p>
            </div>

            {book.description && <p className="mt-6 text-slate-600 leading-relaxed whitespace-pre-line">{book.description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
