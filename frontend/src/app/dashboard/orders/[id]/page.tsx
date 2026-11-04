'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronLeft, FileText, Truck } from 'lucide-react';
import { api } from '@/lib/api';
import { OrderDto, openInvoice } from '@/lib/orders';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const INVOICE_READY = ['Paid', 'Shipped', 'Delivered'];

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [o, setO] = useState<OrderDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);

  const load = () => api<OrderDto>(`/orders/${id}`, { auth: 'user' }).then(setO).catch((e) => setError(e.message));
  useEffect(() => { setPlaced(new URLSearchParams(window.location.search).has('placed')); load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const cancel = async () => {
    if (!o || !confirm(`Cancel order #${o.orderNumber}? You'll get a full refund.`)) return;
    try { await api(`/orders/${o.id}/cancel`, { method: 'POST', auth: 'user' }); load(); }
    catch (e) { alert((e as Error).message); }
  };

  if (error) return <p className="max-w-3xl mx-auto px-4 py-10 text-red-600">{error}</p>;
  if (!o) return <div className="max-w-3xl mx-auto px-4 py-10"><div className="h-64 rounded-2xl bg-slate-100 animate-pulse" /></div>;

  const steps = [
    { label: 'Order placed', date: o.paidAt ?? o.createdAt, done: true },
    { label: 'Shipped', date: o.shippedAt, done: !!o.shippedAt },
    { label: 'Delivered', date: o.deliveredAt, done: !!o.deliveredAt },
  ];
  const cancelled = o.status === 'Cancelled';

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-navy"><ChevronLeft className="w-4 h-4" /> My orders</Link>

      {placed && !cancelled && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
          <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
          <h1 className="mt-2 text-xl font-bold text-emerald-800">Order placed, thank you!</h1>
          <p className="text-sm text-emerald-700">Confirmation sent to {o.customerEmail}. Order #{o.orderNumber}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Order #{o.orderNumber}</p>
            <p className="text-sm text-slate-500">Placed on {fmt(o.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            {INVOICE_READY.includes(o.status) && (
              <button onClick={() => openInvoice(o.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-gold">
                <FileText className="w-4 h-4" /> Download invoice
              </button>
            )}
            {o.status === 'Paid' && <button onClick={cancel} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">Cancel</button>}
          </div>
        </div>

        {cancelled ? (
          <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <b>Cancelled</b>{o.cancelReason ? ` — ${o.cancelReason}` : ''}. Refund of {inr(o.total)} initiated; reaches your account in 5-7 working days.
          </div>
        ) : (
          <ol className="mt-6 grid grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.label} className="relative text-center">
                {i > 0 && <span className={`absolute top-3 right-1/2 w-full h-0.5 ${s.done ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
                <span className={`relative z-10 mx-auto flex h-6 w-6 items-center justify-center rounded-full ${s.done ? 'bg-emerald-500 text-white' : 'bg-slate-200'}`}>{s.done && <CheckCircle2 className="w-4 h-4" />}</span>
                <p className={`mt-2 text-xs sm:text-sm ${s.done ? 'font-semibold text-emerald-700' : 'text-slate-400'}`}>{s.label}</p>
                <p className="text-[11px] text-slate-400">{fmt(s.date)}</p>
              </li>
            ))}
          </ol>
        )}
        {o.trackingNumber && (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800"><Truck className="w-4 h-4" /> {o.courier} · Tracking no. <b>{o.trackingNumber}</b></p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        <h2 className="font-bold text-navy mb-3">Items</h2>
        <ul className="divide-y divide-slate-100">
          {o.items.map((it) => (
            <li key={it.bookId} className="flex items-center gap-4 py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.imageUrl} alt="" className="h-20 w-14 object-contain bg-slate-50 rounded shrink-0" />
              <div className="flex-1 min-w-0"><p className="text-sm font-medium line-clamp-2">{it.title}</p><p className="text-xs text-slate-500">Qty {it.quantity} × {inr(it.unitPrice)}</p></div>
              <p className="text-sm font-semibold">{inr(it.unitPrice * it.quantity)}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-sm">
          <h2 className="font-bold text-navy mb-2">Shipping address</h2>
          <p className="font-semibold">{o.address.shipName}</p>
          <p className="text-slate-600">{o.address.shipLine1}{o.address.shipLine2 ? `, ${o.address.shipLine2}` : ''}<br />{o.address.shipCity}, {o.address.shipState} - {o.address.shipPincode}</p>
          <p className="mt-1 text-slate-600">Phone: {o.address.shipPhone}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 text-sm">
          <h2 className="font-bold text-navy mb-2">Payment summary</h2>
          <dl className="space-y-1.5">
            <div className="flex justify-between"><dt>Items</dt><dd>{inr(o.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{o.shippingFee ? inr(o.shippingFee) : 'FREE'}</dd></div>
            <div className="flex justify-between border-t pt-2 font-bold"><dt>Total paid</dt><dd>{inr(o.total)}</dd></div>
          </dl>
          <p className="mt-2 text-xs text-slate-500">Paid online via Razorpay</p>
        </div>
      </div>
    </div>
  );
}
