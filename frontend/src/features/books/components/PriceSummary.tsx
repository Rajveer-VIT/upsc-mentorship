import React from 'react';
import { CartLine, cartTotals } from '@/store/useCart';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/** Flipkart-style "Price details" card shared by cart and checkout. */
export const PriceSummary = ({ lines }: { lines: CartLine[] }) => {
  const t = cartTotals(lines);
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Price details</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between"><dt>Price ({t.count} {t.count === 1 ? 'item' : 'items'})</dt><dd>{inr(t.mrpTotal)}</dd></div>
        {t.savings > 0 && <div className="flex justify-between"><dt>Discount</dt><dd className="text-emerald-700">− {inr(t.savings)}</dd></div>}
        <div className="flex justify-between"><dt>Delivery charges</dt><dd>{t.shipping === 0 ? <span className="text-emerald-700">FREE</span> : inr(t.shipping)}</dd></div>
        <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-base font-bold"><dt>Total amount</dt><dd>{inr(t.total)}</dd></div>
      </dl>
      {t.savings > 0 && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">You will save {inr(t.savings)} on this order</p>}
    </div>
  );
};
