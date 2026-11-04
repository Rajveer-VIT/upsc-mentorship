'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Book, discountPct } from '@/store/useCart';

/** Homepage strip of recommended books. Renders nothing until books exist. */
export const BooksTeaser = () => {
  const [books, setBooks] = useState<Book[]>([]);
  useEffect(() => {
    api<Book[]>('/books').then((b) => setBooks(b.filter((x) => x.stock > 0).slice(0, 8))).catch(() => {});
  }, []);
  if (books.length === 0) return null;

  return (
    <section className="py-14 md:py-20 bg-[#EEF3FB]" id="books">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-2">Book Store</p>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-navy">Books Eshwar Recommends</h2>
          </div>
          <Link href="/books" className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-gold">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto snap-x pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {books.slice(0, 4).map((b) => {
            const off = discountPct(b.price, b.mrp);
            return (
              <Link key={b.id} href={`/books/${b.slug}`} className="snap-start shrink-0 w-44 md:w-auto rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-slate-50 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.imageUrl} alt={b.title} loading="lazy" className="mx-auto h-40 md:h-52 w-auto object-contain" />
                </div>
                <div className="p-4 border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-900 line-clamp-2 min-h-[2.5rem]">{b.title}</p>
                  <p className="mt-2"><b>₹{b.price.toLocaleString('en-IN')}</b>{off > 0 && <span className="ml-2 text-xs text-slate-400 line-through">₹{b.mrp}</span>}</p>
                  {off > 0 && <span className="mt-1.5 inline-block rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">{off}% OFF</span>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
