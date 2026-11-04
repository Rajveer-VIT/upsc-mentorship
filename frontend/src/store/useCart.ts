'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  publisher?: string;
  category?: string;
  description?: string;
  imageUrl: string;
  price: number;
  mrp: number;
  stock: number;
  isActive: boolean;
}

export interface CartLine {
  bookId: string;
  title: string;
  imageUrl: string;
  price: number;
  mrp: number;
  stock: number;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  add: (b: Book, qty?: number) => void;
  setQty: (bookId: string, qty: number) => void;
  remove: (bookId: string) => void;
  clear: () => void;
}

const MAX_QTY = 10;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (b, qty = 1) =>
        set((s) => {
          const cap = Math.min(MAX_QTY, b.stock);
          const existing = s.lines.find((l) => l.bookId === b.id);
          if (existing) {
            return { lines: s.lines.map((l) => (l.bookId === b.id ? { ...l, quantity: Math.min(cap, l.quantity + qty) } : l)) };
          }
          return {
            lines: [...s.lines, { bookId: b.id, title: b.title, imageUrl: b.imageUrl, price: b.price, mrp: b.mrp, stock: b.stock, quantity: Math.min(cap, qty) }],
          };
        }),
      setQty: (bookId, qty) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.bookId === bookId ? { ...l, quantity: Math.max(1, Math.min(qty, MAX_QTY, l.stock)) } : l)),
        })),
      remove: (bookId) => set((s) => ({ lines: s.lines.filter((l) => l.bookId !== bookId) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'upsc_cart' }
  )
);

export const FREE_SHIPPING_ABOVE = 499; // keep in sync with OrdersController
export const SHIPPING_FEE = 49;

export function cartTotals(lines: CartLine[]) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const mrpTotal = lines.reduce((s, l) => s + l.mrp * l.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_ABOVE ? 0 : SHIPPING_FEE;
  return { subtotal, mrpTotal, savings: mrpTotal - subtotal, shipping, total: subtotal + shipping, count: lines.reduce((s, l) => s + l.quantity, 0) };
}

/** Estimated delivery date (dispatch + transit), e.g. "Fri, 8 Nov". */
export const deliveryBy = (days = 5) =>
  new Date(Date.now() + days * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

export const discountPct = (price: number, mrp: number) => (mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0);
