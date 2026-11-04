'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Search, ShoppingCart } from 'lucide-react';
import { api } from '@/lib/api';
import { Book, useCart, discountPct } from '@/store/useCart';

function BookCard({ book }: { book: Book }) {
  const add = useCart((s) => s.add);
  const inCart = useCart((s) => s.lines.some((l) => l.bookId === book.id));
  const router = useRouter();
  const off = discountPct(book.price, book.mrp);
  const out = book.stock <= 0;

  return (
    <div className="group flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/books/${book.slug}`} className="block bg-slate-50 p-4 sm:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.imageUrl}
          alt={book.title}
          loading="lazy"
          className="mx-auto h-44 sm:h-56 lg:h-64 w-auto object-contain transition-transform group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5 border-t border-slate-100">
        <Link href={`/books/${book.slug}`} className="text-sm sm:text-base font-medium text-slate-900 line-clamp-2 min-h-[2.75rem] hover:text-gold">
          {book.title}
        </Link>
        <div className="mt-3 flex items-baseline gap-2 flex-wrap">
          <span className="text-lg sm:text-xl font-bold text-slate-900">₹{book.price.toLocaleString('en-IN')}</span>
          {off > 0 && <span className="text-sm text-slate-400 line-through">₹{book.mrp.toLocaleString('en-IN')}</span>}
        </div>
        {off > 0 && (
          <span className="mt-2 self-start rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs sm:text-sm font-semibold text-emerald-700">
            GET {off}% OFF
          </span>
        )}
        <button
          disabled={out}
          onClick={() => { if (inCart) return router.push('/cart'); add(book); toast.success('Added to cart'); }}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          <ShoppingCart className="w-4 h-4" /> {out ? 'Out of stock' : inCart ? 'Go to cart' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('relevance');

  useEffect(() => {
    api<Book[]>('/books').then(setBooks).catch((e) => setError(e.message));
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set((books ?? []).map((b) => b.category).filter(Boolean) as string[]))],
    [books]
  );
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = (books ?? []).filter(
      (b) => (cat === 'All' || b.category === cat) &&
        (!term || b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term))
    );
    const sorters: Record<string, (a: Book, b: Book) => number> = {
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      discount: (a, b) => discountPct(b.price, b.mrp) - discountPct(a.price, a.mrp),
    };
    const sorted = sorters[sort] ? [...list].sort(sorters[sort]) : list;
    return sorted.sort((a, b) => Number(a.stock <= 0) - Number(b.stock <= 0)); // out-of-stock last
  }, [books, q, cat, sort]);

  return (
    <div className="min-h-screen bg-[#EEF3FB] pt-28 md:pt-32 pb-20">
      <Toaster position="bottom-center" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-2">Book Store</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-navy">Recommended UPSC Books</h1>
            <p className="text-slate-500 mt-2">Hand-picked by Eshwar. Delivered to your door.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title or author"
              className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gold"
            />
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex-1 min-w-0 flex gap-2 overflow-x-auto pb-1">
            {categories.length > 2 && categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium border ${cat === c ? 'bg-navy text-white border-navy' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort" className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="relevance">Sort: Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>
        {error && <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {books === null && !error
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-80 sm:h-96 rounded-2xl bg-white animate-pulse" />)
            : filtered.map((b) => <BookCard key={b.id} book={b} />)}
        </div>

        {books && filtered.length === 0 && <p className="text-center text-slate-500 py-16">No books found.</p>}
      </div>
    </div>
  );
}
