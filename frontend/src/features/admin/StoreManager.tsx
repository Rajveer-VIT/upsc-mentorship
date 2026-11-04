'use client';

import React, { useCallback, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Download, FileText, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { OrderDto, openInvoice } from '@/lib/orders';
import type { Book } from '@/store/useCart';

type BookForm = Omit<Book, 'id' | 'slug'>;
const EMPTY: BookForm = { title: '', author: '', publisher: '', category: '', description: '', imageUrl: '', price: 0, mrp: 0, stock: 0, isActive: true };
const input = 'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold';
const STATUS_COLORS: Record<string, string> = {
  Paid: 'bg-blue-50 text-blue-700', Shipped: 'bg-amber-50 text-amber-700', Delivered: 'bg-emerald-50 text-emerald-700',
  Cancelled: 'bg-red-50 text-red-700', PaymentFailed: 'bg-red-50 text-red-700',
};

export function StoreManager({ initialTab = 'orders', embedded = false }: { initialTab?: 'orders' | 'books'; embedded?: boolean }) {
  const [tab, setTab] = useState<'orders' | 'books'>(initialTab);
  const [q, setQ] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [filter, setFilter] = useState('');
  const [summary, setSummary] = useState<{ toShip: number; inTransit: number; revenue30d: number; orders30d: number; lowStock: number; activeBooks: number } | null>(null);
  const [editing, setEditing] = useState<{ id?: string; form: BookForm } | null>(null);

  const load = useCallback(() => {
    api<typeof summary>('/orders/admin/summary', { auth: 'admin' }).then(setSummary).catch(() => {});
    api<Book[]>('/books?all=true', { auth: 'admin' }).then(setBooks).catch((e) => toast.error(e.message));
    api<OrderDto[]>(`/orders/admin${filter ? `?status=${filter}` : ''}`, { auth: 'admin' }).then(setOrders).catch((e) => toast.error(e.message));
  }, [filter]);
  useEffect(load, [load]);

  const saveBook = async () => {
    if (!editing) return;
    try {
      await api(editing.id ? `/books/${editing.id}` : '/books', { method: editing.id ? 'PUT' : 'POST', auth: 'admin', body: JSON.stringify(editing.form) });
      toast.success('Saved'); setEditing(null); load();
    } catch (e) { toast.error((e as Error).message); }
  };

  const deleteBook = async (b: Book) => {
    if (!confirm(`Delete "${b.title}"?`)) return;
    try { await api(`/books/${b.id}`, { method: 'DELETE', auth: 'admin' }); toast.success('Deleted'); load(); }
    catch (e) { toast.error((e as Error).message); }
  };

  const setStatus = async (o: OrderDto, status: 'Shipped' | 'Delivered' | 'Cancelled') => {
    let courier: string | null = null, trackingNumber: string | null = null;
    if (status === 'Shipped') {
      courier = prompt('Courier name (e.g. India Post, Delhivery)');
      if (courier === null) return;
      trackingNumber = prompt('Tracking number');
      if (trackingNumber === null) return;
    } else if (!confirm(`Mark order ${o.orderNumber} as ${status}?${status === 'Delivered' ? ' The invoice will be emailed to the customer.' : ' Stock is restored and the customer is refunded in full via Razorpay.'}`)) return;
    try { await api(`/orders/${o.id}/status`, { method: 'PUT', auth: 'admin', body: JSON.stringify({ status, courier, trackingNumber }) }); toast.success('Updated'); load(); }
    catch (e) { toast.error((e as Error).message); }
  };

  const term = q.trim().toLowerCase();
  const shownOrders = orders.filter((o) => !term || [o.orderNumber, o.customer, o.customerEmail, o.address.shipPhone, o.address.shipCity].some((v) => v?.toLowerCase().includes(term)));
  const shownBooks = books.filter((b) => !term || [b.title, b.author, b.category ?? ''].some((v) => v.toLowerCase().includes(term)));

  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = tab === 'orders'
      ? [['Order', 'Date', 'Status', 'Customer', 'Email', 'Phone', 'Address', 'Items', 'Total', 'Courier', 'Tracking'],
         ...shownOrders.map((o) => [o.orderNumber, new Date(o.createdAt).toLocaleString('en-IN'), o.status, o.address.shipName, o.customerEmail, o.address.shipPhone,
           `${o.address.shipLine1} ${o.address.shipLine2 ?? ''}, ${o.address.shipCity}, ${o.address.shipState} ${o.address.shipPincode}`,
           o.items.map((i) => `${i.title} x${i.quantity}`).join('; '), o.total, o.courier, o.trackingNumber])]
      : [['Title', 'Author', 'Publisher', 'Category', 'Price', 'MRP', 'Stock', 'Visible'],
         ...shownBooks.map((b) => [b.title, b.author, b.publisher, b.category, b.price, b.mrp, b.stock, b.isActive ? 'Yes' : 'No'])];
    const BOM = '﻿'; // so Excel opens UTF-8 (₹, Hindi names) correctly
    const blob = new Blob([BOM + rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const f = editing?.form;
  const set = (k: keyof BookForm, v: string | number | boolean) => editing && setEditing({ ...editing, form: { ...editing.form, [k]: v } });

  return (
    <div className={embedded ? 'text-slate-900' : 'max-w-6xl mx-auto px-4 py-8'}>
      <Toaster />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        {!embedded && <h1 className="text-2xl font-bold text-navy">Book Store</h1>}
        <div className="flex rounded-xl bg-slate-100 p-1">
          {(['orders', 'books'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-1.5 text-sm font-semibold capitalize ${tab === t ? 'bg-white shadow text-navy' : 'text-slate-500'}`}>{t}</button>
          ))}
        </div>
      </div>

      {summary && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'To ship', value: summary.toShip, tone: 'text-blue-700', onClick: () => { setTab('orders'); setFilter('Paid'); } },
            { label: 'In transit', value: summary.inTransit, tone: 'text-amber-700', onClick: () => { setTab('orders'); setFilter('Shipped'); } },
            { label: 'Revenue (30d)', value: `₹${summary.revenue30d.toLocaleString('en-IN')}`, sub: `${summary.orders30d} orders`, tone: 'text-emerald-700' },
            { label: 'Low stock', value: summary.lowStock, sub: `of ${summary.activeBooks} books`, tone: summary.lowStock ? 'text-red-600' : 'text-slate-700', onClick: () => setTab('books') },
          ].map((c) => (
            <button key={c.label} onClick={c.onClick} className="text-left rounded-2xl border border-slate-200 bg-white p-4 hover:border-gold transition-colors">
              <p className="text-xs uppercase tracking-wider text-slate-500">{c.label}</p>
              <p className={`mt-1 text-2xl font-bold ${c.tone}`}>{c.value}</p>
              {c.sub && <p className="text-xs text-slate-400">{c.sub}</p>}
            </button>
          ))}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tab === 'orders' ? 'Search order no, name, email, phone, city' : 'Search title, author, category'}
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold" />
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-navy hover:border-gold">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {tab === 'books' && (
        <>
          <button onClick={() => setEditing({ form: EMPTY })} className="mb-4 inline-flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-gold"><Plus className="w-4 h-4" /> Add book</button>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-3">Book</th><th className="p-3">Price</th><th className="p-3">MRP</th><th className="p-3">Stock</th><th className="p-3">Status</th><th className="p-3" /></tr></thead>
              <tbody>
                {shownBooks.map((b) => (
                  <tr key={b.id} className="border-t border-slate-100">
                    <td className="p-3"><div className="flex items-center gap-3">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={b.imageUrl} alt="" className="h-12 w-9 object-contain" /><span className="line-clamp-2">{b.title}</span></div></td>
                    <td className="p-3">₹{b.price}</td><td className="p-3">₹{b.mrp}</td>
                    <td className={`p-3 ${b.stock < 5 ? 'text-red-600 font-semibold' : ''}`}>{b.stock}</td>
                    <td className="p-3">{b.isActive ? 'Active' : 'Hidden'}</td>
                    <td className="p-3 whitespace-nowrap text-right">
                      <button aria-label="Edit" onClick={() => { const { id, slug: _s, ...form } = b; void _s; setEditing({ id, form }); }} className="p-2 text-slate-500 hover:text-navy"><Pencil className="w-4 h-4" /></button>
                      <button aria-label="Delete" onClick={() => deleteBook(b)} className="p-2 text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
                {books.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-400">No books yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'orders' && (
        <>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="mb-4 rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="">All orders</option>{['Paid', 'Shipped', 'Delivered', 'Cancelled'].map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="space-y-3">
            {shownOrders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-navy">#{o.orderNumber} <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${STATUS_COLORS[o.status] ?? ''}`}>{o.status}</span></p>
                    <p className="text-xs text-slate-500">{new Date(o.createdAt).toLocaleString('en-IN')} · {o.customer} · {o.customerEmail}</p>
                  </div>
                  <p className="font-bold">₹{o.total.toLocaleString('en-IN')}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">{o.items.map((i) => `${i.title} × ${i.quantity}`).join(', ')}</p>
                <p className="mt-1 text-xs text-slate-500">{o.address.shipName}, {o.address.shipPhone} — {o.address.shipLine1} {o.address.shipLine2}, {o.address.shipCity}, {o.address.shipState} {o.address.shipPincode}</p>
                {o.trackingNumber && <p className="mt-1 text-xs">Tracking: {o.courier} {o.trackingNumber}</p>}
                {o.status === 'Cancelled' && <p className="mt-1 text-xs text-red-600">{o.cancelReason}{o.refundId ? ` · Refund ${o.refundId}` : ' · Refund pending — check Razorpay'}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {o.status === 'Paid' && <button onClick={() => setStatus(o, 'Shipped')} className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white">Mark shipped</button>}
                  {(o.status === 'Paid' || o.status === 'Shipped') && <button onClick={() => setStatus(o, 'Delivered')} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white">Mark delivered</button>}
                  {(o.status === 'Paid' || o.status === 'Shipped') && <button onClick={() => setStatus(o, 'Cancelled')} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600">Cancel</button>}
                  {['Paid', 'Shipped', 'Delivered'].includes(o.status) && <button onClick={() => openInvoice(o.id, 'admin')} className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold"><FileText className="w-3 h-3" /> Invoice</button>}
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="py-12 text-center text-slate-400">No orders.</p>}
          </div>
        </>
      )}

      {editing && f && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4" onClick={() => setEditing(null)}>
          <div className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between"><h2 className="font-bold text-navy">{editing.id ? 'Edit book' : 'Add book'}</h2><button aria-label="Close" onClick={() => setEditing(null)}><X className="w-5 h-5" /></button></div>
            <div className="grid grid-cols-2 gap-3">
              <input className={`${input} col-span-2`} placeholder="Title *" value={f.title} onChange={(e) => set('title', e.target.value)} />
              <input className={input} placeholder="Author" value={f.author} onChange={(e) => set('author', e.target.value)} />
              <input className={input} placeholder="Publisher" value={f.publisher ?? ''} onChange={(e) => set('publisher', e.target.value)} />
              <input className={input} placeholder="Category (e.g. Polity)" value={f.category ?? ''} onChange={(e) => set('category', e.target.value)} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.isActive} onChange={(e) => set('isActive', e.target.checked)} /> Visible in store</label>
              <input className={`${input} col-span-2`} placeholder="Cover image URL *" value={f.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
              <label className="text-xs text-slate-500">Price ₹<input type="number" min={0} className={input} value={f.price} onChange={(e) => set('price', Number(e.target.value))} /></label>
              <label className="text-xs text-slate-500">MRP ₹<input type="number" min={0} className={input} value={f.mrp} onChange={(e) => set('mrp', Number(e.target.value))} /></label>
              <label className="text-xs text-slate-500">Stock<input type="number" min={0} className={input} value={f.stock} onChange={(e) => set('stock', Number(e.target.value))} /></label>
              <textarea className={`${input} col-span-2`} rows={4} placeholder="Description" value={f.description ?? ''} onChange={(e) => set('description', e.target.value)} />
            </div>
            <button onClick={saveBook} className="mt-4 w-full rounded-xl bg-gold py-3 font-semibold text-white hover:bg-gold-dark">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
