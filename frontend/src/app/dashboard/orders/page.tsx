'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, FileText, Package } from 'lucide-react';
import { api } from '@/lib/api';
import { deliveryBy } from '@/store/useCart';
import { OrderDto, openInvoice } from '@/lib/orders';

const STEPS = ['Paid', 'Shipped', 'Delivered'];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<string | null>(null);

  const cancel = async (o: OrderDto) => {
    if (!confirm(`Cancel order #${o.orderNumber}? You'll get a full refund.`)) return;
    try {
      await api(`/orders/${o.id}/cancel`, { method: 'POST', auth: 'user' });
      setOrders((list) => list?.map((x) => (x.id === o.id ? { ...x, status: 'Cancelled', cancelReason: 'Cancelled by customer' } : x)) ?? null);
    } catch (e) { alert((e as Error).message); }
  };

  useEffect(() => {
    setPlaced(new URLSearchParams(window.location.search).get('placed'));
    api<OrderDto[]>('/orders/mine', { auth: 'user' }).then(setOrders).catch((e) => setError(e.message));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-navy mb-6">My Orders</h1>
      {placed && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 shrink-0" /> Order {placed} placed successfully! A confirmation has been emailed to you.
        </div>
      )}
      {error && <p className="rounded-xl bg-red-50 p-4 text-red-600">{error}</p>}
      {orders === null && !error && <div className="h-40 rounded-2xl bg-slate-100 animate-pulse" />}
      {orders?.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <Package className="w-10 h-10 mx-auto mb-3 text-slate-300" /> No orders yet.{' '}
          <Link href="/books" className="text-gold font-semibold underline">Shop books</Link>
        </div>
      )}

      <div className="space-y-4">
        {orders?.map((o) => {
          const step = o.status === 'Delivered' ? 2 : o.status === 'Shipped' ? 1 : 0;
          const cancelled = o.status === 'Cancelled' || o.status === 'PaymentFailed';
          return (
            <div key={o.id} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                <div>
                  <Link href={`/dashboard/orders/${o.id}`} className="font-semibold text-navy hover:text-gold">#{o.orderNumber}</Link>
                  <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                </div>
                <p className="font-bold">₹{o.total.toLocaleString('en-IN')}</p>
              </div>

              {cancelled ? (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm">
                  <p className="font-semibold text-red-700">{o.status === 'Cancelled' ? 'Cancelled' : 'Payment failed'}{o.cancelReason ? ` — ${o.cancelReason}` : ''}</p>
                  {o.status === 'Cancelled' && <p className="text-red-600/80 text-xs mt-0.5">Refund of ₹{o.total.toLocaleString('en-IN')} initiated · reaches your account in 5-7 working days</p>}
                </div>
              ) : (
                <ol className="mb-4 grid grid-cols-3 gap-2">
                  {STEPS.map((s, i) => (
                    <li key={s} className="text-center">
                      <div className={`h-1.5 rounded-full ${i <= step ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                      <span className={`mt-1 block text-xs ${i <= step ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>{s}</span>
                    </li>
                  ))}
                </ol>
              )}

              <ul className="space-y-3">
                {o.items.map((it) => (
                  <li key={it.bookId} className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.imageUrl} alt="" className="h-14 w-10 object-contain bg-slate-50 rounded" />
                    <span className="flex-1 min-w-0 text-sm line-clamp-2">{it.title}</span>
                    <span className="text-sm text-slate-500 shrink-0">× {it.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm">
                <span className="text-slate-500">
                  {o.trackingNumber ? <>Tracking: <b className="text-slate-700">{o.courier} {o.trackingNumber}</b></> : o.status === 'Paid' ? `Arriving by ${deliveryBy(5)} · ${o.address.shipCity}` : `Ship to ${o.address.shipCity}, ${o.address.shipPincode}`}
                </span>
                {o.status === 'Paid' && (
                  <button onClick={() => cancel(o)} className="rounded-lg border border-red-200 px-3 py-1.5 font-semibold text-red-600 hover:bg-red-50">Cancel order</button>
                )}
                <Link href={`/dashboard/orders/${o.id}`} className="font-semibold text-navy underline">View details</Link>
                {['Paid', 'Shipped', 'Delivered'].includes(o.status) && (
                  <button onClick={() => openInvoice(o.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-navy px-3 py-1.5 font-semibold text-navy hover:bg-navy hover:text-white">
                    <FileText className="w-4 h-4" /> Invoice
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
